// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";
import "./interfaces/IMasterChef.sol";
import "hardhat/console.sol";

contract MyTokenMarket {

    using SafeERC20 for IERC20;

    address public myToken;
    address public router;
    address public wETH;
    address public masterChef;

    mapping(address => uint256) public stakeAmounts;

    // 构造方法
    constructor(address _token, address _router, address _masterChef, address _wETH) {
        myToken = _token;
        router = _router;
        masterChef = _masterChef;
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

    // 购买并质押
    function buyTokenAndStake(uint256 _pid, uint minTokenAmount) public payable {
        address[] memory path = new address[](2);
        path[0] = wETH;
        path[1] = myToken;
        IUniswapV2Router01(router).swapExactETHForTokens{value : msg.value}(minTokenAmount, path, address(this), block.timestamp);
        uint256 aTokenAmount = IERC20(myToken).balanceOf(address(this));
        console.log("balance Of:", aTokenAmount);
        IERC20(myToken).safeApprove(masterChef, aTokenAmount);
//        IMasterChef(masterChef).deposit(_pid, aTokenAmount);
        IMasterChef(masterChef).deposit(0, aTokenAmount);
        stakeAmounts[msg.sender] += aTokenAmount;
    }

    // 提现
    function withdraw(uint256 _pid) public {
        uint256 amountToken = stakeAmounts[msg.sender];
//        IMasterChef(masterChef).withdraw(_pid, amountToken);
        IMasterChef(masterChef).withdraw(0, amountToken);
        IERC20(myToken).safeTransfer(msg.sender, amountToken);
        stakeAmounts[msg.sender] = 0;
    }
}
