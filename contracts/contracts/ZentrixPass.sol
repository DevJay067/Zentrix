// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title ZentrixPass
/// @notice Soulbound tiered subscription NFT granting higher daily query credits for the Sarvam AI Agent.
contract ZentrixPass is ERC721, AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    struct PassData {
        uint8 tier;
        uint64 expiresAt;
        uint256 tokenId;
    }

    uint256 private _nextTokenId = 1;
    uint64 public constant PASS_DURATION = 30 days;

    mapping(address => PassData) public activePasses;
    mapping(uint8 => uint256) public tierPrices;

    event PassPurchased(address indexed buyer, uint256 indexed tokenId, uint8 tier, uint64 expiresAt);
    event PriceUpdated(uint8 indexed tier, uint256 newPrice);

    constructor() ERC721("Zentrix Pass", "ZXPASS") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

        // Mock testnet prices: Pro = 5 tMSTC, Enterprise = 15 tMSTC
        tierPrices[1] = 5 ether;
        tierPrices[2] = 15 ether;
    }

    /// @notice Buys a 30-day subscription pass for Tier 1 (Pro) or Tier 2 (Enterprise).
    function buy(uint8 tier) external payable whenNotPaused nonReentrant returns (uint256) {
        require(tier == 1 || tier == 2, "ZentrixPass: invalid tier");
        uint256 requiredPrice = tierPrices[tier];
        require(msg.value >= requiredPrice, "ZentrixPass: insufficient payment");

        // Refund any excess payment
        if (msg.value > requiredPrice) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - requiredPrice}("");
            require(refundSuccess, "ZentrixPass: excess refund failed");
        }

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        uint64 expiry = uint64(block.timestamp + PASS_DURATION);
        activePasses[msg.sender] = PassData({
            tier: tier,
            expiresAt: expiry,
            tokenId: tokenId
        });

        emit PassPurchased(msg.sender, tokenId, tier, expiry);
        return tokenId;
    }

    /// @notice Returns active tier (0 if none or expired, 1 for Pro, 2 for Enterprise).
    function tierOf(address account) external view returns (uint8) {
        PassData memory pass = activePasses[account];
        if (pass.expiresAt > block.timestamp) {
            return pass.tier;
        }
        return 0; // Free tier
    }

    function getPass(address account) external view returns (uint8 tier, uint64 expiresAt, uint256 tokenId) {
        PassData memory pass = activePasses[account];
        return (pass.tier, pass.expiresAt, pass.tokenId);
    }

    function setPrice(uint8 tier, uint256 priceWei) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tier == 1 || tier == 2, "ZentrixPass: invalid tier");
        tierPrices[tier] = priceWei;
        emit PriceUpdated(tier, priceWei);
    }

    function withdrawFees() external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "ZentrixPass: zero balance");
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "ZentrixPass: withdrawal failed");
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /// @dev Overridden to make subscription passes soulbound.
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override whenNotPaused returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("ZentrixPass: soulbound, non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
