// Stateless signed admin session cookie (HMAC-SHA256). Env: SESSION_SECRET
const crypto = require('crypto');
const COOKIE = 'ccm_admin';

function secret() { return process.env.SESSION_SECRET || ''; }

function sign(ttlMs = 8 * 60 * 60 * 1000) {
  const s = secret();
  if (!s) throw new Error('no-session-secret');
  const exp = Date.now() + ttlMs;
  const payload = `admin.${exp}`;
  const sig = crypto.createHmac('sha256', s).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

function valid(token) {
  const s = secret();
  if (!s || !token) return false;
  const parts = String(token).split('.');
  if (parts.length !== 3) return false;
  const [scope, exp, sig] = parts;
  const expect = crypto.createHmac('sha256', s).update(`${scope}.${exp}`).digest('hex');
  if (sig.length !== expect.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return false;
  if (scope !== 'admin') return false;
  return Number(exp) > Date.now();
}

function parseCookies(req) {
  const h = req.headers.cookie || '';
  const out = {};
  h.split(';').forEach(p => {
    const i = p.indexOf('=');
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}

function setCookie(res, token, ttlSec = 8 * 60 * 60) {
  res.setHeader('Set-Cookie', `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${ttlSec}`);
}
function clearCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`);
}
function authed(req) { return valid(parseCookies(req)[COOKIE]); }

module.exports = { sign, valid, setCookie, clearCookie, authed, COOKIE };
