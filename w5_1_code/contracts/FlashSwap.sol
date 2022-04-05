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
    uint24 public constant v3PoolFee = 3000;

    constructor(address _factory, address _wETH) public {
        FACTORY = _factory;
        WETH = _wETH;
        // rinkeby 测试网地址
        swapRouter = ISwapRouter(SWAP_ROUTER);
    }

    event Log(string message, uint val);

    receive() external payable {}

    function testFlashSwap(address _tokenA, address _tokenB, uint _amount) external {
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);
        require(pair != address(0), "!pair");
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();
        uint amountAOut = _tokenA == token0 ? _amount : 0;
        uint amountBOut = _tokenA == token1 ? _amount : 0;
        // need to pass some data to trigger uniswapV2Call
        bytes memory data = abi.encode(_tokenA, _tokenB, _amount, msg.sender);
        IERC20(_tokenA).approve(pair, _amount);
        IUniswapV2Pair(pair).swap(amountAOut, amountBOut, address(this), data);
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
        (address _tokenA, address _tokenB, uint amount,address initiator) = abi.decode(_data, (address, address, uint, address));
        //1.预留还给 uniswap 部分金额
        // about 0.3%, 还回去的时候需要带上手续费
        uint fee = ((amount * 3) / 997) + 1;
        uint amountToRepay = amount + fee;
        console.log("fee", fee);
        console.log("amount to repay", amountToRepay);
        IERC20(_tokenA).transfer(pair, amountToRepay);

        //2.执行套利
        // do stuff here
        console.log("amount", amount);
        console.log("amount0", _amount0);
        console.log("amount1", _amount1);

        uint balanceOfAToken = IERC20(_tokenA).balanceOf(address(this));
        uint balanceOfBToken = IERC20(_tokenB).balanceOf(address(this));

        console.log('==debug==');
        console.log("tokenA", _tokenA);
        console.log("tokenB", _tokenB);
        console.log("atoken", balanceOfAToken);
        console.log("btoken", balanceOfBToken);
        console.log('====');

        TransferHelper.safeApprove(_tokenA, address(swapRouter), balanceOfAToken);
        ISwapRouter.ExactInputSingleParams memory params =
        ISwapRouter.ExactInputSingleParams({
        tokenIn : _tokenA,
        tokenOut : _tokenB,
        fee : v3PoolFee,
        recipient : address(this),
        deadline : block.timestamp,
        amountIn : balanceOfAToken,
        amountOutMinimum : 0,
        sqrtPriceLimitX96 : 0
        });
        uint amountOut = swapRouter.exactInputSingle(params);
        console.log('after uniswap v3 , AToken amount >>> ', IERC20(_tokenA).balanceOf(address(this)));
        console.log('after uniswap v3 , BToken amount >>> ', IERC20(_tokenB).balanceOf(address(this)));

        //3.套利剩余金额返回发起人
        console.log('initiator',initiator);
        if (IERC20(_tokenA).balanceOf(address(this)) > 0) {
            IERC20(_tokenA).transfer(initiator, IERC20(_tokenA).balanceOf(address(this)));
        }
        if (IERC20(_tokenB).balanceOf(address(this)) > 0) {
            IERC20(_tokenB).transfer(initiator, IERC20(_tokenB).balanceOf(address(this)));
        }
    }
}