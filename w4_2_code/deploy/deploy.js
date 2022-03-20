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

  await deploy('SushiToken', {
    from: signer1.address,
    log: true,
    deterministicDeployment: false
  })

  const sushi = await ethers.getContract('SushiToken')

  const masterChef = await deploy('MasterChef', {
    args: [sushi.address, signer1.address, '1000000000000000000000', '0', '1000000000000000000000'],
    from: signer1.address,
    skipIfAlreadyDeployed: false
  })
  console.log('MasterChef:' + masterChef.address)

  if (await sushi.owner() !== masterChef.address) {
    // Transfer Sushi Ownership to Chef
    console.log('Transfer Sushi Ownership to Chef')
    await (await sushi.transferOwnership(masterChef.address)).wait()
  }

  const masterChefContract = await ethers.getContract('MasterChef')
  if (await masterChefContract.owner() !== signer1.address) {
    // Transfer ownership of MasterChef to dev
    console.log('Transfer ownership of MasterChef to dev')
    await (await masterChefContract.transferOwnership(signer1.address)).wait()
  }

}