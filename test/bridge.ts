import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Bridge functions", function () {
    let addrETH: SignerWithAddress;
    let addrBSC: SignerWithAddress;
    let app: SignerWithAddress;

    let ERC20: Contract;
    let BEP20: Contract;

    let bridgeETH: Contract;
    let bridgeBSC: Contract;

    describe("Deploying", function() {

        it("Should deploy ERC20 contract", async function () {
            [addrETH, addrBSC, app] = await ethers.getSigners();
            const erc20 = await ethers.getContractFactory("Token20");
            ERC20 = await erc20.deploy("DVCoin", "DVC", 18);
            await ERC20.deployed();
        });

        it("Should deploy BEP20 contract", async function () {
            const bep20 = await ethers.getContractFactory("Token20");
            BEP20 = await bep20.deploy("DVCoin", "DVC", 18);
            await BEP20.deployed();
        });

        it("Should deploy bridge for Ethereum", async function () {
            const BridgeETH = await ethers.getContractFactory("Bridge");
            bridgeETH = await BridgeETH.deploy(app.address, false, ERC20.address);
            await bridgeETH.deployed();
        });

        it("Should deploy bridge for Binance Smart Chain", async function () {
            const BridgeBSC = await ethers.getContractFactory("Bridge");
            bridgeBSC = await BridgeBSC.deploy(app.address, true, BEP20.address);
            await bridgeBSC.deployed();
        });

        it("Should connect ERC20 to Ethereum bridge", async function () {
            await ERC20.connectBridge(bridgeETH.address);
        });

        it("Should connect BEP20 to Binance Smart Chain bridge", async function () {
            await BEP20.connectBridge(bridgeBSC.address);
        });

        it("Should mint tokens to your balance", async function () {
            ERC20.mint(addrETH.address, "10000000000");
            expect(await ERC20.balanceOf(addrETH.address)).to.equal("10000000000");
        });
    });

    describe("Swap tokens between blockchains", function () {
        it("Should burn tokens on your account and initialize event when you use \"swap\" function", async function () {
            await expect(bridgeETH.swap(addrBSC.address, "1000000")).to.emit(bridgeETH, 'swapInitialized')
            .withArgs(addrETH.address, addrBSC.address, "1000000", true);
            expect(await ERC20.balanceOf(addrETH.address)).to.equal("9999000000");
        });

        it("Should mint tokens on your balance, when you use \"redeem\" function", async function () {
            const msg = await ethers.utils.solidityKeccak256(
            ["address", "address", "uint256", "uint256", "bool"], 
            [addrETH.address, addrBSC.address, 1000000, 0, true]); 

            let signature = await app.signMessage(await ethers.utils.arrayify(msg));

            await bridgeBSC.redeem(addrETH.address, addrBSC.address, 1000000, 0, signature);
            expect(await BEP20.balanceOf(addrBSC.address)).to.equal("1000000");
        });
    });

    describe("Reverts", function () {
        it("Should revert minting, if transaction has already been completed", async function () {
            const msg = await ethers.utils.solidityKeccak256(
            ["address", "address", "uint256", "uint256", "bool"], 
            [addrETH.address, addrBSC.address, 1000000, 0, true]); 
    
            let signature = await app.signMessage(await ethers.utils.arrayify(msg));
    
            await expect(bridgeBSC.redeem(addrETH.address, addrBSC.address, 1000000, 0, signature)).to.be
            .revertedWith("This transaction has already been completed");
        });

        it("Should revert transaction if it was signed by another signer", async function () {
            const msg = await ethers.utils.solidityKeccak256(
            ["address", "address", "uint256", "uint256", "bool"], 
            [addrETH.address, addrBSC.address, 1000000, 0, true]); 
        
            let signature = await addrBSC.signMessage(await ethers.utils.arrayify(msg));
        
            await expect(bridgeBSC.redeem(addrETH.address, addrBSC.address, 1000000, 1, signature)).to.be
            .revertedWith("Incorrect signer");
        });
    });
});