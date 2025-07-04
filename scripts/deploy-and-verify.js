const hre = require("hardhat")
const fs = require("fs")

async function main() {
  console.log("🚀 Starting Spend2Earn contract deployment...")
  
  const [deployer] = await hre.ethers.getSigners()
  console.log("Deploying contracts with account:", deployer.address)
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString())

  const deployedContracts = {}

  try {
    // Deploy USDC mock token first (for testnet)
    console.log("\n📝 Deploying Mock USDC...")
    const MockUSDC = await hre.ethers.getContractFactory("MockUSDC")
    const usdc = await MockUSDC.deploy()
    await usdc.waitForDeployment()
    const usdcAddress = await usdc.getAddress()
    deployedContracts.USDC = usdcAddress
    console.log("✅ Mock USDC deployed to:", usdcAddress)

    // Deploy VaultContract
    console.log("\n🏦 Deploying Vault Contract...")
    const VaultContract = await hre.ethers.getContractFactory("VaultContract")
    const vault = await VaultContract.deploy(usdcAddress)
    await vault.waitForDeployment()
    const vaultAddress = await vault.getAddress()
    deployedContracts.VAULT = vaultAddress
    console.log("✅ VaultContract deployed to:", vaultAddress)

    // Deploy BadgeContract
    console.log("\n🎖️ Deploying Badge Contract...")
    const BadgeContract = await hre.ethers.getContractFactory("BadgeContract")
    const badge = await BadgeContract.deploy()
    await badge.waitForDeployment()
    const badgeAddress = await badge.getAddress()
    deployedContracts.BADGE = badgeAddress
    console.log("✅ BadgeContract deployed to:", badgeAddress)

    // Deploy CreditContract
    console.log("\n💳 Deploying Credit Contract...")
    const CreditContract = await hre.ethers.getContractFactory("CreditContract")
    const credit = await CreditContract.deploy(usdcAddress, vaultAddress)
    await credit.waitForDeployment()
    const creditAddress = await credit.getAddress()
    deployedContracts.CREDIT = creditAddress
    console.log("✅ CreditContract deployed to:", creditAddress)

    // Deploy SpendingContract
    console.log("\n💰 Deploying Spending Contract...")
    const SpendingContract = await hre.ethers.getContractFactory("SpendingContract")
    const spending = await SpendingContract.deploy(usdcAddress)
    await spending.waitForDeployment()
    const spendingAddress = await spending.getAddress()
    deployedContracts.SPENDING = spendingAddress
    console.log("✅ SpendingContract deployed to:", spendingAddress)

    // Set up contract connections
    console.log("\n🔗 Setting up contract connections...")
    
    console.log("Transferring badge ownership to spending contract...")
    await badge.transferOwnership(spendingAddress)
    
    console.log("Setting badge contract in spending contract...")
    await spending.setBadgeContract(badgeAddress)
    
    console.log("Setting vault contract in spending contract...")
    await spending.setVaultContract(vaultAddress)
    
    console.log("Setting badge contract in credit contract...")
    await credit.setBadgeContract(badgeAddress)

    console.log("\n✅ Contract setup completed!")

    // Verify contracts if on testnet/mainnet
    if (hre.network.name !== "hardhat" && process.env.DEPLOY_VERIFY === "true") {
      console.log("\n🔍 Verifying contracts on Etherscan...")
      
      await hre.run("verify:verify", {
        address: usdcAddress,
        constructorArguments: [],
      })
      
      await hre.run("verify:verify", {
        address: vaultAddress,
        constructorArguments: [usdcAddress],
      })
      
      await hre.run("verify:verify", {
        address: badgeAddress,
        constructorArguments: [],
      })
      
      await hre.run("verify:verify", {
        address: creditAddress,
        constructorArguments: [usdcAddress, vaultAddress],
      })
      
      await hre.run("verify:verify", {
        address: spendingAddress,
        constructorArguments: [usdcAddress],
      })
      
      console.log("✅ All contracts verified!")
    }

    // Save deployment info
    const deploymentInfo = {
      network: hre.network.name,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: deployedContracts
    }

    fs.writeFileSync(
      'deployment-info.json', 
      JSON.stringify(deploymentInfo, null, 2)
    )

    console.log("\n🎉 =================================")
    console.log("🎉 DEPLOYMENT SUCCESSFUL!")
    console.log("🎉 =================================")
    console.log("\n📋 Contract Addresses:")
    console.log("USDC:", usdcAddress)
    console.log("Vault:", vaultAddress)
    console.log("Credit:", creditAddress)
    console.log("Badge:", badgeAddress)
    console.log("Spending:", spendingAddress)

    console.log("\n📝 Update CONTRACT_ADDRESSES in lib/contract-abis.ts:")
    console.log(`export const CONTRACT_ADDRESSES = {`)
    console.log(`  VAULT: "${vaultAddress}" as \`0x\${string}\`,`)
    console.log(`  CREDIT: "${creditAddress}" as \`0x\${string}\`,`)
    console.log(`  BADGE: "${badgeAddress}" as \`0x\${string}\`,`)
    console.log(`  SPENDING: "${spendingAddress}" as \`0x\${string}\`,`)
    console.log(`  USDC: "${usdcAddress}" as \`0x\${string}\`,`)
    console.log(`}`)

    console.log("\n🔗 Add to your .env file:")
    console.log(`NEXT_PUBLIC_VAULT_CONTRACT=${vaultAddress}`)
    console.log(`NEXT_PUBLIC_SPENDING_CONTRACT=${spendingAddress}`)
    console.log(`NEXT_PUBLIC_BADGE_CONTRACT=${badgeAddress}`)
    console.log(`NEXT_PUBLIC_CREDIT_CONTRACT=${creditAddress}`)
    console.log(`NEXT_PUBLIC_USDC_CONTRACT=${usdcAddress}`)

  } catch (error) {
    console.error("❌ Deployment failed:", error)
    process.exit(1)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 