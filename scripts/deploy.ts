import "dotenv/config";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Deploying CertificateRegistry contract...");

  const network = process.env.HARDHAT_NETWORK || "localhost";
  console.log(`Deploying to network: ${network}`);

  let provider;
  let wallet;

  if (network === "sepolia") {
    // Deploy to Sepolia testnet
    const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY";
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
      throw new Error("PRIVATE_KEY environment variable is required for Sepolia deployment");
    }

    provider = new ethers.JsonRpcProvider(rpcUrl);
    wallet = new ethers.Wallet(privateKey, provider);

    console.log(`Deploying from wallet: ${wallet.address}`);

    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);

    if (balance === BigInt(0)) {
      throw new Error("Wallet has no balance. Get free Sepolia ETH from: https://www.infura.io/faucet/sepolia");
    }
  } else {
    // Deploy to localhost (Hardhat node)
    provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    wallet = new ethers.Wallet(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      provider
    );
  }

  // Read the compiled contract artifact
  const artifactPath = path.join(process.cwd(), "artifacts", "contracts", "CertificateRegistry.sol", "CertificateRegistry.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Create contract factory with bytecode and ABI
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  // Deploy the contract
  console.log("Deploying contract...");
  const contract = await factory.deploy();
  
  // Wait for deployment
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("\n✅ CertificateRegistry deployed successfully!");
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🌐 Network: ${network}`);
  console.log("\n--- Add this to your .env.local file ---");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);

  if (network === "sepolia") {
    console.log("\n--- Sepolia Configuration ---");
    console.log("NEXT_PUBLIC_BLOCKCHAIN_NETWORK=sepolia");
    console.log("NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY");
    console.log("NEXT_PUBLIC_CHAIN_ID=11155111");
    console.log("\n--- MetaMask Configuration ---");
    console.log("Network Name: Sepolia Testnet");
    console.log("RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY");
    console.log("Chain ID: 11155111");
    console.log("Currency Symbol: SepoliaETH");
    console.log("\n--- Get Free Testnet ETH ---");
    console.log("https://www.infura.io/faucet/sepolia");
  } else {
    console.log("\n--- MetaMask Configuration ---");
    console.log("Network Name: Local Hardhat");
    console.log("RPC URL: http://127.0.0.1:8545");
    console.log("Chain ID: 31337");
    console.log("Currency Symbol: ETH");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });