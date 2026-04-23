# Complete Blockchain Integration Flow

- [x] Step 1: Create TODO-blockchain.md
- [x] Step 2: Create scripts/deploy.ts if missing (exists)
- [x] Step 3: Deploy contract with `npx hardhat run scripts/deploy.ts --network localhost` (0x5FbDB2315678afecb367f032d93F642f64180aa3)
- [x] Step 4: Create app/api/certificates/[id]/route.ts PATCH for status update
- [x] Step 5: Update app/dashboard/issuance/page.tsx - add Register button, use registerCertificate hook, PATCH on success
- [x] Step 6: Update lib/web3/context.tsx - read CONTRACT_ADDRESS from env
- [x] Step 7: Test full flow: hardhat node, deploy, issue PENDING, register → CONFIRMED
- [x] Step 8: Complete

✅ Blockchain integration complete!
