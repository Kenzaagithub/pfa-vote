const { ethers } = require("ethers");
require("dotenv").config();
const fs = require("fs");

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const contractData = JSON.parse(fs.readFileSync("./build/contracts/Voting.json", "utf8"));
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractData.abi, provider);

    try {
        const count = await contract.projectsCount(); // Vérifiez si votre variable s'appelle projectsCount ou projectCounter
        console.log(`📊 Nombre de projets selon le contrat : ${count}`);
        
        for (let i = 0; i < count; i++) {
            const p = await contract.projects(i);
            console.log(`ID ${i} : ${p.name} (${p.voteCount} voix)`);
        }
    } catch (e) {
        console.log("❌ Impossible de lire les projets. Le compteur est peut-être à 0 ou le nom de la variable diffère.");
    }
}
main().catch(console.error);