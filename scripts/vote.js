const { ethers } = require("ethers");
require("dotenv").config();
const fs = require("fs");

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const wallet = new ethers.Wallet(process.env.USER_PRIVATE_KEY, provider);

    // CORRECTION DU CHEMIN : 
    // On va chercher dans build/contracts/Voting.json (attention à la majuscule)
    const contractPath = "./build/contracts/Voting.json";
    const contractData = JSON.parse(fs.readFileSync(contractPath, "utf8"));
    
    const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS, 
        contractData.abi, 
        wallet
    );

    try {
        console.log("🗳️ Tentative de vote pour le projet ID 0...");
        
        // On garde le gasLimit manuel pour être sûr
        const tx = await contract.vote(1, { gasLimit: 300000 });
        
        console.log(`⏳ Transaction envoyée : ${tx.hash}`);
        const receipt = await tx.wait();
        
        console.log("✅ SUCCÈS ! Vote enregistré dans le bloc :", receipt.blockNumber);
    } catch (error) {
        console.error("❌ Erreur lors du vote :");
        console.error(error.reason || error.message);
    }
}

main().catch(console.error);