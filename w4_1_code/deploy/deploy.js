// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
const { ethers } = require('hardhat')
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
module.exports = async (hardhat) => {
  const { deployments } = hardhat
  const { deploy } = deployments
  // 设置外部合约地址
  let routerAddress = '0x0165878A594ca255338adfa4d48449f69242Eb8F'
  let wETHAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'

  const [signer1] = await hardhat.ethers.getSigners()

  let aTokenInitialSupply = ethers.utils.parseUnits('10000', 18)
  let aToken = await deploy('AToken', {
    contract: 'Token',
    args: ['AToken', 'AToken', aTokenInitialSupply],
    from: signer1.address,
    skipIfAlreadyDeployed: false
  })
  console.log('AToken:' + aToken.address)

  let bTokenInitialSupply = ethers.utils.parseUnits('20000', 18)
  let bToken = await deploy('BToken', {
    contract: 'Token',
    args: ['BToken', 'BToken', bTokenInitialSupply],
    from: signer1.address,
    skipIfAlreadyDeployed: false
  })
  console.log('BToken:' + bToken.address)

  let myTokenMarket = await deploy('MyTokenMarket', {
    args: [aToken.address, routerAddress, wETHAddress],
    from: signer1.address,
    skipIfAlreadyDeployed: false
  })
  console.log('MyTokenMarket:' + myTokenMarket.address)
}