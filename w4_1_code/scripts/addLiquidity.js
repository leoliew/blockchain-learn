const { ethers, network } = require('hardhat')

const AToken = require(`../deployments/${network.name}/AToken.json`)
const MyTokenMarket = require(`../deployments/${network.name}/MyTokenMarket.json`)

async function main () {

  let [wallet1] = await ethers.getSigners()

  let aToken = await ethers.getContractAt('Token', AToken.address, wallet1)
  let myTokenMarket = await ethers.getContractAt('MyTokenMarket', MyTokenMarket.address, wallet1)

  await aToken.approve(MyTokenMarket.address, ethers.constants.MaxUint256);
  let ethAmount = ethers.utils.parseUnits("100", 18);
  await myTokenMarket.addLiquidity(ethAmount, { value: ethAmount })
  console.log("===添加流动性===");
  let aTokenBalance = await aToken.balanceOf(wallet1.address);
  console.log("用户持有token:" + ethers.utils.formatUnits(aTokenBalance, 18));

  // let buyEthAmount = ethers.utils.parseUnits("10", 18);
  // out = await market.buyToken("0", { value: buyEthAmount })
  //
  // b = await atoken.balanceOf(owner.address);
  // console.log("购买到:" + ethers.utils.formatUnits(b, 18));

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })