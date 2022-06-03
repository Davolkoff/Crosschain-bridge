//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import './IToken20.sol';

contract Bridge {
    address private _offchainApp; // public address of app, that signing events
    bool blockchain; // 0 - Ethereum, 1 - Binance Smart Chain
    IToken20 token20; // token with standard ERC20

    event swapInitialized(
        address from,
        address to,
        uint256 amount,
        bool blockchainFrom // current blockchain
    );

    using ECDSA for bytes32;

    constructor (address offchainApp_, bool blockchain_, address erc20_) {
        _offchainApp = offchainApp_;
        blockchain = blockchain_;
        token20 = IToken20(erc20_);
    }

    mapping (uint256 => bool) private _nonce; //  nonces of transactions carried out (nonces are forming on "backend")

    // this function checks signature
    function signerOf(bytes32 message_, uint8 v_, bytes32 r_, bytes32 s_) internal pure returns (address) {
        return message_.toEthSignedMessageHash().recover(v_, r_, s_);
    }

    // token sending function
    function swap(address recipient_, uint256 amount_) external {
        token20.burn(msg.sender, amount_);
        emit swapInitialized(msg.sender, recipient_, amount_, !blockchain);
    }

    // token receipt function
    function redeem(address from_, address to_, uint256 amount_, uint256 nonce_, uint8 v_, bytes32 r_, bytes32 s_) external {
        require(_nonce[nonce_] == false, "This transaction has already been completed");
        
        bytes32 message = keccak256(abi.encodePacked(from_, to_, amount_, nonce_, blockchain));
        require(_offchainApp == signerOf(message, v_, r_, s_), "Incorrect signer");

        _nonce[nonce_] = true;
        token20.mint(to_, amount_);
    }
}