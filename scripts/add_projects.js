const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
  const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
  const contractAddress = process.env.CONTRACT_ADDRESS;

  const abi = ["function addProject(string _ipfsHash) public"];
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  // Liste de vos 15 hashes IPFS correspondants à vos fichiers projet1 à projet15
  // Note : Vous devez avoir ces hashes après avoir "uploadé" vos fichiers sur IPFS
  const IPFS_HASHES = [
    "QmHashProjet1...", // Remplacez par le vrai hash de projet1.json
    "QmHashProjet2...",
    // ... continuez jusqu'à 15
  ];

  console.log("🚀 Début de l'enregistrement des projets sur Ganache...");

  for (let i = 0; i < IPFS_HASHES.length; i++) {
    try {
      // On récupère le nonce à chaque fois pour éviter l'erreur de synchronisation
      const currentNonce = await provider.getTransactionCount(wallet.address, "pending");
      
      console.log(`Ajout du projet ${i + 1}/15...`);
      const tx = await contract.addProject(IPFS_HASHES[i], { nonce: currentNonce });
      
      await tx.wait();
      console.log(`✅ Projet ${i + 1} validé !`);
    } catch (error) {
      console.error(`❌ Erreur sur le projet ${i + 1}:`, error.message);
      break; 
    }
  }

  console.log("✨ Terminé ! Vérifiez l'onglet CONTRACTS sur Ganache.");
}

main().catch(console.error);