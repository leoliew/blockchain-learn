// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
const { ethers } = require('hardhat')
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
module.exports = async (hardhat) => {

  const { deployments } = hardhat
  const { deploy } = deployments

  const [wallet1] = await ethers.getSigners()

  const daoToken = await deploy('Token', {
    from: wallet1.address,
    skipIfAlreadyDeployed: false
  })
  console.log('DAOToken:' + daoToken.address)

  const treasury = await deploy('Treasury', {
    from: wallet1.address,
    skipIfAlreadyDeployed: false
  })
  console.log('Treasury:' + treasury.address)

  const gov = await deploy('Gov', {
    contract: 'Gov',
    args: [daoToken.address, treasury.address],
    from: wallet1.address,
    skipIfAlreadyDeployed: false
  })
  console.log('Gov:' + gov.address)

  // 修改金库的 owner 为 gov
  const treasuryContract = await ethers.getContractAt('Treasury', treasury.address)
  await treasuryContract.transferOwnership(gov.address)
}
