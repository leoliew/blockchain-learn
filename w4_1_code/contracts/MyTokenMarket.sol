// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";

contract MyTokenMarket {

    using SafeERC20 for IERC20;

    address public myToken;
    address public router;
    address public wETH;

    // 构造方法
    constructor(address _token, address _router, address _wETH) {
        myToken = _token;
        router = _router;
        wETH = _wETH;
    }

    // 用ETH+Token添加流动性
    function addLiquidity(uint tokenAmount) public payable {
        IERC20(myToken).safeTransferFrom(msg.sender, address(this), tokenAmount);
        IERC20(myToken).safeApprove(router, tokenAmount);
        // ignore slippage
        IUniswapV2Router01(router).addLiquidityETH{value : msg.value}(myToken, tokenAmount, 0, 0, msg.sender, block.timestamp);
        //TODO: 需要处理多余的部分金额
    }

    // 用 ETH 购买 Token
    function buyToken(uint minTokenAmount) public payable {
        address[] memory path = new address[](2);
        path[0] = wETH;
        path[1] = myToken;
        IUniswapV2Router01(router).swapExactETHForTokens{value : msg.value}(minTokenAmount, path, msg.sender, block.timestamp);
    }
}
