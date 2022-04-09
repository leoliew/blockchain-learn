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
const encodeParameters = function (types, values) {
  const abi = new ethers.utils.AbiCoder()
  return abi.encode(types, values)
}

describe('Gov', function () {

  let wallet1
  let wallet2
  let wallet3
  let treasury
  let daoToken
  let gov

  beforeEach(async () => {
    [wallet1, wallet2, wallet3] = await hre.ethers.getSigners()
    const DAOToken = await ethers.getContractFactory('Token')
    daoToken = await DAOToken.deploy()

    const TreasuryContract = await ethers.getContractFactory('Treasury')
    treasury = await TreasuryContract.deploy()

    // 往金库转 1000 eth
    await wallet1.sendTransaction({ to: treasury.address, value: ethers.utils.parseEther('1000') })
    const GovContract = await ethers.getContractFactory('Gov')
    gov = await GovContract.deploy(daoToken.address, treasury.address)

    // 修改金库的 owner 为 gov
    await treasury.transferOwnership(gov.address)
  })

  it('should propose success', async function () {
    await gov.propose(1, treasury.address, 'withdraw(address)', encodeParameters(['address'], [wallet1.address]))
    const proposal = await gov.proposals(1)
    expect(proposal.id).to.equal('1')
    expect(proposal.proposer).to.equal(wallet1.address)
    expect(proposal.approvalVotes).to.equal(0)
    expect(proposal.againstVotes).to.equal(0)
    expect(proposal.target).to.equal(treasury.address)
    expect(proposal.signature).to.equal('withdraw(address)')
    expect(proposal.calldatas).to.equal(encodeParameters(['address'], [wallet1.address]))
    expect(proposal.executed).to.equal(false)
  })

  it('should vote success', async function () {
    await gov.propose(1, treasury.address, 'withdraw(address)', encodeParameters(['address'], [wallet1.address]))
    await daoToken.transfer(wallet2.address, toUnits('1000'))
    await daoToken.transfer(wallet3.address, toUnits('1000'))
    // 用三个账号分别投票
    await gov.connect(wallet1).vote(wallet1.address, 1, true)
    await gov.connect(wallet2).vote(wallet2.address, 1, true)
    await gov.connect(wallet3).vote(wallet3.address, 1, false)
    const proposal = await gov.proposals(1)
    expect(proposal.approvalVotes.toNumber()).to.equal(9000)
    expect(proposal.againstVotes.toNumber()).to.equal(1000)
  })

  it('should execute success', async function () {
    console.log('=== 执行提案前 ===')
    const beforeEthBalance = await provider.getBalance(wallet1.address)
    console.log(`用户 ETH 余额：${format(beforeEthBalance)}`)
    await gov.propose(1, treasury.address, 'withdraw(address)', encodeParameters(['address'], [wallet1.address]))
    await gov.vote(wallet1.address, 1, true)
    await gov.execute(1, wallet1.address)
    const proposal = await gov.proposals(1)
    const contractETHBalance = await provider.getBalance(treasury.address)
    console.log('=== 执行提案，转移金库的 ETH ===')
    const afterEthBalance = await provider.getBalance(wallet1.address)
    console.log(`用户 ETH 余额：${format(afterEthBalance)}`)
    expect(proposal.executed).to.equal(true)
    expect(contractETHBalance).to.equal(toWei('0'))
  })
})