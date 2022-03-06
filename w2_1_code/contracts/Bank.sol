//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Bank {
    mapping(address => uint) public balanceOf;
    // 设定可提取的owner,目前设置为合约owner
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // 接收以太币
    receive() external payable {
        balanceOf[msg.sender] += msg.value;
    }


    // 提取金额
    function withdraw() public onlyOwner {
        require(address(this).balance > 0);
        payable(msg.sender).transfer(address(this).balance);
    }
}
