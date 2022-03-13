// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [wallet] = await hre.ethers.getSigners();
  // We get the contracts to deploy
  const MyERC20 = await hre.ethers.getContractFactory("MyERC20");
  // const Teacher = await hre.ethers.getContractFactory("Teacher");

  const myERC20 = await MyERC20.deploy();
  // const teacher = await Teacher.deploy(score.address);
  console.log("MyERC20 deployed to:", myERC20.address);
  // console.log("Teacher deployed to:", teacher.address);

  // 设置老师地址
  // await score.setTeacher(wallet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
