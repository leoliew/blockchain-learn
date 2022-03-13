<script>
import { ethers } from 'ethers'

import myERC20Contract from '../abi/localhost/MyERC20.json'
import vaultContract from '../abi/localhost/Vault.json'

const { address: vaultAddr, abi: vaultAbi } = vaultContract
const { address: myERC20Addr, abi: myERC20Abi } = myERC20Contract

export default {
  name: 'erc20',
  data () {
    return {
      // recipient: null,
      amount: null,
      withdrawAmount: null,
      balance: null,
      vaultBalance: null,
      allowanceBalance: null,

      name: null,
      decimal: null,
      symbol: null,
      supply: null,
    }
  },

  async created () {
    await this.initAccount()
    this.initContract()
    this.getInfo()
    // this.getNonce()
  },

  methods: {
    async initAccount () {
      if (window.ethereum) {
        console.log('initAccount')
        try {
          this.accounts = await window.ethereum.enable()
          console.log('accounts:' + this.accounts)
          this.account = this.accounts[0]
          // this.currProvider = window.ethereum
          this.provider = new ethers.providers.Web3Provider(window.ethereum)

          this.signer = this.provider.getSigner()
          let network = await this.provider.getNetwork()
          this.chainId = network.chainId
          console.log('chainId:', this.chainId)
        } catch (error) {
          console.log('User denied account access', error)
        }
      } else {
        console.log('Need install MetaMask')
      }
    },

    async initContract () {
      this.myERC20 = new ethers.Contract(myERC20Addr, myERC20Abi, this.signer)
      this.vault = new ethers.Contract(vaultAddr, vaultAbi, this.signer)
    },

    getInfo () {
      this.myERC20.name().then((r) => {
        this.name = r
      })
      this.myERC20.decimals().then((r) => {
        this.decimal = r
      })
      this.myERC20.symbol().then((r) => {
        this.symbol = r
      })
      this.myERC20.totalSupply().then((r) => {
        this.supply = ethers.utils.formatUnits(r, 18)
      })
      this.myERC20.balanceOf(this.account).then((r) => {
        this.balance = ethers.utils.formatUnits(r, 18)
      })
      this.vault.deposited(this.account).then((r) => {
        this.vaultBalance = ethers.utils.formatUnits(r, 18)
      })

      this.myERC20.allowance(this.account, vaultAddr).then((r) => {
        this.allowanceBalance = ethers.utils.formatUnits(r, 18)
      })

    },

    getNonce () {
      this.myERC20.nonces(this.account).then(r => {
        this.nonce = r.toString()
        console.log('nonce:' + this.nonce)
      })
    },

    transfer () {
      let amount = ethers.utils.parseUnits(this.amount, 18)
      if (this.allowanceBalance - this.amount < 0) {
        this.myERC20.approve(vaultAddr, amount).then((r) => {
          this.getInfo()
        })
      } else {
        this.vault.deposit(this.account, amount).then((r) => {
          this.getInfo()
        })
      }
    },

    withdraw () {
      let withdrawAmount = ethers.utils.parseUnits(this.withdrawAmount, 18)
      if (this.vaultBalance - this.withdrawAmount > 0) {
        this.vault.withdraw(withdrawAmount).then(() => {
          this.getInfo()
        })
      } else {
        console.log('金额不足!')
      }
    }

  }
}


</script>

<template>
  <div>

    <div>
      <br/> Token名称 : {{ name }}
      <br/> Token符号 : {{ symbol }}
      <br/> Token精度 : {{ decimal }}
      <br/> Token发行量 : {{ supply }}
      <br/> 我的余额 : {{ balance }}
      <br/> 授权金额 : {{ allowanceBalance }}
      <br/> 我存在Vault的余额 : {{ vaultBalance }}
    </div>

    <div>
      <!--      <br/>转账到:-->
      <!--      <input type="text" v-model="recipient"/>-->
      <br/>转账到Vault
      <input type="text" v-model="amount" placeholder="金额"/>
      <br/>
      <button @click="transfer()"> 转账</button>
      <br/>提现
      <input type="text" v-model="withdrawAmount" placeholder="金额"/>
      <br/>
      <button @click="withdraw()"> 转账</button>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

div {
  font-size: 1.2rem;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
