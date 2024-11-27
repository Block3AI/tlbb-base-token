// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TLBBToken is ERC20, Ownable {
    // Charity and Development Wallet Addresses
    address public charityWallet;
    address public developmentWallet;

    // Transaction Fee (2% total: 1% charity, 1% development)
    uint256 public constant TRANSACTION_FEE_PERCENT = 2;
    uint256 public constant CHARITY_FEE_PERCENT = 1;
    uint256 public constant DEVELOPMENT_FEE_PERCENT = 1;

    // Token Allocation (in units)
    uint256 private constant TOTAL_SUPPLY = 1_000_000_000 * 10 ** 18; // 1 Billion Tokens
    uint256 private constant LIQUIDITY_POOL_ALLOCATION = 300_000_000 * 10 ** 18; // 30%
    uint256 private constant PRESALE_ALLOCATION = 250_000_000 * 10 ** 18; // 25%
    uint256 private constant MARKETING_AND_DEV_ALLOCATION = 200_000_000 * 10 ** 18; // 20%
    uint256 private constant TEAM_RESERVE_ALLOCATION = 100_000_000 * 10 ** 18; // 10%
    uint256 private constant COMMUNITY_REWARDS_ALLOCATION = 100_000_000 * 10 ** 18; // 10%
    uint256 private constant CHARITY_RESERVE_ALLOCATION = 50_000_000 * 10 ** 18; // 5%

    constructor(address _charityWallet, address _developmentWallet) ERC20("TLBB Token", "TLBB") {
        require(_charityWallet != address(0), "Invalid charity wallet address");
        require(_developmentWallet != address(0), "Invalid development wallet address");

        // Set wallets
        charityWallet = _charityWallet;
        developmentWallet = _developmentWallet;

        // Mint token allocations
        _mint(msg.sender, LIQUIDITY_POOL_ALLOCATION); // Deployer holds liquidity pool
        _mint(msg.sender, PRESALE_ALLOCATION); // Presale tokens
        _mint(msg.sender, MARKETING_AND_DEV_ALLOCATION); // Marketing & Development
        _mint(msg.sender, TEAM_RESERVE_ALLOCATION); // Team Reserve
        _mint(msg.sender, COMMUNITY_REWARDS_ALLOCATION); // Community Rewards
        _mint(msg.sender, CHARITY_RESERVE_ALLOCATION); // Charity Reserve
    }

    // Transfer function override to include transaction fees
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        // Calculate fees
        uint256 feeAmount = (amount * TRANSACTION_FEE_PERCENT) / 100;
        uint256 charityAmount = (amount * CHARITY_FEE_PERCENT) / 100;
        uint256 developmentAmount = (amount * DEVELOPMENT_FEE_PERCENT) / 100;

        // Amount after fees
        uint256 transferAmount = amount - feeAmount;

        // Transfer to recipient
        super._transfer(sender, recipient, transferAmount);

        // Distribute fees
        if (feeAmount > 0) {
            if (charityAmount > 0) {
                super._transfer(sender, charityWallet, charityAmount);
            }
            if (developmentAmount > 0) {
                super._transfer(sender, developmentWallet, developmentAmount);
            }
        }
    }

    // Update Charity Wallet (only owner)
    function updateCharityWallet(address _charityWallet) external onlyOwner {
        require(_charityWallet != address(0), "Invalid charity wallet address");
        charityWallet = _charityWallet;
    }

    // Update Development Wallet (only owner)
    function updateDevelopmentWallet(address _developmentWallet) external onlyOwner {
        require(_developmentWallet != address(0), "Invalid development wallet address");
        developmentWallet = _developmentWallet;
    }
}