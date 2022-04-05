const { ethers } = require('hardhat')

const format = function (amount) {
  return ethers.utils.formatUnits(amount, 18)
}

async function main () {

  const FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
  const WETH = '0xc778417E063141139Fce010982780140Aa0cD5Ab'
  const FLASH_SWAP_ADDRESS = '0x21D1e40eC17043dF1d13A5db19E86f39d2F35d7A'
  let ATOKEN_ADDRESS = '0x6E273F7F681F7D15B3063BA901b309e317508463'
  let BTOKEN_ADDRESS = '0xbdee82E0f82Cd9082Cb361a7Aa49e13013CDc24F'
  let flashSwap
  let aToken
  let bToken
  let wallet1

  [wallet1] = await ethers.getSigners()
  // 本地跟测试环境地址进行切换
  // const FlashSwap = await ethers.getContractFactory('FlashSwap')
  // flashSwap = await FlashSwap.deploy(FACTORY, WETH)
  flashSwap = await ethers.getContractAt('FlashSwap', FLASH_SWAP_ADDRESS, wallet1)
  aToken = await ethers.getContractAt('Token', ATOKEN_ADDRESS, wallet1)
  bToken = await ethers.getContractAt('Token', BTOKEN_ADDRESS, wallet1)
  // TODO:金额的部分需要重构，避免重复代码
  console.log('===执行闪电兑换前===')
  const beforeATokenBalance = await aToken.balanceOf(wallet1.address)
  const beforeBTokenBalance = await bToken.balanceOf(wallet1.address)
  console.log(`拥有AToken：${format(beforeATokenBalance)}`)
  console.log(`拥有BToken：${format(beforeBTokenBalance)}`)

  await bToken.transfer(flashSwap.address, ethers.utils.parseUnits('1', 18))
  // 准备足够的AToken,用于在兑换完成后可以有足够的手续费还回池子
  let borrowAmount = ethers.utils.parseUnits('0.1', 18)
  // await flashSwap.testFlashSwap(aTokenAddress, bTokenAddress, borrowAmount)
  await flashSwap.testFlashSwap(BTOKEN_ADDRESS, ATOKEN_ADDRESS, borrowAmount)

  console.log('===执行闪电兑换后===')
  const afterATokenBalance = await aToken.balanceOf(wallet1.address)
  const afterBTokenBalance = await bToken.balanceOf(wallet1.address)
  console.log(`拥有AToken：${format(afterATokenBalance)}`)
  console.log(`拥有BToken：${format(afterBTokenBalance)}`)
  console.log('===盈利情况===')
  console.log(`减少AToken：${format(afterATokenBalance.sub(beforeATokenBalance))}`)
  console.log(`盈利BToken：${format(afterBTokenBalance.sub(beforeBTokenBalance))}`)

  console.log('flash swap success!')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })