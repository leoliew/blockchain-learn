const { ethers,network } = require('hardhat')
const format = function (amount) {
  return ethers.utils.formatUnits(amount, 18)
}

async function main () {

  const [wallet1] = await ethers.getSigners()
  // const WHALE = USDC_WHALE
  // const TOKEN_BORROW = USDC
  // const DECIMALS = 6
  // const FUND_AMOUNT = pow(10, DECIMALS).mul(new BN(2000))
  // const BORROW_AMOUNT = pow(10, DECIMALS).mul(new BN(1000))

  // kovan测试网地址
  const ADDRESS_PROVIDER = '0x88757f2f99175387ab4c6a4b3067c77a695b0349'
  const BUSD_ADDRESS = '0x4c6E1EFC12FDfD568186b7BAEc0A43fFfb4bCcCf'

  const busdToken = await ethers.getContractAt('IERC20', BUSD_ADDRESS)
  const aaveFlashLoanContract = await ethers.getContractFactory('AaveFlashLoan')
  const aaveFlashLoan = await aaveFlashLoanContract.deploy(ADDRESS_PROVIDER)
  // 使用已部署的合约进行测试
  // const AAVE_FLASH_ADDRESS = '0xb30483Ce9E47FdE0aff773e8A1307D953e704B95'
  // const aaveFlashLoan = await ethers.getContractAt('AaveFlashLoan', AAVE_FLASH_ADDRESS)

  const busdBalance = await busdToken.balanceOf(wallet1.address)
  console.log(format(busdBalance))


  // testAaveFlashLoan = await TestAaveFlashLoan.new(ADDRESS_PROVIDER)
  // await sendEther(web3, accounts[0], WHALE, 1)
  // send enough token to cover fee
  // const bal = await usdcToken.balanceOf(wallet1.address)
  // assert(bal.gte(FUND_AMOUNT), 'balance < FUND')



  // send enough token to cover fee
  await busdToken.transfer(aaveFlashLoan.address, ethers.utils.parseUnits('10', 18))
  await aaveFlashLoan.testFlashLoan(busdToken.address, ethers.utils.parseUnits('5000', 18))

  // const tx = await testAaveFlashLoan.testFlashLoan(token.address, BORROW_AMOUNT, {
  //   from: WHALE,
  // })
  // for (const log of tx.logs) {
  //   console.log(log.args.message, log.args.val.toString())
  // }

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })