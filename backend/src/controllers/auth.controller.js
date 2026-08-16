const authService = require('../services/auth.service');

function requestContext(req) {
  return {
    ipAddress: req.ip,
    userAgent: req.get('user-agent') || null
  };
}

function renderMessagePage(title, message, details = '') {
  const safeTitle = String(title || 'Harghar').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const safeMessage = String(message || '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const safeDetails = String(details || '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f6f7fb; color: #1f2937; }
      .card { max-width: 640px; width: calc(100% - 32px); background: white; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
      h1 { margin-top: 0; font-size: 28px; }
      p { line-height: 1.6; }
      .muted { color: #6b7280; font-size: 14px; }
      form { display: grid; gap: 12px; margin-top: 20px; }
      input, button { font: inherit; padding: 12px 14px; border-radius: 10px; border: 1px solid #d1d5db; }
      button { background: #111827; color: white; border: none; cursor: pointer; }
      code { background: #f3f4f6; padding: 2px 6px; border-radius: 6px; }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>${safeTitle}</h1>
      <p>${safeMessage}</p>
      ${safeDetails ? `<p class="muted">${safeDetails}</p>` : ''}
    </main>
  </body>
</html>`;
}

module.exports = {
  register: async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
  verifyEmail: async (req, res, next) => {
    try {
      const result = await authService.verifyEmail(req.body.code);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
  verifyEmailPage: async (req, res, next) => {
    try {
      return res.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Verify email</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f6f7fb; color: #1f2937; }
      .card { max-width: 640px; width: calc(100% - 32px); background: white; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
      h1 { margin-top: 0; font-size: 28px; }
      p { line-height: 1.6; }
      form { display: grid; gap: 12px; margin-top: 20px; }
      input, button { font: inherit; padding: 12px 14px; border-radius: 10px; border: 1px solid #d1d5db; }
      button { background: #111827; color: white; border: none; cursor: pointer; }
      .muted { color: #6b7280; font-size: 14px; }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>Verify email</h1>
      <p>Enter the 6-digit verification code sent to your email.</p>
      <form method="post" action="/api/auth/verify-email">
        <input type="text" name="code" placeholder="123456" minlength="6" maxlength="6" required />
        <button type="submit">Verify email</button>
      </form>
      <p class="muted">If you did not receive the code, request a new one from the registration form.</p>
    </main>
  </body>
</html>`);
    } catch (err) {
      if (err && err.status) {
        return res.status(err.status).send(renderMessagePage('Verification failed', err.message));
      }
      next(err);
    }
  },
  resendVerification: async (req, res, next) => {
    try {
      const result = await authService.resendVerification(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
  verifyLoginCode: async (req, res, next) => {
    try {
      const result = await authService.verifyLoginCode(req.body, requestContext(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
  resendLoginCode: async (req, res, next) => {
    try {
      const result = await authService.resendLoginCode(req.body.challengeId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
  refresh: async (req, res, next) => {
    try {
      const result = await authService.refreshSession(req.body.refreshToken, requestContext(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
  logout: async (req, res, next) => {
    try {
      const result = await authService.logout(req.body?.refreshToken);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      const result = await authService.forgotPassword(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
  resetPasswordPage: async (req, res) => {
    return res.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Reset password</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f6f7fb; color: #1f2937; }
      .card { max-width: 640px; width: calc(100% - 32px); background: white; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
      h1 { margin-top: 0; font-size: 28px; }
      p { line-height: 1.6; }
      form { display: grid; gap: 12px; margin-top: 20px; }
      input, button { font: inherit; padding: 12px 14px; border-radius: 10px; border: 1px solid #d1d5db; }
      button { background: #111827; color: white; border: none; cursor: pointer; }
      .muted { color: #6b7280; font-size: 14px; }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>Reset password</h1>
      <p>Enter the reset code sent to your email, then choose a new password.</p>
      <form method="post" action="/api/auth/reset-password">
        <input type="text" name="code" placeholder="123456" minlength="6" maxlength="6" required />
        <input type="password" name="password" placeholder="New password" minlength="8" required />
        <button type="submit">Reset password</button>
      </form>
      <p class="muted">If you did not receive the code, request a new one from the forgot-password form.</p>
    </main>
  </body>
</html>`);
  },
  resetPassword: async (req, res, next) => {
    try {
      const result = await authService.resetPassword(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      const result = await authService.changePassword(req.user, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
  me: async (req, res, next) => {
    try {
      const result = await authService.me(req.user);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};
