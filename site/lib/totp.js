// RFC 6238 TOTP (SHA-1, 6 digits, 30s) + RFC 4648 base32. No dependencies.
const crypto = require('crypto');
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buf) {
  let bits = 0, value = 0, out = '';
  for (const b of buf) {
    value = (value << 8) | b; bits += 8;
    while (bits >= 5) { out += B32[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(str) {
  const clean = String(str).toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = 0, value = 0; const out = [];
  for (const ch of clean) {
    const idx = B32.indexOf(ch);
    if (idx === -1) continue;
    value = (value << 5) | idx; bits += 5;
    if (bits >= 8) { out.push((value >>> (bits - 8)) & 0xff); bits -= 8; }
  }
  return Buffer.from(out);
}

// 20 random bytes -> exactly 32 base32 chars (no padding)
function generateSecret(bytes = 20) { return base32Encode(crypto.randomBytes(bytes)); }

function hotp(key, counter) {
  const buf = Buffer.alloc(8);
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  buf.writeUInt32BE(counter >>> 0, 4);
  const h = crypto.createHmac('sha1', key).update(buf).digest();
  const off = h[h.length - 1] & 0x0f;
  const bin = ((h[off] & 0x7f) << 24) | ((h[off + 1] & 0xff) << 16) | ((h[off + 2] & 0xff) << 8) | (h[off + 3] & 0xff);
  return (bin % 1000000).toString().padStart(6, '0');
}

function verify(token, secretB32, window = 1, step = 30) {
  const t = String(token || '').trim();
  if (!/^\d{6}$/.test(t)) return false;
  const key = base32Decode(secretB32);
  if (!key.length) return false;
  const counter = Math.floor(Date.now() / 1000 / step);
  for (let w = -window; w <= window; w++) {
    const cand = hotp(key, counter + w);
    if (crypto.timingSafeEqual(Buffer.from(cand), Buffer.from(t))) return true;
  }
  return false;
}

function otpauthURL({ secret, label, issuer }) {
  // Canonical form: literal ':' separates issuer and account; each side encoded.
  const path = `${encodeURIComponent(issuer)}:${encodeURIComponent(label)}`;
  const params = new URLSearchParams({ secret, issuer, algorithm: 'SHA1', digits: '6', period: '30' })
    .toString().replace(/\+/g, '%20');
  return `otpauth://totp/${path}?${params}`;
}

module.exports = { generateSecret, verify, otpauthURL, base32Encode, base32Decode, hotp };
