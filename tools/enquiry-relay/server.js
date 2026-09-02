// Wild Roots enquiry relay: accepts the site form POST and emails it via local sendmail.
'use strict';
const http = require('http');
const { spawn } = require('child_process');

const TO = process.env.TO || 'contact@wildrootsint.in';
const FROM = process.env.FROM || 'enquiry@wr.corpmos.com';
const PORT = +(process.env.PORT || 8787);
const FIELDS = ['name', 'company', 'email', 'destination', 'category', 'requirement'];
const hits = new Map(); // ip -> timestamps (simple rate limit: 5 / 10 min)

function clean(v) { return String(v || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 2000); }
function rateLimited(ip) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter(t => now - t < 600000);
  arr.push(now); hits.set(ip, arr); return arr.length > 5;
}
function parseBody(req, cb) {
  let raw = '';
  req.on('data', c => { raw += c; if (raw.length > 20000) req.destroy(); });
  req.on('end', () => {
    const ct = req.headers['content-type'] || '';
    try {
      if (ct.includes('application/json')) return cb(JSON.parse(raw));
      const out = {};
      if (ct.includes('multipart/form-data')) {
        const b = ct.split('boundary=')[1];
        raw.split('--' + b).forEach(p => {
          const m = /name="([^"]+)"\r\n\r\n([\s\S]*?)\r\n$/.exec(p);
          if (m) out[m[1]] = m[2];
        });
      } else {
        new URLSearchParams(raw).forEach((v, k) => { out[k] = v; });
      }
      cb(out);
    } catch (e) { cb(null); }
  });
}
function send(data, ip, cb) {
  const lines = FIELDS.filter(f => data[f]).map(f => f[0].toUpperCase() + f.slice(1) + ': ' + clean(data[f]));
  const subject = 'Website enquiry — ' + (clean(data.name) || 'visitor') + (data.company ? ' (' + clean(data.company) + ')' : '');
  const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(data.email)) ? clean(data.email) : '';
  const msg = ['To: ' + TO, 'From: Wild Roots website <' + FROM + '>', replyTo ? 'Reply-To: ' + replyTo : '',
    'Subject: ' + subject, 'Content-Type: text/plain; charset=utf-8', '',
    lines.join('\n'), '', '— Sent from the enquiry form at https://wr.corpmos.com (IP ' + ip + ', ' + new Date().toISOString() + ')', ''
  ].filter(l => l !== null).join('\n');
  const p = spawn('/usr/sbin/sendmail', ['-t', '-i', '-f', FROM]);
  p.on('close', code => cb(code === 0));
  p.on('error', () => cb(false));
  p.stdin.end(msg);
}

// The site may be hosted on another domain (final client domain); allow browser POSTs from anywhere.
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Accept' };
http.createServer((req, res) => {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  Object.keys(CORS).forEach(k => res.setHeader(k, CORS[k]));
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method !== 'POST') { res.writeHead(405); return res.end(); }
  if (rateLimited(ip)) { res.writeHead(429, { 'Content-Type': 'application/json' }); return res.end('{"ok":false,"error":"rate"}'); }
  parseBody(req, data => {
    if (!data || data._gotcha || !clean(data.name) || !clean(data.requirement)) {
      res.writeHead(400, { 'Content-Type': 'application/json' }); return res.end('{"ok":false}');
    }
    send(data, ip, ok => {
      res.writeHead(ok ? 200 : 502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok }));
      console.log(new Date().toISOString(), ip, ok ? 'sent' : 'FAILED', clean(data.name));
    });
  });
}).listen(PORT, '127.0.0.1', () => console.log('enquiry relay on ' + PORT + ' -> ' + TO));
