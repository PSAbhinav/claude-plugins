// First-time (or reset) TOTP enrolment. Gated by ADMIN_SETUP_KEY so a random
// visitor can't enrol their own authenticator. Returns a QR to scan; the secret
// stays "pending" until confirmed by a correct PIN on /api/admin/login.
const { cmd, pipeline, configured } = require('../../lib/redis');
const { readJson } = require('../../lib/body');
const { generateSecret, otpauthURL } = require('../../lib/totp');
const QRCode = require('qrcode');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(JSON.stringify({ error: 'method' })); }
  if (!configured() || !process.env.SESSION_SECRET) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'not-configured', message: 'Server not configured (Upstash + SESSION_SECRET).' }));
  }
  const setupKey = process.env.ADMIN_SETUP_KEY;
  if (!setupKey) { res.statusCode = 500; return res.end(JSON.stringify({ error: 'no-setup-key', message: 'ADMIN_SETUP_KEY is not set.' })); }

  const b = await readJson(req);
  if (String(b.setupKey || '') !== setupKey) {
    res.statusCode = 403;
    return res.end(JSON.stringify({ error: 'bad-key', message: 'Wrong setup key.' }));
  }

  const already = !!(await cmd('EXISTS', 'ccm:totp'));
  if (already && !b.reset) {
    res.statusCode = 409;
    return res.end(JSON.stringify({ error: 'enrolled', message: 'An authenticator is already enrolled. Send reset:true to replace it.' }));
  }

  const secret = generateSecret(20);
  const label = process.env.ADMIN_LABEL || 'admin';
  const issuer = process.env.TOTP_ISSUER || 'Claude Marketplace';
  const otpauth = otpauthURL({ secret, label, issuer });

  await pipeline([['SET', 'ccm:totp_pending', secret], ['DEL', 'ccm:totp']]);

  let qrSvg = '';
  try { qrSvg = await QRCode.toString(otpauth, { type: 'svg', margin: 1, width: 224 }); } catch {}
  res.end(JSON.stringify({ ok: true, otpauth, secret, qrSvg }));
};
