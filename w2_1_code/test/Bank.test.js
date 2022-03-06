const { expect } = require('chai')
const { ethers } = require('hardhat')
const hre = require('hardhat')
const toWei = ethers.utils.parseEther

describe('Bank', function () {

  let wallet, wallet2
  let provider
  let bank

  beforeEach(async () => {
    [wallet, wallet2] = await hre.ethers.getSigners()
    provider = hre.ethers.provider
    const Bank = await ethers.getContractFactory('Bank')
    bank = await Bank.deploy()
  })

  it('should send and record balance', async function () {
    await wallet2.sendTransaction({ to: bank.address, value: ethers.utils.parseEther('1.0') })
    const balanceOfSigner2 = await bank.balanceOf(wallet2.address)
    // 转账后余额正确
    expect(balanceOfSigner2).to.equal(toWei('1'))
  })

  it('should not be withdraw by other address', async function () {
    await expect(bank.connect(wallet2).withdraw()).to.be.revertedWith('Not owner')
  })

  it('should be withdraw all balance', async function () {
    const sendValue = 3
    await wallet2.sendTransaction({ to: bank.address, value: ethers.utils.parseEther(sendValue.toString()) })
    const withdrawTx = await bank.withdraw()
    const walletBalance = await provider.getBalance(wallet.address)
    // 提现后金额大于10000
    expect(walletBalance).to.above(toWei('10000'))
    // 记录的余额清空
    expect(await bank.balanceOf(wallet2.address)).to.equal(0)
  })
})
