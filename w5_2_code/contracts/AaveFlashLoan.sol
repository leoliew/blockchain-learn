// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "./interfaces/aave/FlashLoanReceiverBase.sol";

import "hardhat/console.sol";


contract AaveFlashLoan is FlashLoanReceiverBase {
    using SafeMath for uint;

    event Log(string message, uint val);

    constructor(ILendingPoolAddressesProvider _addressProvider) public FlashLoanReceiverBase(_addressProvider){}

    function testFlashLoan(address asset, uint amount) external {
        uint bal = IERC20(asset).balanceOf(address(this));

        console.log('balance>>', bal);
        console.log('borrowAmount>>', amount);

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
//            console.log('borrowed', amounts[i]);
//            console.log('fee', premiums[i]);
            // 1.从 uniswap v2 中使用 busd 兑换 aToken
            uint UNISWAP_V2_ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
            uint memory _tokenIn = assert[i];
            uint memory _tokenIn = bal;
            uint memory _tokenOut = '';
            IERC20(_tokenIn).approve(UNISWAP_V2_ROUTER, _tokenIn);
            address[] memory path;
            if (_tokenIn == WETH || _tokenOut == WETH) {
                path = new address[](2);
                path[0] = _tokenIn;
                path[1] = _tokenOut;
            } else {
                path = new address[](3);
                path[0] = _tokenIn;
                path[1] = WETH;
                path[2] = _tokenOut;
            }
            IUniswapV2Router(UNISWAP_V2_ROUTER).swapExactTokensForTokens(
                _amountIn,
                _amountOutMin,
                path,
                _to,
                block.timestamp
            );

            // 2.从 uniswap v3 中使用 aToken 兑换 busd


            // repay to Aave
            IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
        }

        return true;
    }

}