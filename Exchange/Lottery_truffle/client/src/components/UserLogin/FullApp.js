import React, { useState } from "react";
import { SimpleStorage } from "/home/akshay/Desktop/uni_ZH/FS23/Blockchain/Lottery-App-BON/Lottery_truffle/client/src/abi/abi";
import Web3 from "web3";
import '/home/akshay/Desktop/uni_ZH/FS23/Blockchain/Lottery-App-BON/Lottery_truffle/client/src/App.css';

// Access our wallet inside of our dapp
const web3 = new Web3(Web3.givenProvider);
// Contract address of the deployed smart contract
const contractAddress = "0x38ce5acA23D1502465c71340eABee1C1928B41D5";
const storageContract = new web3.eth.Contract(SimpleStorage, contractAddress);

function FullApp() {
  // Hold variables that will interact with our contract and frontend
  const [number, setUint] = useState(0);
  const [getNumber, setGet] = useState("0");
  
  const numberSet = async (t) => {
    t.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    // Get permission to access user funds to pay for gas fees
    const gas = await storageContract.methods.set(number).estimateGas();
    const post = await storageContract.methods.set(number).send({
      from: account,
      gas,
    });
  };

  const numberGet = async (t) => {
    t.preventDefault();
    const post = await storageContract.methods.get().call();
    setGet(post);
  };
  
  return (
     <div className="main">
       <div className="card">
         <form className="form" onSubmit={numberSet}>
           <label>
             Set your uint256:
             <input
               className="input"
               type="text"
               name="name"
               onChange={(t) => setUint(t.target.value)}
             />
           </label>
           <button className="button" type="submit" value="Confirm">
             Confirm
           </button>
         </form>
         <br />
         <button className="button" onClick={numberGet} type="button">
           Get your uint256
         </button>
         {getNumber}
       </div>
     </div>
  );
}

export default FullApp;