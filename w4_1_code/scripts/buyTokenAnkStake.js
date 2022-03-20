const { ethers, network,waffle } = require('hardhat')
const provider = waffle.provider;

const AToken = require(`../deployments/${network.name}/AToken.json`)
const MyTokenMarket = require(`../deployments/${network.name}/MyTokenMarket.json`)

async function main () {

  let masterChefAddress = '0x51A1ceB83B83F1985a81C295d1fF28Afef186E02'

  let [wallet1] = await ethers.getSigners()
  let aToken = await ethers.getContractAt('Token', AToken.address, wallet1)
  let myTokenMarket = await ethers.getContractAt('MyTokenMarket', MyTokenMarket.address, wallet1)
  let masterChef = await ethers.getContractAt('IMasterChef', masterChefAddress, wallet1)
  const ethAmount = 10
  let buyEthAmount = ethers.utils.parseUnits(ethAmount.toString(), 18)
  console.log('===购买并质押AToken===')
  const poolInfo = await masterChef.poolInfo(0)
  // 如果池子不存在则创建池子
  if (poolInfo.length < 1) {
    await masterChef.add(1, aToken.address, true)
  }
  // console.log(poolInfo)

  // const tokenMarketBalance = await aToken.balanceOf(myTokenMarket.address)
  // console.log(ethers.utils.formatUnits(tokenMarketBalance))

  let userInfoss = await masterChef.userInfo(0,myTokenMarket.address)
  console.log(userInfoss)

  console.log(ethers.utils.formatUnits(poolInfo[1]))
  console.log(ethers.utils.formatUnits(poolInfo[2]))
  console.log(ethers.utils.formatUnits(poolInfo[3]))

  // const balance0ETH = await provider.getBalance(wallet1.address);
  // console.log(`提现前ETH余额: ${ethers.utils.formatUnits(balance0ETH)}`)

  await myTokenMarket.buyTokenAndStake(0, 0, { value: buyEthAmount })
  // let userInfo = await masterChef.totalAllocPoint()
  // let userInfo = await masterChef.userInfo('0', wallet1.address)

  // let beforeBalance = await aToken.balanceOf(wallet1.address)
  // console.log(`提现前AToken余额: ${ethers.utils.formatUnits(beforeBalance)}`)
  // const balance1ETH = await provider.getBalance(wallet1.address);
  // console.log(`提现后ETH余额: ${ethers.utils.formatUnits(balance1ETH)}`)

  // console.log('===执行提现===')
  // await myTokenMarket.withdraw('0',  ethers.utils.parseUnits("1", 18))
  // let afterBalance = await aToken.balanceOf(wallet1.address)
  // console.log(`提现后AToken余额: ${ethers.utils.formatUnits(afterBalance)}`)
  // console.log(userInfo)

  // console.log(`用户用${ethAmount}eth 购买到: ${ethers.utils.formatUnits(afterBalance.sub(beforeBalance), 18)} AToken`)

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })