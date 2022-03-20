const { ethers, network } = require('hardhat')

const AToken = require(`../deployments/${network.name}/AToken.json`)
const MyTokenMarket = require(`../deployments/${network.name}/MyTokenMarket.json`)

async function main () {

  let [wallet1] = await ethers.getSigners()

  let aToken = await ethers.getContractAt('Token', AToken.address, wallet1)
  let myTokenMarket = await ethers.getContractAt('MyTokenMarket', MyTokenMarket.address, wallet1)

  await aToken.approve(MyTokenMarket.address, ethers.constants.MaxUint256);
  const ethAmount = 10
  let ethParsedAmount = ethers.utils.parseUnits(ethAmount.toString(), 18);
  await myTokenMarket.addLiquidity(ethParsedAmount, { value: ethParsedAmount })
  console.log("===添加流动性===");
  let aTokenBalance = await aToken.balanceOf(wallet1.address);
  console.log(`添加ETH-AToken流动性：${ethAmount}，用户持有AToken：${ethers.utils.formatUnits(aTokenBalance, 18)}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })