// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BadgeContract is ERC721, Ownable {
    // Badge tiers
    enum BadgeTier { Unverified, Verified, Silver, Gold }
    
    // Spending thresholds for each tier (in USDC with 6 decimals)
    uint256 public constant VERIFIED_THRESHOLD = 100 * 10**6;   // $100
    uint256 public constant SILVER_THRESHOLD = 500 * 10**6;     // $500
    uint256 public constant GOLD_THRESHOLD = 1000 * 10**6;      // $1000
    
    // User data
    mapping(address => BadgeTier) public userBadges;
    mapping(address => uint256) public totalSpending;
    
    // Badge metadata URIs
    mapping(BadgeTier => string) public badgeURIs;
    
    // Token ID counter
    uint256 private _tokenIdCounter;
    
    // Events
    event SpendingUpdated(address indexed user, uint256 amount, uint256 totalSpending);
    event BadgeUpgraded(address indexed user, BadgeTier oldTier, BadgeTier newTier);
    
    constructor() ERC721("Spend2Earn Badge", "S2E") {
        // Set default badge URIs (these would be actual IPFS URIs in production)
        badgeURIs[BadgeTier.Unverified] = "ipfs://unverified-badge-uri";
        badgeURIs[BadgeTier.Verified] = "ipfs://verified-badge-uri";
        badgeURIs[BadgeTier.Silver] = "ipfs://silver-badge-uri";
        badgeURIs[BadgeTier.Gold] = "ipfs://gold-badge-uri";
    }
    
    function updateSpending(address user, uint256 amount) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than 0");
        
        totalSpending[user] += amount;
        emit SpendingUpdated(user, amount, totalSpending[user]);
        
        // Check for badge upgrade
        BadgeTier currentTier = userBadges[user];
        BadgeTier newTier = calculateBadgeTier(totalSpending[user]);
        
        if (newTier > currentTier) {
            upgradeBadge(user, newTier);
        }
    }
    
    function upgradeBadge(address user, BadgeTier newTier) internal {
        BadgeTier oldTier = userBadges[user];
        userBadges[user] = newTier;
        
        // Mint new badge NFT if user doesn't have one yet
        if (balanceOf(user) == 0) {
            _tokenIdCounter++;
            _mint(user, _tokenIdCounter);
        }
        
        emit BadgeUpgraded(user, oldTier, newTier);
    }
    
    function calculateBadgeTier(uint256 spending) public pure returns (BadgeTier) {
        if (spending >= GOLD_THRESHOLD) return BadgeTier.Gold;
        if (spending >= SILVER_THRESHOLD) return BadgeTier.Silver;
        if (spending >= VERIFIED_THRESHOLD) return BadgeTier.Verified;
        return BadgeTier.Unverified;
    }
    
    function getUserBadge(address user) external view returns (uint8) {
        return uint8(userBadges[user]);
    }
    
    function getTotalSpending(address user) external view returns (uint256) {
        return totalSpending[user];
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        address owner = ownerOf(tokenId);
        BadgeTier tier = userBadges[owner];
        return badgeURIs[tier];
    }
    
    function setBadgeURI(BadgeTier tier, string memory uri) external onlyOwner {
        badgeURIs[tier] = uri;
    }
    
    // Override transfer functions to make badges non-transferable
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0), "Badges are non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
