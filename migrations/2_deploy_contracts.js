var GasStation = artifacts.require("./GasStation.sol");

module.exports = function(deployer) {
  deployer.deploy(GasStation); 
};
