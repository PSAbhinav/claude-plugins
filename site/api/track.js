// Public, write-only usage tracker. Counts copy / stack-add events per plugin.
// Validates the plugin name against a server-side allowlist so the public
// endpoint can't be used to inflate arbitrary keys. Never throws to the client.
const { pipeline, configured } = require('../lib/redis');
const { readJson } = require('../lib/body');
const VALID = require('../lib/valid-plugins.json');

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
  try {
    if (!configured()) { res.statusCode = 204; return res.end(); }
    const b = await readJson(req);
    const name = String(b.name || '').slice(0, 80);
    const action = b.action === 'add' ? 'add' : 'copy';

    if (name === '__marketplace__') {
      await pipeline([['INCR', 'ccm:mkt_adds']]);
      res.statusCode = 204; return res.end();
    }

    const kind = VALID[name];
    if (!kind) { res.statusCode = 204; return res.end(); } // unknown -> silently ignore

    const day = new Date().toISOString().slice(0, 10);
    await pipeline([
      ['ZINCRBY', 'ccm:usage', 1, name],
      ['HINCRBY', 'ccm:type', kind, 1],
      ['HINCRBY', 'ccm:action', action, 1],
      ['INCR', 'ccm:total'],
      ['HINCRBY', 'ccm:day', day, 1],
    ]);
    res.statusCode = 204; return res.end();
  } catch {
    // tracking must never break the user experience
    res.statusCode = 204; return res.end();
  }
};
