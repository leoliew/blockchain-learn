// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {

    address public owner = msg.sender;

    constructor(uint256 initialSupply) ERC20("MyERC20", "MERC") {
        owner = msg.sender;
        _mint(msg.sender, initialSupply);
    }

    // 增发代币
    function mint(uint256 amount) external {
        require(msg.sender == owner);
        _mint(msg.sender, amount);
    }
}
