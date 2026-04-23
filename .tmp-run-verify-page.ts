import 'dotenv/config';
import VerifyPage from './app/verify/[hash]/page.tsx';

async function main() {
  const hash = 'a04de13d9679ab5fa2fac9c8fd88b6c11de919cf472e9de8f1721298afd89baf';
  try {
    const result = await VerifyPage({ params: { hash } });
    console.log('VerifyPage returned:', typeof result, result ? 'has value' : 'no value');
  } catch (error) {
    console.error('VerifyPage error:', error);
  }
}

main();
