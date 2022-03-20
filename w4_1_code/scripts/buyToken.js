const { ethers, network } = require('hardhat')

const AToken = require(`../deployments/${network.name}/AToken.json`)
const MyTokenMarket = require(`../deployments/${network.name}/MyTokenMarket.json`)

async function main () {

  let [wallet1] = await ethers.getSigners()
  let aToken = await ethers.getContractAt('Token', AToken.address, wallet1)
  let myTokenMarket = await ethers.getContractAt('MyTokenMarket', MyTokenMarket.address, wallet1)

  let beforeBalance = await aToken.balanceOf(wallet1.address)
  const ethAmount = 10

  let buyEthAmount = ethers.utils.parseUnits(ethAmount.toString(), 18)
  await myTokenMarket.buyToken('0', { value: buyEthAmount })

  let afterBalance = await aToken.balanceOf(wallet1.address)
  console.log(`用户用${ethAmount}eth 购买到: ${ethers.utils.formatUnits(afterBalance.sub(beforeBalance), 18)} AToken`)

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })