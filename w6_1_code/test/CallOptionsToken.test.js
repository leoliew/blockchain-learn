const { expect } = require('chai')
const { ethers, waffle, network } = require('hardhat')
const provider = waffle.provider

const toWei = ethers.utils.parseEther
const format = function (amount) {
  return ethers.utils.formatUnits(amount, 18)
}
const toUnits = function (value) {
  return ethers.utils.parseUnits(value, 18)
}

describe('CallOptionsToken', function () {

  let wallet1
  let usdc
  let callOptionsToken

  beforeEach(async () => {
    [wallet1] = await hre.ethers.getSigners()
    const USDCContract = await ethers.getContractFactory('Token')
    usdc = await USDCContract.deploy('USDC', 'USDC', toUnits('10000'))

    const CallOptionsTokenContract = await ethers.getContractFactory('CallOptionsToken')
    callOptionsToken = await CallOptionsTokenContract.deploy(usdc.address, 10)
  })

  it('should mint token success', async function () {
    const options = { value: ethers.utils.parseEther('1.0') }
    await callOptionsToken.mint(options)
    const ethBalance = await provider.getBalance(callOptionsToken.address)
    expect(ethBalance).to.equal(toWei('1'))
    expect(await callOptionsToken.balanceOf(wallet1.address)).to.equal(toWei('1'))
  })

  it('should settlement success', async function () {
    const options = { value: ethers.utils.parseEther('1.0') }
    await callOptionsToken.mint(options)
    // 授权合约可以使用 usdc
    await usdc.approve(callOptionsToken.address, toWei('1'))
    console.log(`行权前，地址持有 USDC：${format(await usdc.balanceOf(wallet1.address))}`)
    console.log(`行权前，地址持有 ETH：${format(await provider.getBalance(wallet1.address))}`)
    console.log('=== 开始行权,以价格为 10 usdc/eth 购买 0.1 eth ===')
    // 时间设置在 100 天后
    await network.provider.send('evm_increaseTime', [3600 * 24 * 100])
    await network.provider.send('evm_mine')
    await callOptionsToken.settlement(toWei('0.1'))
    console.log(`行权后，地址持有 USDC：${format(await usdc.balanceOf(wallet1.address))}`)
    console.log(`行权后，地址持有 ETH：${format(await provider.getBalance(wallet1.address))}`)
  })

  it('should burnAll success', async function () {
    const options = { value: ethers.utils.parseEther('5.0') }
    await callOptionsToken.mint(options)
    expect(await provider.getBalance(callOptionsToken.address)).to.equal(toWei('5'))
    // 时间设置在 102 天后
    await network.provider.send('evm_increaseTime', [3600 * 24 * 102])
    await network.provider.send('evm_mine')
    await callOptionsToken.burnAll()
    expect(await provider.getBalance(callOptionsToken.address)).to.equal(toWei('0'))
  })

})