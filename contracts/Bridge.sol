//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./IToken20.sol";

contract Bridge {
    address private _offchainApp; // public address of app, that signing events
    address private _owner;
    uint256 private _chainId; // current chainId

    event SwapInitialized(
        address from,
        address to,
        uint256 amount,
        uint256 blockchainFrom, // current blockchain
        uint256 blockchainTo // blockchain - recipient
    );

    using ECDSA for bytes32;

    constructor (address offchainApp_) {
        _offchainApp = offchainApp_;
        _owner = msg.sender;
        
        uint256 chainID;
        assembly {
            chainID := chainid()
        }

        _chainId = chainID;
    }

    modifier requireOwner {
        require(msg.sender == _owner, "Not an owner");
        _;
    }

    mapping (bytes32 => bool) private _processedHashes; // hashes of transactions carried out (nonces are forming on "backend")
    mapping (address => bool) private _connectedTokens; // tokens, which user can send to another blockchain

    // this function checks signature
    function signerOf(bytes32 message_, uint8 v_, bytes32 r_, bytes32 s_) internal pure returns (address) {
        return message_.toEthSignedMessageHash().recover(v_, r_, s_);
    }

    // token sending function
    function swap(address token_, address recipient_, uint256 amount_, uint256 blockchainTo_ ) external {
        require(_connectedTokens[token_], "Token is not connected");

        IToken20(token_).burn(msg.sender, amount_);
        emit SwapInitialized(msg.sender, recipient_, amount_, _chainId, blockchainTo_);
    }

    // token receipt function
    function redeem(
        address token_, 
        address from_, 
        address to_, 
        uint256 amount_, 
        uint256 nonce_, 
        uint256 blockchainFrom_, 
        uint8 v_, bytes32 r_, bytes32 s_) external {
            require(_connectedTokens[token_], "Token is not connected");

            bytes32 message = keccak256(abi.encodePacked(from_, to_, amount_, nonce_, blockchainFrom_, _chainId));
            require(!_processedHashes[message], "This transaction has already been completed");

            require(_offchainApp == signerOf(message, v_, r_, s_), "Incorrect signer");

            _processedHashes[message] = true;
            IToken20(token_).mint(to_, amount_);
    }

    // connects token to contract
    function connectToken(address token_) external requireOwner {
        _connectedTokens[token_] = true;
    }
}