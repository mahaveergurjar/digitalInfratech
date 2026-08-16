const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AuthCode = require("../models/authCode.model");
const Session = require("../models/session.model");
const { app, auth, nodeEnv } = require("../config/env");
const {
  addMinutes,
  generateOtp,
  hashValue,
  randomToken,
} = require("../utils/crypto");
const { sendMail } = require("./mail.service");

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    status: user.status,
    emailVerified: user.emailVerified,
    emailVerifiedAt: user.emailVerifiedAt,
    lastLoginAt: user.lastLoginAt,
    partner: user.partner
      ? {
          applicationStatus: user.partner.applicationStatus,
          companyName: user.partner.companyName,
          city: user.partner.city,
          serviceCategories: user.partner.serviceCategories || [],
          serviceAreas: user.partner.serviceAreas || [],
          bio: user.partner.bio,
          experienceYears: user.partner.experienceYears,
          maxConcurrentJobs: user.partner.maxConcurrentJobs,
          activeJobs: user.partner.activeJobs,
          completedJobs: user.partner.completedJobs,
          cancelledJobs: user.partner.cancelledJobs,
          onTimeRate: user.partner.onTimeRate,
          efficiencyScore: user.partner.efficiencyScore,
          ratingAverage: user.partner.ratingAverage,
          ratingCount: user.partner.ratingCount,
          applicationNote: user.partner.applicationNote,
          rejectionReason: user.partner.rejectionReason,
          approvedAt: user.partner.approvedAt,
          reviewedAt: user.partner.reviewedAt,
          lastAssignmentAt: user.partner.lastAssignmentAt,
          lastCompletionAt: user.partner.lastCompletionAt,
        }
      : null,
  };
}

function isPartnerEligible(user) {
  return ["approved", "active"].includes(user?.partner?.applicationStatus);
}

function assertLoginEligible(user) {
  if (!user.emailVerified || user.status !== "active") {
    throw { status: 403, message: "Verify your email before logging in" };
  }

  if (user.role === "partner" && !isPartnerEligible(user)) {
    throw { status: 403, message: "Partner application is pending review" };
  }
}

function getAuthVersion(user) {
  return Number.isFinite(Number(user?.authVersion))
    ? Number(user.authVersion)
    : 0;
}

function createAccessToken(user, sessionId) {
  return jwt.sign(
    {
      sub: String(user._id),
      sid: String(sessionId),
      role: user.role,
      ver: getAuthVersion(user),
      type: "access",
    },
    auth.accessTokenSecret,
    { expiresIn: auth.accessTokenExpiresIn },
  );
}

function createRefreshToken(user, sessionId) {
  return jwt.sign(
    {
      sub: String(user._id),
      sid: String(sessionId),
      ver: getAuthVersion(user),
      type: "refresh",
    },
    auth.refreshTokenSecret,
    { expiresIn: auth.refreshTokenExpiresIn },
  );
}

function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>"]/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
      })[ch],
  );
}

function buildOtpPreviewPayload({
  code,
  expiresAt,
  ttlMinutes,
  fieldName = "code",
}) {
  const expiryDate =
    expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
  const secondsRemaining = Math.max(
    0,
    Math.floor((expiryDate.getTime() - Date.now()) / 1000),
  );

  const payload = {
    expiresAt: expiryDate.toISOString(),
    expiresInSeconds: secondsRemaining,
    expiresInMinutes: Number(ttlMinutes),
  };

  if (fieldName === "verificationCode") {
    return { verificationCode: code, ...payload };
  }

  if (fieldName === "resetCode") {
    return { resetCode: code, ...payload };
  }

  return { code, ...payload };
}

function buildEmailTemplate({
  preheader,
  title,
  heading,
  message,
  primaryLabel,
  primaryUrl,
  secondaryText = "",
  secondaryUrl = "",
  code = "",
  footerNote = "",
}) {
  const safePreheader = escapeHtml(preheader);
  const safeTitle = escapeHtml(title);
  const safeHeading = escapeHtml(heading);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const safePrimaryLabel = escapeHtml(primaryLabel);
  const safePrimaryUrl = escapeHtml(primaryUrl);
  const safeSecondaryText = escapeHtml(secondaryText);
  const safeSecondaryUrl = escapeHtml(secondaryUrl);
  const safeFooterNote = escapeHtml(footerNote);
  const codeBlocks = code
    ? `<div style="margin: 28px 0 20px; display: grid; gap: 12px; text-align: center;">
        <div style="font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #64748b;">Your verification code</div>
        <div style="font-size: 30px; letter-spacing: 0.24em; font-weight: 800; color: #0f172a;">${escapeHtml(String(code))}</div>
        <div style="display: inline-flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
          ${String(code)
            .split("")
            .map(
              (digit) =>
                `<span style="display: inline-flex; width: 42px; height: 52px; align-items: center; justify-content: center; border-radius: 12px; border: 1px solid #dbe4f0; background: #f8fafc; font-size: 24px; font-weight: 700; letter-spacing: 0.08em; color: #0f172a;">${escapeHtml(digit)}</span>`,
            )
            .join("")}
        </div>
      </div>`
    : "";

  const secondaryBlock = safeSecondaryText
    ? `<p style="margin: 18px 0 0; font-size: 14px; line-height: 1.7; color: #475569;">
        ${safeSecondaryText}
        ${safeSecondaryUrl ? ` <a href="${safeSecondaryUrl}" style="color: #0f172a; font-weight: 600; text-decoration: none;">Open link</a>` : ""}
      </p>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
  </head>
  <body style="margin:0; padding:0; background:#f1f5f9; font-family: Arial, Helvetica, sans-serif; color:#0f172a;">
    <span style="display:none !important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden;">${safePreheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(180deg, #eaf1ff 0%, #f8fafc 44%, #f1f5f9 100%); padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 18px 50px rgba(15, 23, 42, 0.12);">
            <tr>
              <td style="padding: 28px 32px 18px; background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);">
                <div style="font-size: 13px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.72);">DigitalInfraTech</div>
                <h1 style="margin: 10px 0 0; font-size: 28px; line-height: 1.2; color: #ffffff;">${safeHeading}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px;">
                <p style="margin: 0; font-size: 16px; line-height: 1.8; color: #334155;">${safeMessage}</p>
                ${codeBlocks}
                <div style="text-align: center; margin: 30px 0 18px;">
                  <a href="${safePrimaryUrl}" style="display:inline-block; background:#0f172a; color:#ffffff; text-decoration:none; font-weight:700; padding:14px 22px; border-radius: 12px; font-size: 15px;">${safePrimaryLabel}</a>
                </div>
                ${secondaryBlock}
                ${safeFooterNote ? `<p style="margin: 22px 0 0; font-size: 13px; line-height: 1.7; color: #64748b;">${safeFooterNote}</p>` : ""}
                <p style="margin: 28px 0 0; font-size: 13px; line-height: 1.7; color: #94a3b8;">
                  If you did not request this email, you can safely ignore it.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function createEmailVerification(user) {
  const code = generateOtp();
  const codeHash = hashValue(code);
  const expiresAt = addMinutes(new Date(), auth.emailVerificationTtlMinutes);

  await AuthCode.updateMany(
    { user: user._id, type: "email_verification", consumedAt: null },
    { $set: { consumedAt: new Date() } },
  );

  await AuthCode.create({
    user: user._id,
    type: "email_verification",
    codeHash,
    expiresAt,
    metadata: { email: user.email },
  });

  const minutes = auth.emailVerificationTtlMinutes;
  const preview = buildOtpPreviewPayload({
    code,
    expiresAt,
    ttlMinutes: minutes,
    fieldName: "verificationCode",
  });
  const text = [
    "Welcome to DigitalInfraTech,",
    "",
    `Your email verification code is ${code}.`,
    "",
    `This code expires in ${minutes} minutes.`,
    "",
    "If you did not create this account, you can ignore this email.",
  ].join("\n");

  await sendMail({
    to: user.email,
    subject: "Verify your DigitalInfraTech account",
    text,
    html: buildEmailTemplate({
      preheader:
        "Use this code to finish creating your DigitalInfraTech account.",
      title: "Verify your email",
      heading: "Welcome to DigitalInfraTech",
      message: `Thanks for joining DigitalInfraTech. To activate your account, enter the verification code in the verification form.\n\nThis code expires in ${minutes} minutes.`,
      primaryLabel: "Open verification form",
      primaryUrl: `${app.baseUrl.replace(/\/$/, "")}/api/auth/verify-email`,
      code,
      footerNote:
        "This step helps keep your account secure and ensures you receive important updates.",
    }),
    developmentPreview: preview,
  });

  return nodeEnv === "production" ? null : preview;
}

async function createLoginChallenge(user) {
  const code = generateOtp();
  const expiresAt = addMinutes(new Date(), auth.loginCodeTtlMinutes);

  await AuthCode.updateMany(
    { user: user._id, type: "login_2fa", consumedAt: null },
    { $set: { consumedAt: new Date() } },
  );

  const challenge = await AuthCode.create({
    user: user._id,
    type: "login_2fa",
    codeHash: hashValue(code),
    expiresAt,
    metadata: { email: user.email },
  });

  const minutes = auth.loginCodeTtlMinutes;
  const preview = buildOtpPreviewPayload({
    code,
    expiresAt,
    ttlMinutes: minutes,
    fieldName: "code",
  });
  const text = [
    "Your DigitalInfraTech sign-in code is below.",
    "",
    `Code: ${code}`,
    "",
    `It expires in ${minutes} minutes.`,
    "",
    "If you did not try to sign in, please ignore this email.",
  ].join("\n");

  await sendMail({
    to: user.email,
    subject: "Your DigitalInfraTech sign-in code",
    text,
    html: buildEmailTemplate({
      preheader: "Use this one-time code to complete your sign-in.",
      title: "Sign-in code",
      heading: "Complete your login",
      message: `Use the one-time code below to finish signing in to your DigitalInfraTech account. The code expires in ${minutes} minutes.`,
      primaryLabel: "Open login",
      primaryUrl: `${app.baseUrl.replace(/\/$/, "")}/login`,
      code,
      footerNote: "For security, never share this code with anyone.",
    }),
    developmentPreview: {
      challengeId: String(challenge._id),
      ...preview,
    },
  });

  return {
    challengeId: challenge._id,
    expiresInSeconds: auth.loginCodeTtlMinutes * 60,
    expiresInMinutes: auth.loginCodeTtlMinutes,
    expiresAt: expiresAt.toISOString(),
    developmentPreview:
      nodeEnv === "production"
        ? null
        : {
            challengeId: String(challenge._id),
            ...preview,
          },
  };
}

async function createPasswordReset(user) {
  const code = generateOtp();
  const codeHash = hashValue(code);
  const expiresAt = addMinutes(new Date(), auth.passwordResetTtlMinutes);

  await AuthCode.updateMany(
    { user: user._id, type: "password_reset", consumedAt: null },
    { $set: { consumedAt: new Date() } },
  );

  await AuthCode.create({
    user: user._id,
    type: "password_reset",
    codeHash,
    expiresAt,
    metadata: { email: user.email },
  });

  const minutes = auth.passwordResetTtlMinutes;
  const preview = buildOtpPreviewPayload({
    code,
    expiresAt,
    ttlMinutes: minutes,
    fieldName: "resetCode",
  });
  const text = [
    "We received a request to reset your DigitalInfraTech password.",
    "",
    `Your password reset code is ${code}.`,
    "",
    `This code expires in ${minutes} minutes.`,
    "",
    "If you did not request a password reset, you can ignore this email.",
  ].join("\n");

  await sendMail({
    to: user.email,
    subject: "Reset your DigitalInfraTech password",
    text,
    html: buildEmailTemplate({
      preheader: "Use this code to reset your DigitalInfraTech password.",
      title: "Reset password",
      heading: "Reset your password",
      message: `We received a request to reset the password for your DigitalInfraTech account. Enter the code in the reset form and choose a new password.\n\nThis code expires in ${minutes} minutes.`,
      primaryLabel: "Open reset form",
      primaryUrl: `${app.baseUrl.replace(/\/$/, "")}/api/auth/reset-password`,
      code,
      footerNote: "For your security, the code can only be used once.",
    }),
    developmentPreview: preview,
  });

  return nodeEnv === "production" ? null : preview;
}

async function findActiveCode(type, code) {
  const codeHash = hashValue(code);
  const record = await AuthCode.findOne({
    type,
    codeHash,
    consumedAt: null,
    expiresAt: { $gt: new Date() },
  }).populate("user");

  if (!record) {
    throw { status: 400, message: "Invalid or expired token" };
  }

  return record;
}

async function issueSession(user, context = {}) {
  const session = await Session.create({
    user: user._id,
    tokenHash: "pending",
    expiresAt: addMinutes(new Date(), auth.refreshTokenTtlMinutes),
    ipAddress: context.ipAddress || null,
    userAgent: context.userAgent || null,
  });

  const refreshToken = createRefreshToken(user, session._id);
  session.tokenHash = hashValue(refreshToken);
  session.lastUsedAt = new Date();
  await session.save();

  user.lastLoginAt = new Date();
  await user.save();

  return {
    accessToken: createAccessToken(user, session._id),
    refreshToken,
    user: sanitizeUser(user),
  };
}

module.exports = {
  buildOtpPreviewPayload,
  register: async (data) => {
    const email = normalizeEmail(data.email);
    const role = data.role === "partner" ? "partner" : "customer";
    const existing = await User.findOne({ email }).select("+password");

    if (existing && existing.emailVerified) {
      throw { status: 409, message: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(data.password, auth.bcryptRounds);
    const partnerState = role === "partner" ? "pending_review" : "not_applied";
    const partnerPayload =
      role === "partner"
        ? {
            applicationStatus: partnerState,
            companyName: String(data.companyName || "").trim(),
            city: String(data.city || "").trim(),
            serviceCategories: Array.isArray(data.serviceCategories)
              ? data.serviceCategories
                  .map((item) => String(item).trim())
                  .filter(Boolean)
              : String(data.serviceCategories || "")
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
            serviceAreas: Array.isArray(data.serviceAreas)
              ? data.serviceAreas
                  .map((item) => String(item).trim())
                  .filter(Boolean)
              : String(data.serviceAreas || "")
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
            bio: String(data.bio || "").trim(),
            experienceYears: Number.isFinite(Number(data.experienceYears))
              ? Number(data.experienceYears)
              : 0,
            maxConcurrentJobs: Number.isFinite(Number(data.maxConcurrentJobs))
              ? Number(data.maxConcurrentJobs)
              : 3,
            applicationNote: String(data.applicationNote || "").trim(),
          }
        : undefined;

    const user = existing
      ? await User.findByIdAndUpdate(
          existing._id,
          {
            $set: {
              name: data.name.trim(),
              email,
              phone: String(data.phone || "").trim(),
              password: hashedPassword,
              role,
              status: "pending_verification",
              emailVerified: false,
              emailVerifiedAt: null,
              ...(partnerPayload ? { partner: partnerPayload } : {}),
            },
          },
          { new: true },
        )
      : await User.create({
          name: data.name.trim(),
          email,
          phone: String(data.phone || "").trim(),
          password: hashedPassword,
          role,
          partner: partnerPayload,
        });

    const preview = await createEmailVerification(user);

    return {
      success: true,
      message:
        "Registration successful. Please verify your email before logging in.",
      user: sanitizeUser(user),
      developmentPreview: preview,
    };
  },

  verifyEmail: async (token) => {
    const verification = await findActiveCode("email_verification", token);
    const user = verification.user;

    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.status = "active";
    await user.save();

    verification.consumedAt = new Date();
    await verification.save();

    await AuthCode.updateMany(
      { user: user._id, type: "email_verification", consumedAt: null },
      { $set: { consumedAt: new Date() } },
    );

    return {
      success: true,
      message: "Email verified successfully.",
      user: sanitizeUser(user),
    };
  },

  resendVerification: async (data) => {
    const email = normalizeEmail(data.email);
    const user = await User.findOne({ email });

    if (!user || user.emailVerified) {
      return {
        success: true,
        message:
          "If an unverified account exists for that email, a verification email has been sent.",
      };
    }

    const preview = await createEmailVerification(user);

    return {
      success: true,
      message:
        "If an unverified account exists for that email, a verification email has been sent.",
      developmentPreview: preview,
    };
  },

  login: async (data) => {
    const email = normalizeEmail(data.email);
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw { status: 401, message: "Invalid credentials" };
    }

    assertLoginEligible(user);

    const matches = await bcrypt.compare(data.password, user.password);
    if (!matches) {
      throw { status: 401, message: "Invalid credentials" };
    }

    const challenge = await createLoginChallenge(user);

    return {
      success: true,
      message:
        "Password verified. Enter the code sent to your email to complete login.",
      ...challenge,
    };
  },

  verifyLoginCode: async (data, context = {}) => {
    const challenge = await AuthCode.findOne({
      _id: data.challengeId,
      type: "login_2fa",
      consumedAt: null,
    }).populate("user");

    if (!challenge || challenge.expiresAt <= new Date()) {
      throw { status: 400, message: "Invalid or expired login challenge" };
    }

    assertLoginEligible(challenge.user);

    if (challenge.attempts >= auth.loginCodeMaxAttempts) {
      throw {
        status: 429,
        message: "Too many invalid attempts. Start login again.",
      };
    }

    if (hashValue(data.code) !== challenge.codeHash) {
      challenge.attempts += 1;
      await challenge.save();
      throw { status: 401, message: "Invalid verification code" };
    }

    challenge.consumedAt = new Date();
    await challenge.save();

    return issueSession(challenge.user, context);
  },

  resendLoginCode: async (challengeId) => {
    const challenge = await AuthCode.findOne({
      _id: challengeId,
      type: "login_2fa",
      consumedAt: null,
    }).populate("user");

    if (!challenge || challenge.expiresAt <= new Date()) {
      throw { status: 400, message: "Invalid or expired login challenge" };
    }

    assertLoginEligible(challenge.user);

    const nextChallenge = await createLoginChallenge(challenge.user);
    challenge.consumedAt = new Date();
    await challenge.save();

    return {
      success: true,
      message: "A new verification code has been sent.",
      ...nextChallenge,
    };
  },

  refreshSession: async (refreshToken, context = {}) => {
    let payload;
    try {
      payload = jwt.verify(refreshToken, auth.refreshTokenSecret);
    } catch (err) {
      throw { status: 401, message: "Invalid or expired refresh token" };
    }

    if (payload.type !== "refresh") {
      throw { status: 401, message: "Invalid refresh token" };
    }

    const session = await Session.findById(payload.sid).populate("user");
    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      throw { status: 401, message: "Refresh session is no longer valid" };
    }

    if (hashValue(refreshToken) !== session.tokenHash) {
      session.revokedAt = new Date();
      await session.save();
      throw { status: 401, message: "Refresh session is no longer valid" };
    }

    if (!session.user) {
      session.revokedAt = new Date();
      await session.save();
      throw { status: 401, message: "Refresh session is no longer valid" };
    }

    if (Number(payload.ver || 0) !== getAuthVersion(session.user)) {
      session.revokedAt = new Date();
      await session.save();
      throw { status: 401, message: "Refresh session is no longer valid" };
    }

    try {
      assertLoginEligible(session.user);
    } catch (err) {
      session.revokedAt = new Date();
      await session.save();
      throw { status: 401, message: "Refresh session is no longer valid" };
    }

    const nextRefreshToken = createRefreshToken(session.user, session._id);
    session.tokenHash = hashValue(nextRefreshToken);
    session.lastUsedAt = new Date();
    session.ipAddress = context.ipAddress || session.ipAddress;
    session.userAgent = context.userAgent || session.userAgent;
    await session.save();

    return {
      accessToken: createAccessToken(session.user, session._id),
      refreshToken: nextRefreshToken,
      user: sanitizeUser(session.user),
    };
  },

  logout: async (refreshToken) => {
    if (!refreshToken) {
      return { success: true, message: "Logged out" };
    }

    try {
      const payload = jwt.verify(refreshToken, auth.refreshTokenSecret);
      const session = await Session.findById(payload.sid);

      if (session && !session.revokedAt) {
        session.revokedAt = new Date();
        await session.save();
      }
    } catch (err) {
      // Keep logout idempotent.
    }

    return { success: true, message: "Logged out" };
  },

  forgotPassword: async (data) => {
    const email = normalizeEmail(data.email);
    const user = await User.findOne({ email });

    if (user && user.emailVerified && user.status === "active") {
      const preview = await createPasswordReset(user);
      return {
        success: true,
        message:
          "If an account exists for that email, password reset instructions have been sent.",
        developmentPreview: preview,
      };
    }

    return {
      success: true,
      message:
        "If an account exists for that email, password reset instructions have been sent.",
    };
  },

  resetPassword: async (data) => {
    const reset = await findActiveCode("password_reset", data.code);
    const user = await User.findById(reset.user._id).select("+password");

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    user.password = await bcrypt.hash(data.password, auth.bcryptRounds);
    await user.save();

    reset.consumedAt = new Date();
    await reset.save();

    await AuthCode.updateMany(
      { user: user._id, type: "password_reset", consumedAt: null },
      { $set: { consumedAt: new Date() } },
    );

    await Session.updateMany(
      { user: user._id, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );

    user.authVersion = getAuthVersion(user) + 1;
    await user.save();

    return {
      success: true,
      message: "Password reset successful. Please log in again.",
    };
  },

  changePassword: async (user, data) => {
    const hydratedUser = await User.findById(user._id).select("+password");
    if (!hydratedUser) {
      throw { status: 404, message: "User not found" };
    }

    const matches = await bcrypt.compare(
      data.currentPassword,
      hydratedUser.password,
    );

    if (!matches) {
      throw { status: 401, message: "Current password is incorrect" };
    }

    hydratedUser.password = await bcrypt.hash(
      data.newPassword,
      auth.bcryptRounds,
    );
    hydratedUser.authVersion = getAuthVersion(hydratedUser) + 1;
    await hydratedUser.save();

    await Session.updateMany(
      { user: hydratedUser._id, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );

    return {
      success: true,
      message:
        "Password changed successfully. Please log in again on your other devices.",
    };
  },

  me: async (user) => ({
    success: true,
    user: sanitizeUser(user),
  }),
};
