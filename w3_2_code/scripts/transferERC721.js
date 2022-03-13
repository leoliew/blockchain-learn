const { ethers, network } = require('hardhat')

const MyERC721 = require(`../deployments/${network.name}/MyERC721.json`)

async function main () {
  let [wallet1, wallet2] = await ethers.getSigners()
  let myERC721 = await ethers.getContractAt('MyERC721', MyERC721.address, wallet1)
  let tokenId = 3

  // 铸造 ERC721 token
  await myERC721.mint(wallet1.address, tokenId)
  // 进行代币转移
  await myERC721.transferFrom(wallet1.address, wallet2.address, tokenId)
  console.log('token owner is: ', await myERC721.ownerOf(tokenId))
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })