require("dotenv").config(); // Load environment variables
const hre = require("hardhat");

async function main() {
    // Retrieve the deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Define deployment parameters
    const charityWallet = process.env.CHARITY_WALLET;
    const developmentWallet = process.env.DEVELOPMENT_WALLET;
    
    if (!charityWallet || !developmentWallet) {
        throw new Error("Please set CHARITY_WALLET and DEVELOPMENT_WALLET in your .env file");
    }s

    // Log the deployment parameters for verification
    console.log("Charity Wallet:", charityWallet);
    console.log("Development Wallet:", developmentWallet);

    // Deploy the TLBBToken contract
    const TLBBToken = await hre.ethers.getContractFactory("TLBBToken");
    const token = await TLBBToken.deploy(charityWallet, developmentWallet);

    await token.deployed();
    console.log("TLBBToken deployed to:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });