const { expect } = require('chai')
const { ethers } = require('hardhat')
const hre = require('hardhat')

describe('Bank', function () {
  it('Should send and withdraw', async function () {
    const [signer1, signer2] = await hre.ethers.getSigners()
    const Bank = await ethers.getContractFactory('Bank')
    const bank = await Bank.deploy('Hello, world!')
    await bank.deployed()

    // expect(await bank.greet()).to.equal("Hello, world!");

    await signer2.sendTransaction({ to: bank.address, value: ethers.utils.parseEther('1.0') })

    const balanceOfSigner2 = await bank.balanceOf(signer2.address)

    console.log(balanceOfSigner2)

    // const setGreetingTx = await bank.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await bank.greet()).to.equal("Hola, mundo!");
  })
})
