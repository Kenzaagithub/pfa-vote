const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
    const contractAddress = "0x1aAa4b460AA6077F6644a4f009cBa0f85B8e12dB"; 

    const abi = [
        "function addProject(string memory _name, string memory _ipfsHash) public",
        "function admin() public view returns (address)",
        "function projectCounter() public view returns (uint256)"
    ];

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const PROJECTS = [
        { name: "PredictiveBankAI", hash: "QmBankRiskModelVisualization" },
        { name: "AlphaStream Trading", hash: "QmAlphaStreamArchitecture" },
        { name: "ExoticVaR MonteCarlo", hash: "QmMonteCarloPaths" },
        { name: "CVaROptimizer", hash: "QmOptimizationFrontierChart" },
        { name: "FinSenseAI Sentiment", hash: "QmSentimentWordCloud" },
        { name: "LendFlow DeFi", hash: "QmLendFlowInterfaceMockup" },
        { name: "DeepGuard IDS AI", hash: "QmDeepGuardRNNVisualization" },
        { name: "RecSys-Fusion Hybrid", hash: "QmRecSysDiagram" },
        { name: "DataLedger VCS", hash: "QmDAGStructure" },
        { name: "CloudOps Kubernetes", hash: "QmK8sArchitectureDiagram" },
        { name: "EcoRenov BIM", hash: "QmBIMEnergySimulation" },
        { name: "SeismicResilience FEM", hash: "QmFEMDeformationPlot" },
        { name: "SmartBridge IoT-SHM", hash: "QmBridgeSensorNetwork" },
        { name: "SiteFlow Logistics Sim", hash: "QmChantierSimulationOutput" },
        { name: "DroneScan Civil AI", hash: "QmDefectDetectionMap" }
    ];

    console.log("🚀 Reprise du peuplement...");

    // On récupère le compteur actuel pour savoir où reprendre
    let startCount = await contract.projectCounter();
    console.log(`Le contrat contient déjà ${startCount} projets. Reprise à partir du projet ${Number(startCount) + 1}.`);

    for (let i = Number(startCount); i < PROJECTS.length; i++) {
        try {
            // FIX : On récupère le nonce "latest" à chaque itération pour éviter le décalage
            const currentNonce = await provider.getTransactionCount(wallet.address, "latest");
            
            console.log(`⏳ [${i + 1}/15] Ajout de : ${PROJECTS[i].name} (Nonce: ${currentNonce})...`);
            
            const tx = await contract.addProject(PROJECTS[i].name, PROJECTS[i].hash, {
                nonce: currentNonce // On force le nonce correct
            });
            
            await tx.wait();
            console.log(`✅ Succès !`);

            // Optionnel : petite pause pour laisser Ganache respirer
            await new Promise(r => setTimeout(r, 500));

        } catch (error) {
            console.error(`❌ Erreur sur ${PROJECTS[i].name}: ${error.message}`);
            break; 
        }
    }

    console.log("\n✨ Processus terminé.");
}

main().catch(console.error);