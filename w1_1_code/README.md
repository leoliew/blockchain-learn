## W1-1作业

### 准备环境
- 本地安装好`truffle`和`ganache`环境
- 复制`.envrc.example`文件到根目录下`.envrc`，替换成自己的测试环境配置
- 运行`npm i`安装项目依赖

### 测试&部署
#### 本地测试
- 执行根目录下`./start_ganache.sh`启动ganache
- 执行测试`truffle test`

#### 部署到`rinkeby`测试网
- 执行`truffle migrate --network rinkeby`
> ⚠️注意：因网络影响，这里可能需要科学上网

### 部署结果
- [交易流水](https://rinkeby.etherscan.io/tx/0x3baf606a6da146eacd339b3e4b6a3ee97917692407f49377a84abae9a18b2f0b)
- [合约地址](https://rinkeby.etherscan.io/address/0xa828b0e79253dad8b56ae06821daf50acf77350f)