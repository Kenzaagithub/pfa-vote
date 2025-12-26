const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const contractAddress = "0x1aAa4b460AA6077F6644a4f009cBa0f85B8e12dB"; 

    const abi = [
        "function projectCounter() public view returns (uint256)",
        "function projects(uint256) public view returns (uint256 id, string memory name, string memory ipfsHash, uint256 voteCount)"
    ];

    const contract = new ethers.Contract(contractAddress, abi, provider);
    const count = await contract.projectCounter();

    console.log(`--- Vérification de la Blockchain ---`);
    console.log(`Nombre total de projets : ${count.toString()}\n`);

    for (let i = 1; i <= count; i++) {
        const p = await contract.projects(i);
        console.log(`ID ${p.id}: ${p.name}`);
        console.log(`   🔗 IPFS: ${p.ipfsHash}`);
        console.log(`   🗳️ Votes: ${p.voteCount.toString()}`);
        console.log('-----------------------------------');
    }
}

main().catch(console.error);