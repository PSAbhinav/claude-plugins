// Public: lets the admin page decide which screen to show. No secrets returned.
const { cmd, configured } = require('../../lib/redis');
const { authed } = require('../../lib/session');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const cfg = configured() && !!process.env.SESSION_SECRET && !!process.env.ADMIN_SETUP_KEY;
  let enrolled = false;
  try { if (configured()) enrolled = !!(await cmd('EXISTS', 'ccm:totp')); } catch {}
  res.end(JSON.stringify({ configured: cfg, enrolled, authed: authed(req) }));
};
