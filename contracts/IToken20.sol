//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IToken20 {

    function mint(address account, uint256 amount) external;

    function burn(address account, uint256 amount) external;
}