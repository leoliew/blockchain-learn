const { ethers, network, waffle } = require('hardhat')
const provider = waffle.provider

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
  // const poolInfo = await masterChef.poolInfo(0)
  // 如果池子不存在则创建池子
  // if (poolInfo.length < 1) {
  //   await masterChef.add(1, aToken.address, true)
  // }
  // console.log(poolInfo)
  await myTokenMarket.buyTokenAndStake(0, 0, { value: buyEthAmount })
  let beforeBalance = await aToken.balanceOf(wallet1.address)
  console.log(`提现前AToken余额: ${ethers.utils.formatUnits(beforeBalance)}`)
  console.log('===执行提现===')
  const tokenMarketBalance = await aToken.balanceOf(myTokenMarket.address)
  await myTokenMarket.withdraw(0)
  let afterBalance = await aToken.balanceOf(wallet1.address)
  console.log(`提现后AToken余额: ${ethers.utils.formatUnits(afterBalance)}, 即兑换出：${ethers.utils.formatUnits(afterBalance.sub(beforeBalance), 18)} AToken`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })