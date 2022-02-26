const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Counter', function () {
  it('should increase 1 to counter', async function () {
    const Counter = await ethers.getContractFactory('Counter')
    const counter = await Counter.deploy()
    await counter.deployed()
    await counter.count()
    expect(await counter.counter()).to.equal('1')
  })
})
