// Robust JSON body reader (handles pre-parsed body, string body, or raw stream —
// sendBeacon/fetch may arrive as text/plain).
async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  return await new Promise(resolve => {
    let d = '';
    req.on('data', c => { d += c; if (d.length > 10000) d = d.slice(0, 10000); });
    req.on('end', () => { try { resolve(JSON.parse(d || '{}')); } catch { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}
module.exports = { readJson };
