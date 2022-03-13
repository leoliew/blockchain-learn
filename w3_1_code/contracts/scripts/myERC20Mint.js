const { ethers, network } = require('hardhat')
const myERC20ContractAddress = require(`../deployments/${network.name}/MyERC20.json`)

async function main () {
  let [wallet1] = await ethers.getSigners()
  let myERC20 = await ethers.getContractAt('MyERC20', myERC20ContractAddress.address, wallet1)
  await myERC20.mint(ethers.utils.parseEther('1000'))
  const totalSupply = await myERC20.totalSupply()
  console.log('myERC20 totalSupply is:', ethers.utils.formatEther(totalSupply))
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })