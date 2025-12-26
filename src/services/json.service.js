const fs = require('fs').promises;
const path = require('path');

const usersFilePath = path.join(__dirname, '..', '..', 'data', 'users.json');
const logsFilePath = path.join(__dirname, '..', '..', 'data', 'login_logs.json');
const dataDirPath = path.join(__dirname, '..', '..', 'data');

async function readUsers() {
    try {
        const data = await fs.readFile(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (e) { return []; }
}

async function readProjects() {
    const files = await fs.readdir(dataDirPath);
    const projectFiles = files.filter(f => f.startsWith('projet') && f.endsWith('.json'));
    const allProjects = [];
    for (const file of projectFiles) {
        const content = await fs.readFile(path.join(dataDirPath, file), 'utf8');
        const data = JSON.parse(content);
        const id = file.replace(/[^0-9]/g, '');
        const image = data.visuals && data.visuals.coverImage ? data.visuals.coverImage : `http://localhost:3000/images/p${id}.png`;
        allProjects.push({
            id: parseInt(id),
            name: data.title,
            description: data.description,
            category: data.category,
            author: data.author,
            tools: data.tools,
            image: image
        });
    }
    return allProjects.sort((a, b) => a.id - b.id);
}

async function saveNewProject(data) {
    const files = await fs.readdir(dataDirPath);
    const nextId = files.filter(f => f.startsWith('projet')).length + 1;
    const project = {
        title: data.title,
        description: data.description,
        category: data.category,
        author: data.author,
        tools: data.tools,
        visuals: { coverImage: data.image || `http://localhost:3000/images/p${nextId}.png` }
    };
    await fs.writeFile(path.join(dataDirPath, `projet${nextId}.json`), JSON.stringify(project, null, 2));
    return { id: nextId, ...project };
}

async function updateProject(id, data) {
    const filePath = path.join(dataDirPath, `projet${id}.json`);
    const content = await fs.readFile(filePath, 'utf8');
    const project = JSON.parse(content);

    // Update fields
    if (data.title) project.title = data.title;
    if (data.description) project.description = data.description;
    if (data.category) project.category = data.category;

    await fs.writeFile(filePath, JSON.stringify(project, null, 2));
    return { id, ...project };
}

async function deleteProject(id) {
    const filePath = path.join(dataDirPath, `projet${id}.json`);
    await fs.unlink(filePath);
    return { message: 'Project deleted' };
}

async function logLogin(user, method) {
    try {
        let logs = [];
        try {
            const data = await fs.readFile(logsFilePath, 'utf8');
            logs = JSON.parse(data);
        } catch (e) { logs = []; }

        logs.unshift({
            userId: user.id,
            email: user.email,
            role: user.role,
            method: method,
            timestamp: new Date().toISOString()
        });

        // Keep last 100 logs
        if (logs.length > 100) logs = logs.slice(0, 100);

        await fs.writeFile(logsFilePath, JSON.stringify(logs, null, 2));
    } catch (e) { console.error("Error logging login:", e); }
}

async function readLoginLogs() {
    try {
        const data = await fs.readFile(logsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (e) { return []; }
}

module.exports = { readUsers, readProjects, saveNewProject, updateProject, deleteProject, logLogin, readLoginLogs };