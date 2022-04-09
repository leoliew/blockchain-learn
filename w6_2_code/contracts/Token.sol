// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    constructor() ERC20("DAO", "DAO") {
        // Total number of tokens in circulation 10000 token
        uint totalSupply = 10_000e18;
        _mint(msg.sender, totalSupply);
    }
}
