//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Score {
    mapping(address => uint) public studentScore;
    address public teacher;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Score: NOT_OWNER");
        _;
    }

    modifier onlyTeacher() {
        require(msg.sender == teacher, "Score: NOT_TEACHER");
        _;
    }

    // 修改学生分数
    function setScore(address _student, uint _score) external onlyTeacher {
        require(_score <= 100,"Score: INVALID_SCORE");
        studentScore[_student] = _score;
    }

    // 设置老师地址
    function setTeacher(address _teacher) external onlyOwner {
        teacher = _teacher;
    }
}
