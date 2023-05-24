/*
  Try `truffle exec scripts/increment.js`, you should `truffle migrate` first.

  Learn more about Truffle external scripts: 
  https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts
*/

const lottery = artifacts.require("lottery");

module.exports = async function (callback) {
  const deployed = await lottery.deployed();
  console.log(deployed)

  const minEntryPrice = (await deployed.minEntryPrice()).toNumber();
  console.log(`minEntryPrice Value: ${minEntryPrice}`);

  const lotterysize = (await deployed.lotterysize()).toNumber();
  console.log(`lotterysize value: ${lotterysize}`);

  await deployed.reveal(1);

  callback();
};
