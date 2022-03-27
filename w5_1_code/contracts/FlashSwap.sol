// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

//import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol';
//import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
//import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol';
//import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
//import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "./interfaces/IUniSwapV2.sol";


//import '../libraries/UniswapV2Library.sol';
//import '../interfaces/V1/IUniswapV1Factory.sol';
//import '../interfaces/V1/IUniswapV1Exchange.sol';
//import '../interfaces/IUniswapV2Router01.sol';
//import './interfaces/IERC20.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
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


    // Uniswap V2 router
    // 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
    //    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    //    address private constant WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;
    //    address private constant WETH = 0xbdee82E0f82Cd9082Cb361a7Aa49e13013CDc24F;
    // Uniswap V2 factory
    //    address private constant FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address FACTORY;
    address WETH;
    uint256 MAX_INT = 2 ** 256 - 1;


    constructor(address _factory, address _wETH) public {
        //        factoryV1 = IUniswapV1Factory(_factoryV1);
        FACTORY = _factory;
        WETH = _wETH;
        //        WETH = IWETH(IUniswapV2Router01(router).WETH());
    }


    event Log(string message, uint val);

    receive() external payable {}

    function testFlashSwap(address _tokenBorrow, uint _amount) external {
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenBorrow, WETH);
        require(pair != address(0), "!pair");
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();
        uint amount0Out = _tokenBorrow == token0 ? _amount : 0;
        uint amount1Out = _tokenBorrow == token1 ? _amount : 0;
        // need to pass some data to trigger uniswapV2Call
        bytes memory data = abi.encode(_tokenBorrow, _amount);

        IERC20(WETH).approve(pair, MAX_INT);
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

        (address tokenBorrow, uint amount) = abi.decode(_data, (address, uint));

        // about 0.3%, 还回去的时候需要带上手续费
        uint fee = ((amount * 3) / 997) + 1;
        uint amountToRepay = amount + fee;

        // do stuff here
        emit Log("amount", amount);
        emit Log("amount0", _amount0);
        emit Log("amount1", _amount1);
        emit Log("fee", fee);
        emit Log("amount to repay", amountToRepay);

        IERC20(tokenBorrow).transfer(pair, amountToRepay);
    }
}