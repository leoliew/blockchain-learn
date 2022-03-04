const hre = require('hardhat')
const { deployments } = hre

/**
 * 通过deployment找到Counter合约并进行调用
 * @returns {Promise<void>}
 */
async function main () {
  const counterDeployment = await deployments.get('Counter')
  const counterContract = await hre.ethers.getContractAt('Counter', counterDeployment.address)
  let beforeCount = await counterContract.counter()
  await counterContract.count()
  const afterCount = await counterContract.counter()
  console.log('Changing counter from \'%s\' to \'%s\'', beforeCount, afterCount)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error)
      process.exit(1)
    }
  )
