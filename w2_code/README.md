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
- 
