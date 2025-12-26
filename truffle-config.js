// truffle-config.js

module.exports = {
  // ... autres configurations ...

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,            // Port de Ganache (vérifié)
      network_id: "*",
    },
    // ...
  },

  compilers: {
    solc: {
      version: "0.8.0", // Version du contrat
      settings: {
        optimizer: {
          enabled: true, // L'optimiseur doit être activé
          runs: 200
        }
      }
    }
  }
};