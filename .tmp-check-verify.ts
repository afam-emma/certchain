import 'dotenv/config';
import { promises as fs } from 'fs';

async function main() {
  const mod = await import('./app/api/certificates/verify/[hash]/route.ts');
  console.log('exports', Object.keys(mod));
  const hash = '2520beea42a57ee4c1b6fea95894fd0b35973d8e2b71186fdac56951f7cb8178';
  if (typeof mod.GET === 'function') {
    const res = await mod.GET(new Request(`http://localhost/api/certificates/verify/${hash}`), { params: { hash } });
    console.log('status', res.status);
    console.log(await res.json());
  } else {
    console.error('GET not found');
  }
}
main().catch(err => { console.error(err); process.exit(1); });
