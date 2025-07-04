// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IBadgeContract {
    function updateSpending(address user, uint256 amount) external;
}

interface IVaultContract {
    function deposit(uint256 amount) external payable;
}

contract SpendingContract is ReentrancyGuard, Ownable {
    IERC20 public immutable USDC;
    IBadgeContract public badgeContract;
    IVaultContract public vaultContract;
    
    // Cashback rate (in basis points, e.g., 250 = 2.5%)
    uint256 public cashbackRate = 250;
    
    // User cashback balances
    mapping(address => uint256) public cashbackBalances;
    
    // Auto-stake settings per user
    mapping(address => bool) public autoStakeEnabled;
    mapping(address => uint256) public stakeThreshold; // Minimum amount to trigger auto-stake
    
    // Events
    event SpendingRecorded(address indexed user, uint256 amount, uint256 cashback);
    event CashbackClaimed(address indexed user, uint256 amount);
    event AutoStakeTriggered(address indexed user, uint256 amount);
    
    constructor(address _usdc) {
        USDC = IERC20(_usdc);
    }
    
    function setBadgeContract(address _badgeContract) external onlyOwner {
        badgeContract = IBadgeContract(_badgeContract);
    }
    
    function setVaultContract(address _vaultContract) external onlyOwner {
        vaultContract = IVaultContract(_vaultContract);
    }
    
    function recordSpending(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        // Calculate cashback
        uint256 cashback = (amount * cashbackRate) / 10000;
        cashbackBalances[msg.sender] += cashback;
        
        // Update badge contract
        if (address(badgeContract) != address(0)) {
            badgeContract.updateSpending(msg.sender, amount);
        }
        
        emit SpendingRecorded(msg.sender, amount, cashback);
        
        // Check for auto-stake
        if (autoStakeEnabled[msg.sender] && cashback >= stakeThreshold[msg.sender]) {
            _autoStake(msg.sender, cashback);
        }
    }
    
    function claimCashback() external nonReentrant {
        uint256 amount = cashbackBalances[msg.sender];
        require(amount > 0, "No cashback to claim");
        
        cashbackBalances[msg.sender] = 0;
        require(USDC.transfer(msg.sender, amount), "Transfer failed");
        
        emit CashbackClaimed(msg.sender, amount);
    }
    
    function enableAutoStake(uint256 threshold) external {
        autoStakeEnabled[msg.sender] = true;
        stakeThreshold[msg.sender] = threshold;
    }
    
    function disableAutoStake() external {
        autoStakeEnabled[msg.sender] = false;
    }
    
    function _autoStake(address user, uint256 amount) internal {
        require(address(vaultContract) != address(0), "Vault contract not set");
        
        cashbackBalances[user] -= amount;
        
        // Approve and deposit to vault
        USDC.approve(address(vaultContract), amount);
        vaultContract.deposit(amount);
        
        emit AutoStakeTriggered(user, amount);
    }
    
    function getCashbackBalance(address user) external view returns (uint256) {
        return cashbackBalances[user];
    }
    
    function updateCashbackRate(uint256 newRate) external onlyOwner {
        require(newRate <= 1000, "Rate cannot exceed 10%");
        cashbackRate = newRate;
    }
}
