// Redis client over a redis:// URL (Vercel Redis / Redis Cloud). Env: REDIS_URL
// Reuses one connection across warm serverless invocations. All app keys are
// prefixed "ccm:" so the DB can be safely shared with other projects.
const { createClient } = require('redis');

let client = null;
let connectPromise = null;

// Resolve the connection string flexibly: prefer REDIS_URL, but accept whatever
// name the Vercel storage integration injects, as long as it's a redis:// value.
function redisUrl() {
  if (process.env.REDIS_URL) return process.env.REDIS_URL;
  for (const v of Object.values(process.env)) {
    if (typeof v === 'string' && /^rediss?:\/\/\S+/.test(v)) return v;
  }
  return null;
}

function configured() { return !!redisUrl(); }

async function getClient() {
  if (!configured()) throw new Error('redis-not-configured');
  if (client && client.isOpen) return client;
  if (!client) {
    client = createClient({ url: redisUrl(), socket: { connectTimeout: 8000 } });
    client.on('error', () => {}); // swallow transient errors; callers handle failures
  }
  if (!client.isOpen) {
    if (!connectPromise) connectPromise = client.connect().catch(e => { connectPromise = null; throw e; });
    await connectPromise;
    connectPromise = null;
  }
  return client;
}

// Single raw command, e.g. cmd('EXISTS', 'ccm:totp') -> reply
async function cmd(...args) {
  const c = await getClient();
  return c.sendCommand(args.map(String));
}

// Sequence of raw commands; returns replies in order (same shape callers expect).
async function pipeline(cmds) {
  const c = await getClient();
  const out = [];
  for (const args of cmds) out.push(await c.sendCommand(args.map(String)));
  return out;
}

module.exports = { configured, pipeline, cmd };
