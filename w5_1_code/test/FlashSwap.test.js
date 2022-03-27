// const BN = require('bn.js')
// const { sendEther, pow } = require('./util')
const { ethers, network, waffle } = require('hardhat')
// const { DAI, DAI_WHALE, USDC, USDC_WHALE, USDT, USDT_WHALE } = require('./config')
// const AToken = require(`../deployments/${network.name}/AToken.json`)


const format = function (amount) {
  return ethers.utils.formatUnits(amount, 18);
}


// rinkeby 测试网地址
// const AToken = {
//   address: '0x6E273F7F681F7D15B3063BA901b309e317508463'
// }
//
// const BToken = {
//   address: '0xbdee82e0f82cd9082cb361a7aa49e13013cdc24f'
// }

// const IERC20 = artifacts.require("IERC20")
// const FlashSwapTest = artifacts.require("TestUniswapFlashSwap")

describe('FlashSwap', function () {
  // const WHALE = USDC_WHALE
  // const TOKEN_BORROW = USDC
  const DECIMALS = 6
  // const FUND_AMOUNT = pow(10, DECIMALS).mul(new BN(2000))
  // const BORROW_AMOUNT = pow(10, DECIMALS).mul(new BN(1000))

  const FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
  const WETH = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
  let flashSwap
  let aTokenAddress = '0x6E273F7F681F7D15B3063BA901b309e317508463'
  let aToken
  let wETH
  let wallet1

  beforeEach(async () => {
    [wallet1] = await ethers.getSigners()
    const FlashSwap = await ethers.getContractFactory('FlashSwap')
    flashSwap = await FlashSwap.deploy(FACTORY,WETH)
    // 解决weth没有余额的问题
    wETH =  await ethers.getContractAt('IWETH', WETH, wallet1)
    aToken =  await ethers.getContractAt('Token', aTokenAddress, wallet1)
    const flashSwapBalanceOfwETH = await wETH.balanceOf(flashSwap.address);
    const flashSwapBalanceOfaToken = await aToken.balanceOf(flashSwap.address);
    // 准备足够的weth，用于兑换AToken
    if(flashSwapBalanceOfwETH < ethers.utils.parseUnits('0.01', 18)){
      await wETH.transfer(flashSwap.address, ethers.utils.parseUnits('0.01', 18))
    }
    // 准备足够的AToken,用于在兑换完成后可以有足够的手续费还回池子
    if(flashSwapBalanceOfaToken < ethers.utils.parseUnits('1', 18)){
      await aToken.transfer(flashSwap.address, ethers.utils.parseUnits('1', 18))
    }
  })

  it('should be flash swap success', async () => {
    let borrowAmount = ethers.utils.parseUnits('0.01', 18)
    console.log('===执行闪电兑换前===')
    const beforeATokenBalance = await aToken.balanceOf(flashSwap.address);
    const beforeWETHBalance = await wETH.balanceOf(flashSwap.address);
    console.log(`合约拥有wETH：${format(beforeWETHBalance)}`)
    console.log(`合约拥有AToken：${format(beforeATokenBalance)}`)
    await flashSwap.testFlashSwap(aTokenAddress, borrowAmount)
    console.log('===执行闪电兑换后===')
    const afterATokenBalance = await aToken.balanceOf(flashSwap.address);
    const afterWETHBalance = await wETH.balanceOf(flashSwap.address);
    console.log(`合约拥有wETH：${format(afterWETHBalance)}`)
    console.log(`合约拥有AToken：${format(afterATokenBalance)}`)
    console.log("flash swap success!")
  })
})
