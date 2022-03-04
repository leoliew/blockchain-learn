// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
module.exports = async (hardhat) => {
  const { deployments } = hardhat
  const { deploy } = deployments
  const [signer1] = await hardhat.ethers.getSigners()
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // const Counter = await hre.ethers.getContractFactory("Counter");
  // const counter = await Counter.deploy();
  const counter = await deploy('Counter', {
    from: signer1.address,
    skipIfAlreadyDeployed: false
  })

  console.log('Counter deployed to:', counter.address)
}