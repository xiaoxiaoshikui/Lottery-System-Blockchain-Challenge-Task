const Web3 = require("web3");
const ethers = require("ethers");

const provider = new Web3.providers.HttpProvider(`https://vm-216.s3it.uzh.ch`);
const web3 = new Web3(provider);


const BetcontractABI = require("./DaiAbi.json");
const BetcontractAddress = "0x89780B11beD320FaD0Fb7bC4BE9fd8066229060B";
const Betcontract = new web3.eth.Contract(BetcontractABI, BetcontractAddress);

const contractABI = require("./contractabi.json");
const contractAddress = "0xcEe30A2C8c66A7fbF00004609A6d743465921A93";
const contract = new web3.eth.Contract(contractABI, contractAddress);



//----------------------------------------------
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

//This is the back end of the customer.
// async function Mint(myAddress,privatekey,mint_amount) {
//     const functionName = "mint";
//     const functionArgs = [myAddress,mint_amount];
//     const functionABI = Betcontract.methods[functionName](...functionArgs).encodeABI();
//     const nonce = await web3.eth.getTransactionCount(myAddress);
//     const tx = {
//         from: myAddress,
//         to: BetcontractAddress,
//         data: functionABI,
//         gas: 1000000,
//         nonce: nonce,
//     };
//     const signedTransaction = await web3.eth.accounts.signTransaction(tx, privatekey);
//     const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
//
//     console.log("Mint Transaction result:", result);
// }

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

async function pickWinner(myAddress,privateKey) {
    const functionName = "pickWinner";
    const functionArgs = [];
    const functionABI = contract.methods[functionName](...functionArgs).encodeABI();
    const nonce = await web3.eth.getTransactionCount(myAddress);
    const tx = {
        from: myAddress,
        to: contractAddress,
        data: functionABI,
        gas: 1000000,
        nonce: nonce,
    };
    const signedTransaction = await web3.eth.accounts.signTransaction(tx, privateKey);
    const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    console.log("pickWinner Transaction result:", result);
}

async function getWinnerIndex() {
    try {
        const result = await contract.methods.getWinnerIndex().call();
        console.log("WinnerIndex:", result);
        return result;
    } catch (error) {
        console.error("Error in getNumber:", error);
    }
}
async function getUsrBalance(address) {
    try {
        const result = await contract.methods.getUsrBalance(address).call();
        console.log("UsrBalance:", result);
        return result;
    } catch (error) {
        console.error("Error in getNumber:", error);
    }
}
async function getUsrStake(address) {
    try {
        const result = await contract.methods.getUsrBalance(address).call();
        console.log("UsrStake:", result);
        return result;
    } catch (error) {
        console.error("Error in getNumber:", error);
    }
}
async function getUsrBetNumber(address) {
    try {
        const result = await contract.methods.getUsrBalance(address).call();
        console.log("UsrBetNumber:", result);
        return result;
    } catch (error) {
        console.error("Error in getNumber:", error);
    }
}

async function Balanceof(address) {
    //新的用户（新公钥私钥）进来需要先调用一个这个
    const result = await Betcontract.methods.balanceOf(address).call();
    console.log("UsrBetNumber:", result);
    return result;
    console.log("balanceof Transaction result:", result);
}
//----------------------------------------------
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.post('/login', async (req, res) => {
    try {
    const myAddress = req.query.username;
    const privateKey = req.query.password;
    try{
    await Register(myAddress,privateKey);}catch (e){
        console.log(e)

    }

    const bell2 =await balanceRefresh(myAddress,privateKey)
    const bell3 =    await getUsrBalance(myAddress)
    const bell4 =await Approve(myAddress,privateKey,contractAddress,100000)
    console.log("Transaction result:", bell3);
    const token = {address: myAddress,privatekey:privateKey,money:bell3};
    res.json(token);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.post('/regist', async (req, res) => {
    try {
        const myAddress = req.query.username;
        const privateKey = req.query.password;
        //--------------
        try{
            await Register(myAddress,privateKey);}catch (e){
            console.log(e)
        }
        const bell2 =await balanceRefresh(myAddress,privateKey)
        const bell3 =    await getUsrBalance(myAddress)
        const bell4 =await Approve(myAddress,privateKey,contractAddress,100000)
        console.log("Transaction result:", bell3);
//--------------
        const token = {address: myAddress,privatekey:privateKey,money:bell3};
        res.json(token);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
//This is the back end of the customer.
app.post('/addmoney', async (req, res) => {
    try {
    const balance = req.query.balance;
    const walletAddress = req.query.walletAddress;
    const privatekey = req.query.privatekey;
    // await Mint(walletAddress,privatekey,500)
    await Register(walletAddress,privatekey);
    const bell2 =await balanceRefresh(walletAddress,privatekey)
    const bell3 =    await getUsrBalance(walletAddress)
    const token = {address: walletAddress, privatekey: privatekey, money: bell3};
    res.json(token);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.post('/bet', async (req, res) => {
    try {

    let betMap1 = req.query.value;
    let betMap = betMap1.split(",").map(numString => parseInt(numString));
    let playerAmount3 = req.query.playerAmount;
    let playerAmount = playerAmount3.split(",").map(numString => parseInt(numString));
    let myAddress = req.query.myAddress;
    let privateKey = req.query.privateKey;
    console.log(betMap)
    await Approve(myAddress,privateKey,contractAddress,100000)
    console.log(playerAmount)
    try{
        await Register(myAddress,privateKey);
    } catch (error) {
    console.error('Error:', error);
        // res.status(500).json({ error: 'An error occurred' });
    }
    // await balanceRefresh(myAddress,privateKey)
    console.log(playerAmount)
    await placeBet(myAddress,privateKey,betMap, playerAmount)
    console.log(betMap+playerAmount)
    const playerAmount1 =await Balanceof(myAddress)

    // const playerAmount1 =    await getUsrBalance(myAddress)
    // console.log(playerAmount1)
    let difference = playerAmount1 - playerAmount;
    const number =await getWinnerIndex()
    let winMessages = [];
    winMessages.push(`You now money: ${playerAmount1}`);
    //----------------------------
    const token = {playerAmount: playerAmount1, lastSpin: number, lastResult: difference, lastWinMessages: winMessages};
    res.json(token);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


// 启动服务器
app.listen(8000, () => {
    console.log('Node.js server running on port 8000');
});

