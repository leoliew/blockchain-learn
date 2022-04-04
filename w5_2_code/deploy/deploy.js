// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
const { ethers } = require('hardhat')
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
module.exports = async (hardhat) => {
  const { deployments } = hardhat
  const { deploy } = deployments

  const [signer1] = await hardhat.ethers.getSigners()

  let aTokenInitialSupply = ethers.utils.parseUnits('10000', 18)
  let aToken = await deploy('AToken', {
    contract: 'Token',
    args: ['AToken', 'AToken', aTokenInitialSupply],
    from: signer1.address,
    skipIfAlreadyDeployed: false
  })
  console.log('AToken:' + aToken.address)

  let bTokenInitialSupply = ethers.utils.parseUnits('10000', 18)
  let bToken = await deploy('BToken', {
    contract: 'Token',
    args: ['BToken', 'BToken', bTokenInitialSupply],
    from: signer1.address,
    skipIfAlreadyDeployed: false
  })
  console.log('BToken:' + bToken.address)

}