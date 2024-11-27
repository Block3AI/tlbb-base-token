const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TLBBToken", function () {
    let TLBBToken, token;
    let owner, addr1, addr2, charityWallet, developmentWallet;

    beforeEach(async function () {
        [owner, addr1, addr2, charityWallet, developmentWallet] = await ethers.getSigners();

        // Deploy the token
        const Token = await ethers.getContractFactory("TLBBToken");
        token = await Token.deploy(charityWallet.address, developmentWallet.address);
        await token.deployed();
    });

    it("Should deploy with the correct initial supply", async function () {
        const totalSupply = await token.totalSupply();
        expect(totalSupply).to.equal(ethers.utils.parseUnits("1000000000", 18)); // 1 Billion tokens
    });

    it("Should allocate tokens correctly upon deployment", async function () {
        const ownerBalance = await token.balanceOf(owner.address);
        expect(ownerBalance).to.equal(ethers.utils.parseUnits("1000000000", 18)); // All tokens minted to the deployer
    });

    it("Should set the charity and development wallets correctly", async function () {
        expect(await token.charityWallet()).to.equal(charityWallet.address);
        expect(await token.developmentWallet()).to.equal(developmentWallet.address);
    });

    it("Should allow token transfers without fee deductions for small amounts", async function () {
        await token.transfer(addr1.address, ethers.utils.parseUnits("1000", 18)); // Transfer 1,000 tokens
        const addr1Balance = await token.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(ethers.utils.parseUnits("1000", 18));
    });

    it("Should deduct fees during token transfers", async function () {
        const transferAmount = ethers.utils.parseUnits("1000", 18);
        const feeAmount = transferAmount.mul(2).div(100); // 2% fee

        await token.transfer(addr1.address, transferAmount); // Transfer from owner to addr1
        const addr1Balance = await token.balanceOf(addr1.address);
        const charityBalance = await token.balanceOf(charityWallet.address);
        const developmentBalance = await token.balanceOf(developmentWallet.address);

        expect(addr1Balance).to.equal(transferAmount.sub(feeAmount)); // Net of fees
        expect(charityBalance).to.equal(feeAmount.div(2)); // Half to charity
        expect(developmentBalance).to.equal(feeAmount.div(2)); // Half to development
    });

    it("Should allow the owner to update wallet addresses", async function () {
        await token.updateCharityWallet(addr1.address);
        await token.updateDevelopmentWallet(addr2.address);

        expect(await token.charityWallet()).to.equal(addr1.address);
        expect(await token.developmentWallet()).to.equal(addr2.address);
    });

    it("Should not allow non-owners to update wallet addresses", async function () {
        await expect(
            token.connect(addr1).updateCharityWallet(addr1.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should reject transfers to the zero address", async function () {
        await expect(
            token.transfer(ethers.constants.AddressZero, ethers.utils.parseUnits("1000", 18))
        ).to.be.revertedWith("ERC20: transfer to the zero address");
    });
});