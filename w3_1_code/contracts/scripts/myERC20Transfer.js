const { ethers, network } = require('hardhat')
const myERC20ContractAddress = require(`../deployments/${network.name}/MyERC20.json`)
const formatEther = ethers.utils.formatEther

async function main () {
  let [wallet1, wallet2] = await ethers.getSigners()
  let myERC20 = await ethers.getContractAt('MyERC20', myERC20ContractAddress.address, wallet1)
  const b1Before = await myERC20.balanceOf(wallet1.address)
  const b2Before = await myERC20.balanceOf(wallet2.address)
  console.log("before transfer, wallet1 balance is:",formatEther(b1Before))
  console.log("before transfer, wallet2 balance is:",formatEther(b2Before))
  await myERC20.transfer(wallet2.address, ethers.utils.parseEther('1'))
  const b1After = await myERC20.balanceOf(wallet1.address)
  const b2After = await myERC20.balanceOf(wallet2.address)
  console.log("after transfer, wallet1 balance is:",formatEther(b1After))
  console.log("after transfer, wallet2 balance is:",formatEther(b2After))
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })