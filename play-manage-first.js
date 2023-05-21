const Web3 = require("web3");
const ethers = require("ethers");

const provider = new Web3.providers.HttpProvider(`https://vm-216.s3it.uzh.ch`);
const web3 = new Web3(provider);
const myAddress = "0x61eabD6DEcB9bEab2e5F7edc1f9e82C24c18881D";
const privateKey = "f612e3823b299480eda3962b6c77ae371fb8e07e6aea7dbb74e5adc986bf608b";

const player2 = "0x2bFdD65d9D58172c7e1A6E57E40db311b50858f7";
const player2privateKey = "0532102155de0fd4a35cb7c62bb2053755d544c243c66805252e3000c87287b6";

const player3 = "0x52B092822317190FCCC1BF7A83fE5597A6337C11";
const player3privateKey = "3c2f452452c18af8c263f82fbe0d06cb7f9893281f0380a8b6d0c704ee2163f7";


const BetcontractABI = require("./DaiAbi.json");
const BetcontractAddress = "0x89780B11beD320FaD0Fb7bC4BE9fd8066229060B";
const Betcontract = new web3.eth.Contract(BetcontractABI, BetcontractAddress);

const contractABI = require("./contractabi.json");
const contractAddress = "0xcEe30A2C8c66A7fbF00004609A6d743465921A93";
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function Approve(fromAddress,fromAdressPrivatekey,spender,amount) {
    //新的用户（新公钥私钥）进来需要先调用一个这个
    const functionName = "approve";
    const functionArgs = [spender,amount];
    const functionABI = Betcontract.methods[functionName](...functionArgs).encodeABI();
//  const functionABI = contract.methods[functionName].encodeABI();
  const nonce = await web3.eth.getTransactionCount(fromAddress);
  const tx = {
    from: fromAddress,
    to: BetcontractAddress,
    data: functionABI,
    gas: 1000000,
    nonce: nonce,
  };
  const signedTransaction = await web3.eth.accounts.signTransaction(tx, fromAdressPrivatekey);
  const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

  console.log(result,"Approve Transaction result:");
}

async function Register(fromAddress,fromAdressPrivatekey) {
    //新的用户（新公钥私钥）进来需要先调用一个这个
    const functionName = "register";
    const functionArgs = [];
    const functionABI = contract.methods[functionName](...functionArgs).encodeABI();
//  const functionABI = contract.methods[functionName].encodeABI();
  const nonce = await web3.eth.getTransactionCount(fromAddress);
  const tx = {
    from: fromAddress,
    to: contractAddress,
    data: functionABI,
    gas: 1000000,
    nonce: nonce,
  };
  const signedTransaction = await web3.eth.accounts.signTransaction(tx, fromAdressPrivatekey);
  const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

  console.log( result,"Register Transaction result:");
}
//Register();
async function balanceRefresh(fromAddress,fromAdressPrivatekey) {
    //调用一下这个会刷新所有人的余额
    const functionName = "balanceRefresh";
    const functionArgs = [];
    const functionABI = contract.methods[functionName](...functionArgs).encodeABI();
//  const functionABI = contract.methods[functionName].encodeABI();
  const nonce = await web3.eth.getTransactionCount(fromAddress);
  const tx = {
    from: fromAddress,
    to: contractAddress,
    data: functionABI,
    gas: 1000000,
    nonce: nonce,
  };
  const signedTransaction = await web3.eth.accounts.signTransaction(tx, fromAdressPrivatekey);
  const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

  console.log( result,"balanceRefresh Transaction result:");
}
//balanceRefresh()

async function placeBet(fromAddress,fromAdressPrivatekey,number, betAmount) {
    const functionName = "placeBet";
    const functionArgs = [number, betAmount];
    const functionABI = contract.methods[functionName](...functionArgs).encodeABI();
//  const functionABI = contract.methods[functionName].encodeABI();
  const nonce = await web3.eth.getTransactionCount(fromAddress);
  const tx = {
    from: fromAddress,
    to: contractAddress,
    data: functionABI,
    gas: 1000000,
    nonce: nonce,
  };
  const signedTransaction = await web3.eth.accounts.signTransaction(tx,fromAdressPrivatekey);
  const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

  console.log( result," placeBet Transaction result:");
}

//const number = 12;
//const betAmount = 100; // 您想要下注的金额
//placeBet(number, betAmount);

async function pickWinner(fromAddress,fromAdressPrivatekey) {
    const functionName = "pickWinner";
    const functionArgs = [];
    const functionABI = contract.methods[functionName](...functionArgs).encodeABI();
//  const functionABI = contract.methods[functionName].encodeABI();
  const nonce = await web3.eth.getTransactionCount(fromAddress);
  const tx = {
    from: fromAddress,
    to: contractAddress,
    data: functionABI,
    gas: 1000000,
    nonce: nonce,
  };
  const signedTransaction = await web3.eth.accounts.signTransaction(tx, fromAdressPrivatekey);
  const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

  console.log( result,"pickWinner Transaction result:");
}
//pickWinner()
//下面的是获取需要的变量
//智能合约生成的随机数
async function getWinnerIndex() {
  try {
    const result = await contract.methods.getWinnerIndex().call();
    console.log("WinnerIndex:", result);
    return result;
  } catch (error) {
    console.error("Error in getNumber:", error);
  }
}
//获取用户余额
async function getUsrBalance(address) {
  try {
    const result = await contract.methods.getUsrBalance(address).call();
    console.log("UsrBalance:", result);
    return result;
  } catch (error) {
    console.error("Error in getNumber:", error);
  }
}
//获取用户投注金额
async function getUsrStake(address) {
  try {
    const result = await contract.methods.getUsrBalance(address).call();
    console.log("UsrStake:", result);
    return result;
  } catch (error) {
    console.error("Error in getNumber:", error);
  }
}
//获取用户的猜的数
async function getUsrBetNumber(address) {
  try {
    const result = await contract.methods.getUsrBalance(address).call();
    console.log("UsrBetNumber:", result);
    return result;
  } catch (error) {
    console.error("Error in getNumber:", error);
  }
}
//
async function main() {
    // Approve contract to speand maney in the player's account
//    await getUsrBalance(myAddress)
    await Approve(myAddress,privateKey,contractAddress,100000)
//    await Approve(player2,player2privateKey,contractAddress,100000)
    await Register(myAddress,privateKey);
//    await Register(player2,player2privateKey);
    await balanceRefresh(myAddress,privateKey)
    
    await placeBet(myAddress,privateKey,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36], [100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100])

//     1399999997600
//    await placeBet(player2,player2privateKey,[1,2,3,4,5,6,7,8,9,10,11,12], [100,100,100,100,100,100,100,100,100,100,100,100])
// 1300000000000
//    await getUsrBalance(myAddress)
    
}
main()

