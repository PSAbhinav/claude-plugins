const { clearCookie } = require('../../lib/session');

module.exports = async (req, res) => {
  clearCookie(res);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true }));
};
