//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Bank {
    mapping(address => uint) public balanceOf;
    // 用于标记余额存储的情况
    mapping(address => bool) private isIncluded;
    address[] private included;
    // 设定可提取的owner,目前设置为合约owner
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Bank: NOT_OWNER");
        _;
    }

    // 接收以太币
    receive() external payable {
        if (!isIncluded[msg.sender]) {
            isIncluded[msg.sender] = true;
            included.push(msg.sender);
        }
        balanceOf[msg.sender] += msg.value;
    }


    // 提取金额
    function withdraw() public onlyOwner {
        require(address(this).balance > 0);
        payable(msg.sender).transfer(address(this).balance);
        // 清除所有余额
        for (uint256 i = 0; i < included.length; i++) {
            isIncluded[included[i]] = false;
            balanceOf[included[i]] = 0;
        }
        delete included;
    }
}
