# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/deploy.js
npx hardhat help
```

## 合约发布流程
- 启动本地环境
  - `npx hardhat node`
- 合约编译
  - `npx hardhat compile`
- 合约发布到本地
  - 方法一，使用hardhat自带的deploy的功能
    - `npx hardhat run scripts/deploy.js --network localhost`
  - 方法二 ,使用hardhat-deploy插件管理 
    - `npx hardhat deploy --network localhost`
- 合约测试
  - `npx hardhat test`

## 通过脚本调用合约count方法
- 运行脚本
  - `npx hardhat run scripts/counter.js --network localhost`
  
## 调试方法
- 进入命令行调试
  - `npx hardhat console --network localhost `
- fork主网/测试网进行调试
  - `npx hardhat node --fork https://rinkeby.infura.io/v3/<key>`

## 验证合约
- 复制`.envrc.example`文件到根目录下`.envrc`，替换成自己的测试环境配置
- 发布合约到测试网
  - `npx hardhat deploy --network rinkeby`
- 验证测试网合约
  - 方法一：使用命令行验证（国内网络大概率连不上）
    - `npx hardhat verify address --network xxx`
  - 方法二：使用扁平化导出验证
    - `npx hardhat flatten contracts/Counter.sol >> Counter.sol`

## 部署结果
- [交易流水](https://rinkeby.etherscan.io/tx/0x56142797466f339b514d14fe47094fa47fdc46696248afa82039542121f26272)
- [合约地址](https://rinkeby.etherscan.io/address/0x6796da26e81106d73ba420ff4a69dc559f96740b#code)
