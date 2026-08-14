// Verify a 6-digit TOTP PIN and issue a signed session cookie.
// If only a "pending" secret exists (just enrolled), a correct PIN promotes it
// to active — this is the confirmation step that finishes enrolment.
const { cmd, pipeline, configured } = require('../../lib/redis');
const { readJson } = require('../../lib/body');
const { verify } = require('../../lib/totp');
const { sign, setCookie } = require('../../lib/session');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(JSON.stringify({ error: 'method' })); }
  if (!configured() || !process.env.SESSION_SECRET) { res.statusCode = 500; return res.end(JSON.stringify({ error: 'not-configured' })); }

  const b = await readJson(req);
  const pin = String(b.pin || '').trim();

  let secret = await cmd('GET', 'ccm:totp');
  let promoting = false;
  if (!secret) {
    const pending = await cmd('GET', 'ccm:totp_pending');
    if (!pending) { res.statusCode = 409; return res.end(JSON.stringify({ error: 'needs-setup' })); }
    secret = pending; promoting = true;
  }

  if (!verify(pin, secret)) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ error: 'bad-pin', message: 'Incorrect code — try the current 6 digits.' }));
  }

  if (promoting) await pipeline([['SET', 'ccm:totp', secret], ['DEL', 'ccm:totp_pending']]);

  setCookie(res, sign());
  res.end(JSON.stringify({ ok: true }));
};
