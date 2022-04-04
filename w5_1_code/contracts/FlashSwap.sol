// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./interfaces/IUniSwapV2.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import './interfaces/IWETH.sol';
import "hardhat/console.sol";


interface IUniswapV2Callee {
    function uniswapV2Call(
        address sender,
        uint amount0,
        uint amount1,
        bytes calldata data
    ) external;
}

contract FlashSwap is IUniswapV2Callee {

    ISwapRouter public immutable swapRouter;
    address FACTORY;
    address WETH;
    uint256 MAX_INT = 2 ** 256 - 1;
    address SWAP_ROUTER = 0xE592427A0AEce92De3Edee1F18E0157C05861564;

    constructor(address _factory, address _wETH) public {
        FACTORY = _factory;
        WETH = _wETH;
        // rinkeby 测试网地址
        swapRouter = ISwapRouter(SWAP_ROUTER);
    }

    event Log(string message, uint val);

    receive() external payable {}

    function testFlashSwap(address _tokenB, address _tokenA, uint _amount) external {
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenB, _tokenA);
        require(pair != address(0), "!pair");
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();
        uint amount0Out = _tokenB == token0 ? _amount : 0;
        uint amount1Out = _tokenB == token1 ? _amount : 0;
        // need to pass some data to trigger uniswapV2Call
        bytes memory data = abi.encode(_tokenB, _tokenA, _amount);

        IERC20(_tokenB).approve(pair, _amount);
        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
    }

    // called by pair contract
    function uniswapV2Call(
        address _sender,
        uint _amount0,
        uint _amount1,
        bytes calldata _data
    ) external override {
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        address pair = IUniswapV2Factory(FACTORY).getPair(token0, token1);
        require(msg.sender == pair, "!pair");
        require(_sender == address(this), "!sender");

        (address _tokenB, address _tokenA, uint amount) = abi.decode(_data, (address, address, uint));
        //1.执行套利
        // do stuff here
        console.log("amount", amount);
        console.log("amount0", _amount0);
        console.log("amount1", _amount1);


        uint balanceOfBToken = IERC20(_tokenB).balanceOf(address(this));
        uint balanceOfAToken = IERC20(_tokenA).balanceOf(address(this));
        console.log('==debug==');
        console.log("tokenB", _tokenB);
        console.log("tokenA", _tokenA);
        console.log("atoken", balanceOfAToken);
        console.log("btoken", balanceOfBToken);
        console.log('====');

//        TransferHelper.safeApprove(_tokenIn, address(swapRouter), balanceOfAToken);
        //        //        // create params of swap
        //        //        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        //        //        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        //        ISwapRouter.ExactInputSingleParams memory params =
        //        ISwapRouter.ExactInputSingleParams({
        //        tokenIn : ATOKEN,
        //        tokenOut : asset,
        //        fee : v3PoolFee,
        //        recipient : address(this),
        //        deadline : block.timestamp,
        //        amountIn : balanceOfAToken,
        //        amountOutMinimum : 0,
        //        sqrtPriceLimitX96 : 0
        //        });
        //        uint amountOut = swapRouter.exactInputSingle(params);
        //        console.log('after uniswap v3 , AToken amount >>> ', IERC20(ATOKEN).balanceOf(address(this)));
        //        console.log('after uniswap v3 , BUSD amount >>> ', IERC20(asset).balanceOf(address(this)));




        //2.还款回合约
        // about 0.3%, 还回去的时候需要带上手续费
        uint fee = ((amount * 3) / 997) + 1;
        uint amountToRepay = amount + fee;
        console.log("fee", fee);
        console.log("amount to repay", amountToRepay);
        IERC20(_tokenB).transfer(pair, amountToRepay);

        //3.套利盈利返回发起人
    }
}