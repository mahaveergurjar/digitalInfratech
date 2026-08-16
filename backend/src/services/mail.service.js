const nodemailer = require("nodemailer");
const { mail, nodeEnv } = require("../config/env");

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
let smtpTransporter;

function hasSmtpCredentials() {
  return Boolean(mail.smtpHost && mail.smtpUser && mail.smtpPass);
}

function hasBrevoCredentials() {
  return Boolean(mail.apiKey && mail.from);
}

function createSmtpTransporter() {
  if (!hasSmtpCredentials()) {
    return null;
  }

  return nodemailer.createTransport({
    host: mail.smtpHost,
    port: mail.smtpPort,
    secure: mail.smtpSecure,
    auth: {
      user: mail.smtpUser,
      pass: mail.smtpPass,
    },
  });
}

function getSender() {
  return {
    email: mail.from,
    ...(mail.fromName ? { name: mail.fromName } : {})
  };
}

function buildPreview(to, subject, text, html, developmentPreview) {
  const preview = {
    to,
    subject,
    text,
    html,
    developmentPreview: developmentPreview || null,
  };

  if (nodeEnv !== "test") {
    console.log(
      "Mail transport not configured. Returning development preview.",
    );
    console.log(JSON.stringify(preview, null, 2));
  }

  return { delivered: false, preview };
}

async function getSmtpTransporter() {
  if (smtpTransporter) {
    return smtpTransporter;
  }

  if (!hasSmtpCredentials()) {
    if (nodeEnv === "production") {
      throw new Error(
        `MAIL_PROVIDER=smtp requires SMTP credentials in production`,
      );
    }
    return null;
  }

  smtpTransporter = createSmtpTransporter();

  if (nodeEnv === "production") {
    await smtpTransporter.verify();
  }

  return smtpTransporter;
}

function assertBrevoConfig() {
  if (hasBrevoCredentials()) {
    return true;
  }

  if (nodeEnv === "production") {
    throw new Error(
      "MAIL_PROVIDER=brevo requires BREVO_API_KEY and EMAIL_FROM in production",
    );
  }

  return false;
}

function buildBrevoPayload({ to, subject, text, html }) {
  return {
    sender: getSender(),
    to: [{ email: to }],
    subject,
    ...(html ? { htmlContent: html } : {}),
    ...(text ? { textContent: text } : {}),
  };
}

async function sendViaBrevo({ to, subject, text, html }) {
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": mail.apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(buildBrevoPayload({ to, subject, text, html })),
  });

  const responseText = await response.text();
  let payload = null;

  try {
    payload = responseText ? JSON.parse(responseText) : null;
  } catch (err) {
    payload = null;
  }

  if (!response.ok) {
    const message =
      (payload && (payload.message || payload.code)) ||
      responseText ||
      `Brevo API request failed with status ${response.status}`;
    throw new Error(message);
  }

  return {
    delivered: true,
    provider: "brevo",
    messageId: payload?.messageId || null,
  };
}

async function prepareMailTransport() {
  if (mail.provider === "brevo") {
    const ready = assertBrevoConfig();
    return { ready, provider: "brevo" };
  }

  const activeTransporter = await getSmtpTransporter();
  if (!activeTransporter) {
    return { ready: false, provider: "smtp" };
  }

  return { ready: true, provider: "smtp" };
}

async function sendMail({ to, subject, text, html, developmentPreview }) {
  if (mail.provider === "brevo") {
    const ready = assertBrevoConfig();

    if (!ready) {
      return buildPreview(to, subject, text, html, developmentPreview);
    }

    return sendViaBrevo({ to, subject, text, html });
  }

  const activeTransporter = await getSmtpTransporter();

  if (!activeTransporter) {
    return buildPreview(to, subject, text, html, developmentPreview);
  }

  await activeTransporter.sendMail({
    from: mail.from,
    to,
    subject,
    text,
    html,
  });

  return { delivered: true };
}

module.exports = {
  prepareMailTransport,
  sendMail,
};
