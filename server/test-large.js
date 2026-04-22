import http from 'http';

const largeBase64 = 'A'.repeat(100000); // 100KB of data

const data = JSON.stringify({
  region: "微信区",
  server: "微信",
  loginType: "qrcode",
  totalAssets: 80,
  harvardCoins: 578,
  level: 80,
  rank: "铂金",
  safeBox: "6grid",
  stamina: "5-6",
  trainingLevel: "4级",
  rangeLevel: "5级",
  awmAmmo: 90,
  banRecord: "无封禁记录",
  isOwnFace: true,
  superGuarantee: true,
  knifeSkins: ["信条"],
  operatorSkins: { "红狼": ["蚀金玫瑰"] },
  price: 1409.75,
  note: "测试",
  mainInterface: "data:image/jpeg;base64," + largeBase64,
  warehouse: "data:image/jpeg;base64," + largeBase64,
  other: ""
});

console.log('Sending request with', data.length, 'bytes...');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/sell-accounts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Response:', body.substring(0, 200));
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
