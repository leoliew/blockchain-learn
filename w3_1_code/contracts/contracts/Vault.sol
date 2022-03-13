// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault {

    mapping(address => uint) public deposited;
    address public immutable token;

    constructor(address _token) {
        token = _token;
    }

    // 存入ERC20，并记录金额
    function deposit(address user, uint amount) public {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer from error");
        deposited[user] += amount;
    }

    // 提现金额
    function withdraw(uint amount) public {
        require(deposited[msg.sender] - amount >= 0, "Balance not enough");
        IERC20(token).transfer(msg.sender, amount);
        deposited[msg.sender] -= amount;
    }
}
