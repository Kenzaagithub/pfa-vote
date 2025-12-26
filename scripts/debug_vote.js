const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  // On récupère l'ABI simplifiée depuis ce que vous avez envoyé
  const abi = [
    "function startTime() view returns (uint256)",
    "function endTime() view returns (uint256)",
    "function projectCounter() view returns (uint256)",
    "function hasVoted(address) view returns (bool)",
    "function admin() view returns (address)"
  ];

  const contract = new ethers.Contract(contractAddress, abi, provider);

  const now = Math.floor(Date.now() / 1000);
  const start = await contract.startTime();
  const end = await contract.endTime();
  const count = await contract.projectCounter();
  const admin = await contract.admin();
  const alreadyVoted = await contract.hasVoted("0xB07068EDd6F47173146b45DDf1989ACD69E12527");

  console.log("--- 🕵️ DIAGNOSTIC DU CONTRAT ---");
  console.log(`📍 Adresse Contrat: ${contractAddress}`);
  console.log(`👑 Admin: ${admin}`);
  console.log(`📦 Projets enregistrés: ${count.toString()}`);
  console.log(`🕒 Heure Blockchain approx: ${now}`);
  console.log(`🎬 Début vote: ${start.toString()}`);
  console.log(`🏁 Fin vote: ${end.toString()}`);
  console.log(`🗳️ L'utilisateur a déjà voté ? ${alreadyVoted}`);
  console.log("-------------------------------");

  if (now < start) console.log("❌ ERREUR : Le vote n'a pas encore commencé.");
  else if (now > end) console.log("❌ ERREUR : Le vote est déjà terminé.");
  else if (count == 0) console.log("❌ ERREUR : Aucun projet n'est enregistré.");
  else if (alreadyVoted) console.log("❌ ERREUR : Vous avez déjà voté.");
  else console.log("✅ Tout semble correct. Le problème vient peut-être du Gas Limit.");
}

main().catch(console.error);