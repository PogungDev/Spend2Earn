// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IVaultContract {
    function getUserBalance(address user) external view returns (uint256);
}

contract CreditContract is ReentrancyGuard, Ownable {
    IERC20 public immutable USDC;
    IVaultContract public immutable vaultContract;
    
    // Credit limits based on badge tier
    mapping(uint8 => uint256) public badgeCreditMultipliers; // badge tier => multiplier (in basis points)
    
    // User borrowed amounts
    mapping(address => uint256) public borrowedAmounts;
    
    // Interest rates per badge tier (in basis points, e.g., 250 = 2.5%)
    mapping(uint8 => uint256) public interestRates;
    
    // Badge contract interface
    interface IBadgeContract {
        function getUserBadge(address user) external view returns (uint8);
    }
    
    IBadgeContract public badgeContract;
    
    // Events
    event Borrow(address indexed user, uint256 amount);
    event Repay(address indexed user, uint256 amount);
    event CreditLimitUpdated(uint8 badgeTier, uint256 multiplier);
    
    constructor(address _usdc, address _vaultContract) {
        USDC = IERC20(_usdc);
        vaultContract = IVaultContract(_vaultContract);
        
        // Initialize default credit multipliers
        badgeCreditMultipliers[1] = 3000; // Verified: 30%
        badgeCreditMultipliers[2] = 5000; // Silver: 50%
        badgeCreditMultipliers[3] = 7000; // Gold: 70%
        
        // Initialize interest rates
        interestRates[1] = 320; // Verified: 3.2%
        interestRates[2] = 270; // Silver: 2.7%
        interestRates[3] = 250; // Gold: 2.5%
    }
    
    function setBadgeContract(address _badgeContract) external onlyOwner {
        badgeContract = IBadgeContract(_badgeContract);
    }
    
    function borrow(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 creditLimit = getCreditLimit(msg.sender);
        require(creditLimit > 0, "No credit limit available");
        require(borrowedAmounts[msg.sender] + amount <= creditLimit, "Exceeds credit limit");
        
        borrowedAmounts[msg.sender] += amount;
        require(USDC.transfer(msg.sender, amount), "Transfer failed");
        
        emit Borrow(msg.sender, amount);
    }
    
    function repay(uint256 amount) external payable nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(borrowedAmounts[msg.sender] >= amount, "Repay amount exceeds borrowed amount");
        require(USDC.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        borrowedAmounts[msg.sender] -= amount;
        emit Repay(msg.sender, amount);
    }
    
    function getCreditLimit(address user) public view returns (uint256) {
        if (address(badgeContract) == address(0)) return 0;
        
        uint8 badgeTier = badgeContract.getUserBadge(user);
        if (badgeTier == 0) return 0; // Unverified
        
        uint256 vaultBalance = vaultContract.getUserBalance(user);
        if (vaultBalance < 100 * 10**6) return 0; // Minimum $100 USDC (6 decimals)
        
        uint256 multiplier = badgeCreditMultipliers[badgeTier];
        return (vaultBalance * multiplier) / 10000;
    }
    
    function getBorrowedAmount(address user) external view returns (uint256) {
        return borrowedAmounts[user];
    }
    
    function getInterestRate(address user) external view returns (uint256) {
        if (address(badgeContract) == address(0)) return 0;
        
        uint8 badgeTier = badgeContract.getUserBadge(user);
        return interestRates[badgeTier];
    }
    
    function updateCreditMultiplier(uint8 badgeTier, uint256 multiplier) external onlyOwner {
        require(multiplier <= 10000, "Multiplier cannot exceed 100%");
        badgeCreditMultipliers[badgeTier] = multiplier;
        emit CreditLimitUpdated(badgeTier, multiplier);
    }
    
    function updateInterestRate(uint8 badgeTier, uint256 rate) external onlyOwner {
        require(rate <= 10000, "Rate cannot exceed 100%");
        interestRates[badgeTier] = rate;
    }
}
