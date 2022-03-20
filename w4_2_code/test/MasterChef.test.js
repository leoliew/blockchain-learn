const { ethers } = require('hardhat')
const { expect } = require('chai')
// import { advanceBlockTo } from "./utilities"

describe('MasterChef', function () {
  before(async function () {
    this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.bob = this.signers[1]
    this.carol = this.signers[2]
    this.dev = this.signers[3]
    this.minter = this.signers[4]

    this.MasterChef = await ethers.getContractFactory('MasterChef')
    this.SushiToken = await ethers.getContractFactory('SushiToken')
    this.ERC20Mock = await ethers.getContractFactory('ERC20Mock', this.minter)
  })

  beforeEach(async function () {
    this.sushi = await this.SushiToken.deploy()
    await this.sushi.deployed()
  })

  it('should set correct state variables', async function () {
    this.chef = await this.MasterChef.deploy(this.sushi.address, this.dev.address, '1000', '0', '1000')
    await this.chef.deployed()
    await this.sushi.transferOwnership(this.chef.address)
    const sushi = await this.chef.sushi()
    const devaddr = await this.chef.devaddr()
    const owner = await this.sushi.owner()
    expect(sushi).to.equal(this.sushi.address)
    expect(devaddr).to.equal(this.dev.address)
    expect(owner).to.equal(this.chef.address)
  })

  context('With ERC/LP token added to the field', function () {
    beforeEach(async function () {
      this.lp = await this.ERC20Mock.deploy('LPToken', 'LP', '10000000000')
      await this.lp.transfer(this.alice.address, '1000')
      await this.lp.transfer(this.bob.address, '1000')
      await this.lp.transfer(this.carol.address, '1000')
      this.lp2 = await this.ERC20Mock.deploy('LPToken2', 'LP2', '10000000000')
      await this.lp2.transfer(this.alice.address, '1000')
      await this.lp2.transfer(this.bob.address, '1000')
      await this.lp2.transfer(this.carol.address, '1000')
    })

    it('should allow emergency withdraw', async function () {
      // 100 per block farming rate starting at block 100 with bonus until block 1000
      this.chef = await this.MasterChef.deploy(this.sushi.address, this.dev.address, '100', '100', '1000')
      await this.chef.deployed()
      await this.chef.add('100', this.lp.address, true)
      await this.lp.connect(this.bob).approve(this.chef.address, '1000')
      await this.chef.connect(this.bob).deposit(0, '100')
      // const userInfo = await this.chef.userInfo()
      console.log()
      expect(await this.lp.balanceOf(this.bob.address)).to.equal('900')
      await this.chef.connect(this.bob).emergencyWithdraw(0)
      expect(await this.lp.balanceOf(this.bob.address)).to.equal('1000')
    })
  })
})
