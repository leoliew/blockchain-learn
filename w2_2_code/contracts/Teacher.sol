//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./interfaces/IScore.sol";

contract Teacher {
    IScore public score;

    constructor(IScore _score) {
        score = _score;
    }

    function setScore(address _student, uint _score) external {
        score.setScore(_student, _score);
    }
}
