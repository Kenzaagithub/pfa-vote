// contracts/Voting.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    uint private constant MAX_PROJECTS = 15; 

    event ProjectAdded(uint indexed id, string name, string ipfsHash, address indexed addedBy);
    event Voted(address indexed voter, uint projectId);

    address public admin;

    struct Project {
        uint id;
        string name;     // Nouveau : Stockage du titre en clair
        string ipfsHash; 
        uint voteCount;
    }

    mapping(uint => Project) public projects;
    mapping(address => bool) public hasVoted; 
    uint public projectCounter;

    uint public startTime;
    uint public endTime;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this.");
        _;
    }

    constructor(uint _startTime, uint _endTime) {
        admin = msg.sender;
        startTime = _startTime;
        endTime = _endTime;
    }

    // Fonction mise à jour avec deux paramètres
    function addProject(string memory _name, string memory _ipfsHash) public onlyAdmin {
        require(projectCounter < MAX_PROJECTS, "Project limit reached (Max 15).");

        projectCounter++;
        projects[projectCounter] = Project(projectCounter, _name, _ipfsHash, 0);
        
        emit ProjectAdded(projectCounter, _name, _ipfsHash, msg.sender);
    }
    
    function vote(uint _projectId) public {
        require(!hasVoted[msg.sender], "Already voted.");
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Voting is not open.");
        require(_projectId > 0 && _projectId <= projectCounter, "Invalid project ID.");

        projects[_projectId].voteCount++;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, _projectId);
    }

    // Fonctions de lecture
    function getProject(uint _id) public view returns (uint id, string memory name, string memory ipfsHash, uint voteCount) {
        require(_id > 0 && _id <= projectCounter, "Project does not exist.");
        Project storage p = projects[_id];
        return (p.id, p.name, p.ipfsHash, p.voteCount);
    }
}