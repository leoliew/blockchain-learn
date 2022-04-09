//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// ETH Call Opt
contract CallOptionsToken is ERC20, Ownable {
    using SafeERC20 for IERC20;

    uint public price;
    address public udscToken;
    uint public settlementTime; // 行权日期
    uint public constant during = 1 days; // 行权有效期

    constructor(address usdc) ERC20("CallOptToken", "COPT") {
        udscToken = usdc;
        price = 10;
        settlementTime = 100 days;
    }

    // 铸造期权 token
    function mint() external payable onlyOwner {
        _mint(msg.sender, msg.value);
    }

    // 行权
    function settlement(uint amount) external {
        require(block.timestamp >= settlementTime && block.timestamp < settlementTime + during, "invalid time");
        _burn(msg.sender, amount);
        uint needUsdcAmount = price * amount;
        IERC20(udscToken).safeTransferFrom(msg.sender, address(this), needUsdcAmount);
        safeTransferETH(msg.sender, amount);
    }


    function safeTransferETH(address to, uint256 value) internal {
        (bool success,) = to.call{value : value}(new bytes(0));
        require(success, 'TransferHelper::safeTransferETH: ETH transfer failed');
    }

    // 销毁合约
    function burnAll() external onlyOwner {
        require(block.timestamp >= settlementTime + during, "not end");
        uint usdcAmount = IERC20(udscToken).balanceOf(address(this));
        IERC20(udscToken).safeTransfer(msg.sender, usdcAmount);

        selfdestruct(payable(msg.sender));
        // uint ethAmount = address(this).balance;
        // safeTransferETH(msg.sender, ethAmount);
    }


}