// Tiny Upstash Redis REST client (no dependency — uses global fetch).
// Configured via env: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
const URL = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function configured() { return !!(URL && TOKEN); }

async function pipeline(cmds) {
  if (!configured()) throw new Error('redis-not-configured');
  const r = await fetch(URL.replace(/\/$/, '') + '/pipeline', {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  if (!r.ok) throw new Error('redis-http-' + r.status);
  const data = await r.json();
  // pipeline returns [{result|error}, ...]
  return data.map(x => (x && 'result' in x ? x.result : x));
}

async function cmd(...args) {
  const [res] = await pipeline([args]);
  return res;
}

module.exports = { configured, pipeline, cmd };
