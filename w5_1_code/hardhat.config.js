require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')
require('hardhat-deploy')
require('hardhat-deploy-ethers')

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const { RINKEBY_ALCHEMY_URL, KOVAN_ALCHEMY_URL, PRIVATE_KEY } = process.env

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',

  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337
    },
    forking: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
      accounts: [`0x${PRIVATE_KEY}`],
      blockNumber: 10446939 // rinkeby 测试网网高度
    },
    rinkeby: {
      chainId: 4,
      url: RINKEBY_ALCHEMY_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    kovan: {
      chainId: 42,
      url: KOVAN_ALCHEMY_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
}
