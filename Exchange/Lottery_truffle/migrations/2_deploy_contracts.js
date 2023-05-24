const Lottery = artifacts.require('./web-app/src/contracts/lottery.sol')

module.exports = function (deployer) {
  deployer.deploy(Lottery)
}
