const { expect } = require('chai')
const { ethers } = require('hardhat')
const hre = require('hardhat')
const toWei = ethers.utils.parseEther

describe('Score', function () {

  let wallet
  let wallet2
  let wallet3
  let score
  let teacher

  beforeEach(async () => {
    [wallet, wallet2, wallet3] = await hre.ethers.getSigners()
    // We get the contract to deploy
    const Score = await hre.ethers.getContractFactory('Score')
    const Teacher = await hre.ethers.getContractFactory('Teacher')

    score = await Score.deploy()
    teacher = await Teacher.deploy(score.address)

    // 设置wallet1为teacher
    await score.setTeacher(wallet.address)
  })

  it('only teacher can modify score', async function () {
    await expect(score.connect(wallet2).setScore(wallet3.address, 99)).to.be.revertedWith('Score: NOT_TEACHER')
  })

  it('score must be below 100', async function () {
    await expect(score.setScore(wallet3.address, 101)).to.be.revertedWith('Score: INVALID_SCORE')
  })
})
