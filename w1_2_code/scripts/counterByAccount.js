const { ethers, network } = require('hardhat')
const counterContractAddress = require(`../deployments/${network.name}/Counter.json`)

/**
 * 通过部署后的路径找到合约地址，并通过另外一个账号调用合约
 * @returns {Promise<void>}
 */
async function main () {
  let [signer1, signer2] = await ethers.getSigners()
  let counterContract = await ethers.getContractAt('Counter', counterContractAddress.address, signer2)
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
