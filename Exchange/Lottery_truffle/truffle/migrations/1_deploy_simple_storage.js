const lottery = artifacts.require("Lottery");

module.exports = function (deployer) {
  // minentryPrice 400 ~ 1 CHF; 1 Player
  deployer.deploy(lottery,400,2);
};
