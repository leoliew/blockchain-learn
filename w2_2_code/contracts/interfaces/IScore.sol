//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IScore {
    function setScore(address _student, uint _score) external;
}
