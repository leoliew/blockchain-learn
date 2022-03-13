// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
module.exports = async (hardhat) => {
  const { deployments } = hardhat
  const { deploy } = deployments
  const [signer1] = await hardhat.ethers.getSigners()
  const myERC721 = await deploy('MyERC721', {
    from: signer1.address,
    skipIfAlreadyDeployed: false
  })

  console.log('MyERC721 deployed to:', myERC721.address)
}