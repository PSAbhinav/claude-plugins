// Admin-only aggregate stats. No per-user / per-visit detail — popularity only.
const { pipeline, configured } = require('../../lib/redis');
const { authed } = require('../../lib/session');
const VALID = require('../../lib/valid-plugins.json');

const hashToObj = h => {
  if (!h) return {};
  if (Array.isArray(h)) { const o = {}; for (let i = 0; i < h.length; i += 2) o[h[i]] = Number(h[i + 1]); return o; }
  const o = {}; for (const k of Object.keys(h)) o[k] = Number(h[k]); return o;
};

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (!authed(req)) { res.statusCode = 401; return res.end(JSON.stringify({ error: 'unauthorized' })); }
  if (!configured()) { res.statusCode = 500; return res.end(JSON.stringify({ error: 'not-configured' })); }

  const [top, typeH, actionH, total, mkt, dayH] = await pipeline([
    ['ZREVRANGE', 'ccm:usage', 0, 24, 'WITHSCORES'],
    ['HGETALL', 'ccm:type'],
    ['HGETALL', 'ccm:action'],
    ['GET', 'ccm:total'],
    ['GET', 'ccm:mkt_adds'],
    ['HGETALL', 'ccm:day'],
  ]);

  const leaderboard = [];
  const arr = top || [];
  for (let i = 0; i < arr.length; i += 2) {
    leaderboard.push({ name: arr[i], kind: VALID[arr[i]] || 'plugin', count: Number(arr[i + 1]) });
  }

  // catalog size per kind (how many exist, for "X of Y used" context)
  const catalogByKind = {};
  for (const k of Object.values(VALID)) catalogByKind[k] = (catalogByKind[k] || 0) + 1;

  res.end(JSON.stringify({
    total: Number(total || 0),
    marketplaceAdds: Number(mkt || 0),
    byType: hashToObj(typeH),
    byAction: hashToObj(actionH),
    byDay: hashToObj(dayH),
    top: leaderboard,
    catalogByKind,
    catalogTotal: Object.keys(VALID).length,
    usedDistinct: leaderboard.length,
  }));
};
