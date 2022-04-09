//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";


// ETH Call Opt
contract CallOptionsToken is ERC20, Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    uint public price;
    address public udscToken;
    uint public settlementTime; // 行权日期
    uint public constant during = 1 days; // 行权有效期

    // TODO: 可以由 proxy 合约创建并管理该 token 的声明周期
    constructor(address usdc, uint _price) ERC20("CallOptToken", "COPT") {
        udscToken = usdc;
        // 设置行权价
        price = _price;
        settlementTime = block.timestamp + 100 days;
    }

    // 铸造期权 token
    function mint() external payable onlyOwner {
        _mint(msg.sender, msg.value);
    }

    // 行权
    function settlement(uint amount) external {
        require(block.timestamp >= settlementTime && block.timestamp < settlementTime + during, "invalid time");
        _burn(msg.sender, amount);
        uint needUsdcAmount = price.mul(amount);
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