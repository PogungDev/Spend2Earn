// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VaultContract is ReentrancyGuard, Ownable {
    IERC20 public immutable USDC;
    
    // User balances in the vault
    mapping(address => uint256) public userBalances;
    
    // Protocol allocations per user (protocol address => percentage)
    mapping(address => mapping(address => uint256)) public protocolAllocations;
    
    // Supported DeFi protocols
    mapping(address => bool) public supportedProtocols;
    
    // Total yield generated per user
    mapping(address => uint256) public userYield;
    
    // Events
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event ProtocolAllocation(address indexed user, address indexed protocol, uint256 percentage);
    event YieldGenerated(address indexed user, uint256 amount);
    
    constructor(address _usdc) {
        USDC = IERC20(_usdc);
    }
    
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(USDC.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        userBalances[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }
    
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        
        userBalances[msg.sender] -= amount;
        require(USDC.transfer(msg.sender, amount), "Transfer failed");
        
        emit Withdraw(msg.sender, amount);
    }
    
    function allocateToProtocol(address protocol, uint256 percentage) external {
        require(supportedProtocols[protocol], "Protocol not supported");
        require(percentage <= 100, "Percentage cannot exceed 100");
        
        protocolAllocations[msg.sender][protocol] = percentage;
        emit ProtocolAllocation(msg.sender, protocol, percentage);
    }
    
    function getUserBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }
    
    function getYield(address user) external view returns (uint256) {
        return userYield[user];
    }
    
    // Simulate yield generation (in production, this would interact with actual DeFi protocols)
    function generateYield(address user, uint256 amount) external onlyOwner {
        userYield[user] += amount;
        userBalances[user] += amount;
        emit YieldGenerated(user, amount);
    }
    
    function addSupportedProtocol(address protocol) external onlyOwner {
        supportedProtocols[protocol] = true;
    }
    
    function removeSupportedProtocol(address protocol) external onlyOwner {
        supportedProtocols[protocol] = false;
    }
}
