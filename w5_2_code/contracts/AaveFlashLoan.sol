// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "./interfaces/aave/FlashLoanReceiverBase.sol";
import "hardhat/console.sol";


contract AaveFlashLoan is FlashLoanReceiverBase {
    using SafeMath for uint;
    // Kovan 网络的地址
    ISwapRouter public immutable swapRouter;
    address UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address ATOKEN = 0x8916cb563b92b9fCF5D0cf0426FAc9436a110FD7;
    address WETH = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;
    address SWAP_ROUTER = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    uint24 public constant v3PoolFee = 3000;

    event Log(string message, uint val);

    constructor(ILendingPoolAddressesProvider _addressProvider) public FlashLoanReceiverBase(_addressProvider){
        swapRouter = ISwapRouter(SWAP_ROUTER);
    }

    function testFlashLoan(address asset, uint amount) external {
        uint bal = IERC20(asset).balanceOf(address(this));

        address receiver = address(this);
        address[] memory assets = new address[](1);
        assets[0] = asset;
        uint[] memory amounts = new uint[](1);
        amounts[0] = amount;
        // 0 = no debt, 1 = stable, 2 = variable
        // 0 = pay all loaned
        uint[] memory modes = new uint[](1);
        modes[0] = 0;
        address onBehalfOf = address(this);
        bytes memory params = "";
        // extra data to pass abi.encode(...)
        uint16 referralCode = 0;
        LENDING_POOL.flashLoan(
            receiver,
            assets,
            amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
    }

    function executeOperation(
        address[] calldata assets,
        uint[] calldata amounts,
        uint[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        // do stuff here (arbitrage, liquidation, etc...)
        // abi.decode(params) to decode params
        for (uint i = 0; i < assets.length; i++) {
            uint bal = IERC20(assets[i]).balanceOf(address(this));
            emit Log("borrowed", amounts[i]);
            emit Log("fee", premiums[i]);
            uint amountOwing = amounts[i].add(premiums[i]);
            console.log('balance>>', bal);
            console.log('amountOwing>>', amountOwing);
            _arbitrageOnUniswap(assets[i], amounts[i]);
            // repay to Aave
            IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
        }
        return true;
    }


    function _arbitrageOnUniswap(address asset, uint amount) internal {
        // 1.从 uniswap v2 中使用 busd 兑换 aToken
        uint _amountOutMin = 0;
        IERC20(asset).approve(UNISWAP_V2_ROUTER, amount);
        address[] memory path;
        path = new address[](2);
        path[0] = asset;
        path[1] = ATOKEN;
        IUniswapV2Router02(UNISWAP_V2_ROUTER).swapExactTokensForTokens(
            amount,
            _amountOutMin,
            path,
            address(this),
            block.timestamp
        );
        uint balanceOfAToken = IERC20(ATOKEN).balanceOf(address(this));

        console.log('after uniswap v2 , AToken amount >>> ', balanceOfAToken);
        console.log('after uniswap v2 , BUSD amount >>> ', IERC20(asset).balanceOf(address(this)));
        // 2.从 uniswap v3 中使用 aToken 兑换 busd
        // Approve the router to spend
        TransferHelper.safeApprove(ATOKEN, address(swapRouter), balanceOfAToken);
        // create params of swap
        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params =
        ISwapRouter.ExactInputSingleParams({
        tokenIn : ATOKEN,
        tokenOut : asset,
        fee : v3PoolFee,
        recipient : address(this),
        //        recipient : msg.sender,
        deadline : block.timestamp,
        amountIn : balanceOfAToken,
        amountOutMinimum : 0,
        sqrtPriceLimitX96 : 0
        });

        // The call to `exactInputSingle` executes the swap given the route.
        console.log('=debug==');
        console.log(ATOKEN);
        console.log(asset);
        console.log(v3PoolFee);
        console.log(address(this));
        console.log(block.timestamp);
        console.log(balanceOfAToken);
        console.log('===');
        uint amountOut = swapRouter.exactInputSingle(params);
        console.log('after uniswap v3 , AToken amount >>> ', IERC20(ATOKEN).balanceOf(address(this)));
        console.log('after uniswap v3 , BUSD amount >>> ', IERC20(asset).balanceOf(address(this)));
    }
}