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

  let usdcInitialSupply = ethers.utils.parseUnits('10000', 18)
  let usdcToken = await deploy('USDC', {
    contract: 'Token',
    args: ['USDC', 'USDC', usdcInitialSupply],
    from: signer1.address,
    skipIfAlreadyDeployed: false
  })
  console.log('USDC:' + usdcToken.address)

  let callOptionsToken = await deploy('CallOptionsToken', {
    contract: 'CallOptionsToken',
    args: [usdcToken.address, 10],
    from: signer1.address,
    skipIfAlreadyDeployed: false
  })
  console.log('CallOptionsToken:' + callOptionsToken.address)
}
