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
  // kovan测试网地址
  const ADDRESS_PROVIDER = '0x88757f2f99175387ab4c6a4b3067c77a695b0349'
  let aaveFlashLoan = await deploy('AaveFlashLoan', {
    contract: 'AaveFlashLoan',
    args: [ADDRESS_PROVIDER],
    from: signer1.address,
    skipIfAlreadyDeployed: false
  })
  console.log('AaveFlashLoan:' + aaveFlashLoan.address)
}
