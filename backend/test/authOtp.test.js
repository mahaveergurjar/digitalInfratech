const test = require("node:test");
const assert = require("node:assert/strict");
const { buildOtpPreviewPayload } = require("../src/services/auth.service");

test("buildOtpPreviewPayload returns expiry metadata for OTP previews", () => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000 + 5000);
  const preview = buildOtpPreviewPayload({
    code: "123456",
    expiresAt,
    ttlMinutes: 10,
    fieldName: "verificationCode",
  });

  assert.equal(preview.verificationCode, "123456");
  assert.equal(preview.expiresInMinutes, 10);
  assert.equal(preview.expiresAt, expiresAt.toISOString());
  assert.ok(preview.expiresInSeconds >= 600);
});
