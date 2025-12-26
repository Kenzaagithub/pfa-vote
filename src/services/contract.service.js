const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
require('dotenv').config();

function loadContract() {
  const rpc = process.env.BLOCKCHAIN_RPC_URL;
  const pk = process.env.ADMIN_PRIVATE_KEY;
  const address = process.env.CONTRACT_ADDRESS;

  if (!rpc) throw new Error('BLOCKCHAIN_RPC_URL not set in .env');
  if (!pk) console.warn('ADMIN_PRIVATE_KEY not set in .env — certain actions will fail until set');
  if (!address) console.warn('CONTRACT_ADDRESS not set in .env — set after migration');

  const buildPath = path.join(__dirname, '../../build/contracts/Voting.json');
  if (!fs.existsSync(buildPath)) {
    console.warn(`ABI not found at ${buildPath}. Compile/deploy the contract first.`);
    return { provider: null, wallet: null, contract: null };
  }

  const abi = JSON.parse(fs.readFileSync(buildPath)).abi;
  const provider = new ethers.JsonRpcProvider(rpc);  
  const wallet = pk ? new ethers.Wallet(pk, provider) : null;
  const contract = address && abi ? new ethers.Contract(address, abi, wallet || provider) : null;

  return { provider, wallet, contract };
}

module.exports = loadContract();