const { ethers } = require('hardhat')

const format = function (amount) {
  return ethers.utils.formatUnits(amount, 18)
}

async function main () {

  const FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
  const WETH = '0xc778417E063141139Fce010982780140Aa0cD5Ab'
  let aTokenAddress = '0x6E273F7F681F7D15B3063BA901b309e317508463'
  let bTokenAddress = '0xbdee82E0f82Cd9082Cb361a7Aa49e13013CDc24F'
  let flashSwap
  let aToken
  let bToken
  let wallet1

  [wallet1] = await ethers.getSigners()
  const FlashSwap = await ethers.getContractFactory('FlashSwap')
  flashSwap = await FlashSwap.deploy(FACTORY, WETH)


  aToken = await ethers.getContractAt('Token', aTokenAddress, wallet1)
  bToken = await ethers.getContractAt('Token', bTokenAddress, wallet1)
  // const flashSwapBalanceOfwETH = await wETH.balanceOf(flashSwap.address)
  const flashSwapBalanceOfaToken = await aToken.balanceOf(flashSwap.address)
  const flashSwapBalanceOfbToken = await bToken.balanceOf(flashSwap.address)
  // 准备足够的weth，用于兑换AToken
  // if (flashSwapBalanceOfwETH < ethers.utils.parseUnits('0.01', 18)) {
  //   await wETH.transfer(flashSwap.address, ethers.utils.parseUnits('0.01', 18))
  // }
  // 准备足够的AToken,用于在兑换完成后可以有足够的手续费还回池子
  if (flashSwapBalanceOfaToken < ethers.utils.parseUnits('0.1', 18)) {
    await aToken.transfer(flashSwap.address, ethers.utils.parseUnits('0.1', 18))
  }

  // TODO:金额的部分需要重构，避免重复代码
  let borrowAmount = ethers.utils.parseUnits('0.1', 18)
  console.log('===执行闪电兑换前===')
  const beforeATokenBalance = await aToken.balanceOf(flashSwap.address)
  const beforeBTokenBalance = await bToken.balanceOf(flashSwap.address)
  console.log(`合约拥有AToken：${format(beforeATokenBalance)}`)
  console.log(`合约拥有BToken：${format(beforeBTokenBalance)}`)


  await flashSwap.testFlashSwap(aTokenAddress,bTokenAddress, borrowAmount)

  console.log('===执行闪电兑换后===')
  const afterATokenBalance = await aToken.balanceOf(flashSwap.address)
  const afterBTokenBalance = await bToken.balanceOf(flashSwap.address)
  console.log(`合约拥有AToken：${format(afterATokenBalance)}`)
  console.log(`合约拥有BToken：${format(afterBTokenBalance)}`)

  console.log('flash swap success!')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })