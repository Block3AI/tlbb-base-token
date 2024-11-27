require("@nomicfoundation/hardhat-toolbox"); // Standard Hardhat plugins
require("hardhat-gas-reporter"); // Adds gas reporting functionality
require("dotenv").config(); // Load environment variables from .env

module.exports = {
    solidity: "0.8.19", // Solidity compiler version
    defaultNetwork: "base", // Default network to deploy to
    networks: {
        base: {
            url: process.env.BASE_RPC_URL || "",
            accounts: [process.env.PRIVATE_KEY || ""]
        },
        localhost: {
            url: "http://127.0.0.1:8545", // Local testnet for development
            accounts: [process.env.PRIVATE_KEY || ""]
        },
        goerli: {
            url: process.env.GOERLI_RPC_URL || "",
            accounts: [process.env.PRIVATE_KEY || ""]
        }
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY || "" // API key for Etherscan verification
    },
    gasReporter: {
        enabled: true, // Enable the gas reporter
        currency: "USD", // Display gas costs in USD
        gasPrice: 21, // Set the gas price (optional; defaults to live prices)
        outputFile: "gas-report.txt", // Optional: Save the report to a file
        noColors: true // Optional: Disable colors in the terminal output
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    mocha: {
        timeout: 20000 // Adjust timeout for longer-running tests
    }
};