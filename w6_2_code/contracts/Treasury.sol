// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {

    event Received(address, uint);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    // 提现当前合约所有的 eth
    function withdraw(address to) external onlyOwner {
        uint256 amount = address(this).balance;
        safeTransferETH(to, amount);
    }

    // use code from Uniswap/solidity-lib
    function safeTransferETH(address to, uint256 value) internal {
        (bool success,) = to.call{value : value}(new bytes(0));
        require(success, 'TransferHelper::safeTransferETH: ETH transfer failed');
    }
}





