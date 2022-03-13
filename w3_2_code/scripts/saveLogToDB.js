const { ethers, network } = require('hardhat')

const MyERC721 = require(`../deployments/${network.name}/MyERC721.json`)

// 数据库连接部分
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const dbName = 'crypto'
let mongodbClient

async function parseTransferEvent (event) {
  const TransferEvent = new ethers.utils.Interface(['event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'])
  let decodedData = TransferEvent.parseLog(event)
  console.log(event.transactionHash)
  console.log('from:' + decodedData.args.from)
  console.log('to:' + decodedData.args.to)
  console.log('tokenId:' + decodedData.args.tokenId)
  await saveLogToMongodb({
    transactionHash: event.transactionHash,
    from: decodedData.args.from,
    to: decodedData.args.to,
    tokenId: decodedData.args.tokenId.toString()
  })
}

/**
 * 保存数据到mongodb
 * @param event
 * @returns {Promise<void>}
 */
async function saveLogToMongodb (event) {
  const db = await mongodbClient.db(dbName)
  const collection = await db.collection('transfer_events')
  const query = { transaction_hash: event.transactionHash }
  const update = {
    $set: {
      transaction_hash: event.transactionHash,
      from: event.from,
      to: event.to,
      token_id: event.tokenId
    }
  }
  await collection.updateOne(query, update, { upsert: true })
}

async function main () {
  let [wallet1, wallet2] = await ethers.getSigners()
  mongodbClient = await MongoClient.connect(url)
  let myERC721 = await ethers.getContractAt('MyERC721', MyERC721.address, wallet1)

  let filter = myERC721.filters.Transfer()
  filter.fromBlock = 1
  filter.toBlock = 100

  // let events = await myerc20.queryFilter(filter);
  let events = await ethers.provider.getLogs(filter)
  for (let i = 0; i < events.length; i++) {
    // console.log(events[i]);
    await parseTransferEvent(events[i])
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })