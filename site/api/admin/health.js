// Unauthenticated connectivity probe — reveals only whether the analytics store
// is reachable (no data, no secrets). Lets ops verify Redis without the setup key.
const { cmd, configured } = require('../../lib/redis');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (!configured()) return res.end(JSON.stringify({ configured: false, redis: 'no-url' }));
  try {
    const pong = await cmd('PING');
    const ok = String(pong).toUpperCase() === 'PONG';
    res.end(JSON.stringify({ configured: true, redis: ok ? 'ok' : 'unexpected', reply: String(pong) }));
  } catch (e) {
    res.end(JSON.stringify({ configured: true, redis: 'fail', error: String((e && e.message) || e).slice(0, 200) }));
  }
};
