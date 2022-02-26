// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract Counter {
    uint public _counter;

    constructor() {
        counter = 0;
    }

    function count() public {
        counter = counter + 1;
    }

    function setCount(int _counter) public {
        console.log("Changing counter from '%s' to '%s'", counter, _counter);
        counter = _counter;
    }

}