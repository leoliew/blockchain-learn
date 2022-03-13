const { expect } = require('chai')
const { ethers } = require('hardhat')
const hre = require('hardhat')
const toWei = ethers.utils.parseEther

describe('MyERC20', function () {

  let wallet
  let myERC20

  beforeEach(async () => {
    [wallet] = await hre.ethers.getSigners()
    // We get the contracts to deploy
    const MyERC20 = await hre.ethers.getContractFactory('MyERC20')

    myERC20 = await MyERC20.deploy(0)
  })

  it('my erc20 parameter should be correct', async function () {
    expect(await myERC20.totalSupply()).to.be.equal(0)
  })

  it('can increase totalSupply to my erc20', async function () {
    await myERC20.mint(2)
    expect(await myERC20.totalSupply()).to.be.equal(2)
    expect(await myERC20.balanceOf(wallet.address)).to.be.equal(2)
  })
})
