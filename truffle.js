module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      network_id: 4,
      host: 'rinkeby.infura.io',
      port: 80,
      gas: 4000000
    }
  }
};
