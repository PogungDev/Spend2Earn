const hre = require("hardhat")

async function main() {
  console.log("Deploying Spend2Earn contracts...")

  // Deploy USDC mock token first (for testnet)
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC")
  const usdc = await MockUSDC.deploy()
  await usdc.waitForDeployment()
  console.log("Mock USDC deployed to:", await usdc.getAddress())

  // Deploy VaultContract
  const VaultContract = await hre.ethers.getContractFactory("VaultContract")
  const vault = await VaultContract.deploy(await usdc.getAddress())
  await vault.waitForDeployment()
  console.log("VaultContract deployed to:", await vault.getAddress())

  // Deploy BadgeContract
  const BadgeContract = await hre.ethers.getContractFactory("BadgeContract")
  const badge = await BadgeContract.deploy()
  await badge.waitForDeployment()
  console.log("BadgeContract deployed to:", await badge.getAddress())

  // Deploy CreditContract
  const CreditContract = await hre.ethers.getContractFactory("CreditContract")
  const credit = await CreditContract.deploy(await usdc.getAddress(), await vault.getAddress())
  await credit.waitForDeployment()
  console.log("CreditContract deployed to:", await credit.getAddress())

  // Deploy SpendingContract
  const SpendingContract = await hre.ethers.getContractFactory("SpendingContract")
  const spending = await SpendingContract.deploy(await usdc.getAddress())
  await spending.waitForDeployment()
  console.log("SpendingContract deployed to:", await spending.getAddress())

  // Set up contract connections
  await badge.transferOwnership(await spending.getAddress())
  await spending.setBadgeContract(await badge.getAddress())
  await spending.setVaultContract(await vault.getAddress())
  await credit.setBadgeContract(await badge.getAddress())

  console.log("\n=== Deployment Summary ===")
  console.log("USDC:", await usdc.getAddress())
  console.log("Vault:", await vault.getAddress())
  console.log("Credit:", await credit.getAddress())
  console.log("Badge:", await badge.getAddress())
  console.log("Spending:", await spending.getAddress())

  console.log("\n=== Update CONTRACT_ADDRESSES in lib/wagmi.ts ===")
  console.log(`VAULT: "${await vault.getAddress()}",`)
  console.log(`CREDIT: "${await credit.getAddress()}",`)
  console.log(`BADGE: "${await badge.getAddress()}",`)
  console.log(`SPENDING: "${await spending.getAddress()}",`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
