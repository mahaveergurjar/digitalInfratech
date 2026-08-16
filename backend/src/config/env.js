function requireInProduction(value, key, fallback) {
  if (value) return value;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${key} must be set in production`);
  }
  return fallback;
}

function parseNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseCsv(value, fallback = []) {
  if (Array.isArray(value)) return value;
  if (!value) return fallback;
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseDurationToMinutes(value, fallback) {
  const input = String(value || '').trim();
  const match = input.match(/^(\d+(?:\.\d+)?)(ms|s|m|h|d)$/i);

  if (!match) {
    return fallback;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    ms: 1 / 60000,
    s: 1 / 60,
    m: 1,
    h: 60,
    d: 1440
  };

  return amount * multipliers[unit];
}

function normalizeMailProvider(value) {
  const provider = String(value || '').trim().toLowerCase();

  if (!provider) {
    return 'smtp';
  }

  if (provider === 'bravo' || provider === 'brevo') {
    return 'brevo';
  }

  if (provider === 'zeptomail') {
    return 'zeptomail';
  }

  return provider;
}

function getMailFromName() {
  return process.env.EMAIL_FROM_NAME || process.env.MAIL_FROM_NAME || '';
}

function requireMailSetting(value, key, fallback) {
  if (value) return value;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${key} must be set in production`);
  }
  return fallback;
}

const defaultFrontendOrigins = [
  process.env.APP_BASE_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

module.exports = {
  normalizeMailProvider,
  nodeEnv: process.env.NODE_ENV || 'development',
  app: {
    baseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
    apiUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',
    corsOrigins: parseCsv(process.env.APP_CORS_ORIGINS || process.env.CORS_ORIGINS, defaultFrontendOrigins)
  },
  auth: {
    bcryptRounds: parseNumber(process.env.BCRYPT_ROUNDS, 12),
    accessTokenSecret: requireInProduction(process.env.JWT_SECRET, 'JWT_SECRET', 'dev-access-secret-change-me'),
    accessTokenExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshTokenSecret: requireInProduction(process.env.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET', 'dev-refresh-secret-change-me'),
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    refreshTokenTtlMinutes: parseDurationToMinutes(process.env.JWT_REFRESH_EXPIRES_IN, 7 * 24 * 60),
    emailVerificationTtlMinutes: parseNumber(process.env.EMAIL_VERIFICATION_TTL_MINUTES, 1440),
    loginCodeTtlMinutes: parseNumber(process.env.LOGIN_CODE_TTL_MINUTES, 10),
    passwordResetTtlMinutes: parseNumber(process.env.PASSWORD_RESET_TTL_MINUTES, 30),
    loginCodeMaxAttempts: parseNumber(process.env.LOGIN_CODE_MAX_ATTEMPTS, 5),
    rateLimits: {
      register: { windowMs: 60 * 60 * 1000, max: 5 },
      verifyEmail: { windowMs: 60 * 60 * 1000, max: 10 },
      resendVerification: { windowMs: 60 * 60 * 1000, max: 5 },
      login: { windowMs: 15 * 60 * 1000, max: 10 },
      loginVerifyCode: { windowMs: 15 * 60 * 1000, max: 10 },
      resendLoginCode: { windowMs: 15 * 60 * 1000, max: 5 },
      refresh: { windowMs: 15 * 60 * 1000, max: 60 },
      logout: { windowMs: 15 * 60 * 1000, max: 60 },
      forgotPassword: { windowMs: 60 * 60 * 1000, max: 5 },
      resetPassword: { windowMs: 60 * 60 * 1000, max: 5 },
      changePassword: { windowMs: 60 * 60 * 1000, max: 10 }
    }
  },
  mail: {
    provider: requireMailSetting(normalizeMailProvider(process.env.MAIL_PROVIDER), 'MAIL_PROVIDER', 'smtp'),
    from: requireMailSetting(process.env.EMAIL_FROM || process.env.MAIL_FROM, 'EMAIL_FROM', 'no-reply@harghar.local'),
    fromName: getMailFromName(),
    apiKey: process.env.BREVO_API_KEY || '',
    smtpHost: process.env.SMTP_HOST || process.env.BREVO_SMTP_HOST || process.env.ZEPTO_SMTP_HOST || '',
    smtpPort: parseNumber(process.env.SMTP_PORT || process.env.BREVO_SMTP_PORT || process.env.ZEPTO_SMTP_PORT, 587),
    smtpSecure: String(process.env.SMTP_SECURE || process.env.BREVO_SMTP_SECURE || process.env.ZEPTO_SMTP_SECURE || 'false').toLowerCase() === 'true',
    smtpUser: process.env.SMTP_USER || process.env.BREVO_SMTP_USER || process.env.ZEPTO_SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || process.env.BREVO_SMTP_PASS || process.env.ZEPTO_SMTP_PASS || ''
  }
};
