const { ethers, network } = require('hardhat')
const format = function (amount) {
  return ethers.utils.formatUnits(amount, 18)
}

async function main () {
  const [wallet1] = await ethers.getSigners()
  // kovan测试网地址
  const ADDRESS_PROVIDER = '0x88757f2f99175387ab4c6a4b3067c77a695b0349'
  const BUSD_ADDRESS = '0x4c6E1EFC12FDfD568186b7BAEc0A43fFfb4bCcCf'
  const busdToken = await ethers.getContractAt('IERC20', BUSD_ADDRESS)
  const aaveFlashLoanContract = await ethers.getContractFactory('AaveFlashLoan')
  const aaveFlashLoan = await aaveFlashLoanContract.deploy(ADDRESS_PROVIDER)
  // 使用已部署的合约进行测试
  // const AAVE_FLASH_ADDRESS = '0xC17B9dd4dC710354140799C8C805Be89fe45F768'
  // const aaveFlashLoan = await ethers.getContractAt('AaveFlashLoan', AAVE_FLASH_ADDRESS)
  const busdBalance = await busdToken.balanceOf(wallet1.address)
  console.log(`闪电贷前持有BUSD: ${format(busdBalance)}`)
  // send enough token to cover fee
  // console.log(wallet1.address)
  await busdToken.connect(wallet1).transfer(aaveFlashLoan.address, ethers.utils.parseUnits('1', 18))
  await aaveFlashLoan.connect(wallet1).testFlashLoan(busdToken.address, ethers.utils.parseUnits('5', 18))
  const afterBusdBalance = await busdToken.balanceOf(wallet1.address)
  console.log(`闪电贷后持有BUSD: ${format(afterBusdBalance)}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })