require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jsonService = require('./src/services/json.service');
const { verifyToken, isAdmin } = require('./src/middleware/auth.middleware');

// --- IMPORTATION DE L'ABI DU CONTRAT ---
// Vérifiez que le chemin vers Voting.json est correct (ex: ./src/contracts/Voting.json)
const VotingJSON = require('./build/contracts/Voting.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// --- ROUTE : CONFIGURATION DU CONTRAT (Indispensable pour useVoting.js) ---
app.get('/config', (req, res) => {
    try {
        res.json({
            contractAddress: process.env.CONTRACT_ADDRESS, // Doit être dans votre .env
            contractABI: VotingJSON.abi
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la config.' });
    }
});

// --- ROUTE : CONNEXION CLASSIQUE (Email/Password) ---
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await jsonService.readUsers();
        const user = users.find(u => u.email === email && u.password === password); // Simplifié (utilisez bcrypt en prod)

        if (!user) return res.status(401).json({ message: "Identifiants incorrects." });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: '1h' }
        );

        await jsonService.logLogin(user, 'email');
        res.json({ token, role: user.role, user });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Route : Connexion via MetaMask
app.post('/login-web3', async (req, res) => {
    const { ethAddress } = req.body;
    try {
        const users = await jsonService.readUsers();
        const user = users.find(u => u.adresse_ethereum.toLowerCase() === ethAddress.toLowerCase());

        if (!user) return res.status(401).json({ message: "Adresse non reconnue." });

        const token = jwt.sign(
            { id: user.id, ethAddress: user.adresse_ethereum, role: user.role },
            process.env.JWT_SECRET, { expiresIn: '1h' }
        );

        await jsonService.logLogin(user, 'web3');
        res.json({ token, role: user.role, ethAddress: user.adresse_ethereum });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Route : Récupérer les projets
app.get('/projects', async (req, res) => {
    try {
        const projects = await jsonService.readProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lecture projets.' });
    }
});

// Route : Ajouter un projet (Admin)
app.post('/projects', [verifyToken, isAdmin], async (req, res) => {
    try {
        const newProject = await jsonService.saveNewProject(req.body);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: 'Erreur création projet.' });
    }
});

// Route : Mise à jour projet (Admin)
app.put('/projects/:id', [verifyToken, isAdmin], async (req, res) => {
    try {
        const updatedProject = await jsonService.updateProject(req.params.id, req.body);
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Erreur maj projet.' });
    }
});

// Route : Supprimer projet (Admin)
app.delete('/projects/:id', [verifyToken, isAdmin], async (req, res) => {
    try {
        await jsonService.deleteProject(req.params.id);
        res.json({ message: "Projet supprimé." });
    } catch (error) {
        res.status(500).json({ message: 'Erreur suppression projet.' });
    }
});

// Route : Logs de connexion (Admin)
app.get('/admin/logs/logins', [verifyToken, isAdmin], async (req, res) => {
    try {
        const logs = await jsonService.readLoginLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lecture logs.' });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server on http://0.0.0.0:${PORT}`));