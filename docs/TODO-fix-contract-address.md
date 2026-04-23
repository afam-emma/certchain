# Fix Contract Address Issue - Progress Tracker

## Plan Steps
- [✅] 1. Start Hardhat node (`npx hardhat node`) 
- [✅] 2. Deploy contract (`npx hardhat run scripts/deploy.ts`) - 0x5FbDB2315678afecb367f032d93F642f64180aa3
- [ ] 3. Add `NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3` to .env.local
- [ ] 4. Restart Next.js dev server (`npm run dev`) - Kill PID 1668 if needed
- [ ] 5. Configure MetaMask (RPC: http://127.0.0.1:8545, ChainID: 31337, private key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80)
- [ ] 6. Test: Create cert → /dashboard/issuance → Connect wallet → Register on Chain

**Status:** In progress

