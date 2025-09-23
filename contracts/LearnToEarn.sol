// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SonicUniversityToken is ERC20, Ownable {
    constructor() ERC20("Sonic University Token", "SUT") Ownable(msg.sender) {
        // Mint initial supply to the contract owner (university)
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract LearnToEarn is ReentrancyGuard, Ownable {
    SonicUniversityToken public rewardToken;
    
    // Mapping to track completed modules for each student
    mapping(address => mapping(uint256 => bool)) public completedModules;
    
    // Mapping to track claimed rewards for each student per module
    mapping(address => mapping(uint256 => bool)) public claimedRewards;
    
    // Mapping to store reward amounts for each module
    mapping(uint256 => uint256) public moduleRewards;
    
    // Events
    event ModuleCompleted(address indexed student, uint256 indexed moduleId);
    event RewardClaimed(address indexed student, uint256 indexed moduleId, uint256 amount);
    event ModuleRewardSet(uint256 indexed moduleId, uint256 rewardAmount);
    
    constructor(address _rewardToken) Ownable(msg.sender) {
        rewardToken = SonicUniversityToken(_rewardToken);
    }
    
    // Admin function to mark a student as having completed a module
    function markModuleCompleted(address student, uint256 moduleId) external onlyOwner {
        require(!completedModules[student][moduleId], "Module already completed");
        
        completedModules[student][moduleId] = true;
        emit ModuleCompleted(student, moduleId);
    }
    
    // Admin function to set reward amount for a module
    function setModuleReward(uint256 moduleId, uint256 rewardAmount) external onlyOwner {
        moduleRewards[moduleId] = rewardAmount;
        emit ModuleRewardSet(moduleId, rewardAmount);
    }
    
    // Student function to claim reward for completed module
    function claimReward(uint256 moduleId) external nonReentrant {
        require(completedModules[msg.sender][moduleId], "Module not completed");
        require(!claimedRewards[msg.sender][moduleId], "Reward already claimed");
        require(moduleRewards[moduleId] > 0, "No reward set for this module");
        
        uint256 rewardAmount = moduleRewards[moduleId];
        require(rewardToken.balanceOf(address(this)) >= rewardAmount, "Insufficient reward tokens");
        
        claimedRewards[msg.sender][moduleId] = true;
        rewardToken.transfer(msg.sender, rewardAmount);
        
        emit RewardClaimed(msg.sender, moduleId, rewardAmount);
    }
    
    // View function to check if student can claim reward
    function canClaimReward(address student, uint256 moduleId) external view returns (bool) {
        return completedModules[student][moduleId] && 
               !claimedRewards[student][moduleId] && 
               moduleRewards[moduleId] > 0;
    }
    
    // View function to get available modules for a student
    function getCompletedModules(address student, uint256[] calldata moduleIds) 
        external view returns (bool[] memory completed, bool[] memory claimed) {
        completed = new bool[](moduleIds.length);
        claimed = new bool[](moduleIds.length);
        
        for (uint256 i = 0; i < moduleIds.length; i++) {
            completed[i] = completedModules[student][moduleIds[i]];
            claimed[i] = claimedRewards[student][moduleIds[i]];
        }
    }
    
    // Admin function to fund the contract with reward tokens
    function fundContract(uint256 amount) external onlyOwner {
        rewardToken.transferFrom(msg.sender, address(this), amount);
    }
    
    // Admin function to withdraw unused tokens
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(rewardToken.balanceOf(address(this)) >= amount, "Insufficient balance");
        rewardToken.transfer(msg.sender, amount);
    }
    
    // Get contract token balance
    function getContractBalance() external view returns (uint256) {
        return rewardToken.balanceOf(address(this));
    }
}
