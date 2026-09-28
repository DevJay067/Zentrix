// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/// @title ZentrixReputation
/// @notice Soulbound ERC-721 token representing verified freelance achievements and ratings on MST Blockchain.
contract ZentrixReputation is ERC721, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    struct ReputationData {
        uint256 gigId;
        uint8 rating; // 1 to 5
        uint64 completedAt;
        string evidenceCID;
    }

    uint256 private _nextTokenId = 1;

    mapping(uint256 => ReputationData) private _reputations;
    mapping(address => uint256[]) private _userTokens;
    mapping(address => uint256) private _ratingSum;
    mapping(address => uint256) private _ratingCount;
    mapping(uint256 => string) private _tokenURIs;

    event ReputationMinted(uint256 indexed tokenId, address indexed freelancer, uint256 indexed gigId, uint8 rating);

    constructor() ERC721("Zentrix Reputation", "ZXREP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /// @notice Mints a soulbound reputation credential upon successful milestone completion.
    /// @dev Callable only by accounts with MINTER_ROLE (such as the ZentrixEscrow contract).
    function mintReputation(
        address to,
        uint256 gigId,
        uint8 rating,
        string calldata evidenceCID
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(to != address(0), "ZentrixReputation: zero address");
        require(rating >= 1 && rating <= 5, "ZentrixReputation: rating must be between 1 and 5");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        _reputations[tokenId] = ReputationData({
            gigId: gigId,
            rating: rating,
            completedAt: uint64(block.timestamp),
            evidenceCID: evidenceCID
        });

        _userTokens[to].push(tokenId);
        _ratingSum[to] += rating;
        _ratingCount[to] += 1;

        emit ReputationMinted(tokenId, to, gigId, rating);
        return tokenId;
    }

    /// @notice Returns the average rating scaled by 100 (e.g. 480 = 4.80/5) and total completed gigs.
    function getReputationScore(address account) external view returns (uint256 scoreBps, uint256 completedCount) {
        completedCount = _ratingCount[account];
        if (completedCount == 0) {
            return (0, 0);
        }
        scoreBps = (_ratingSum[account] * 100) / completedCount;
    }

    function getReputation(uint256 tokenId) external view returns (ReputationData memory) {
        _requireOwned(tokenId);
        return _reputations[tokenId];
    }

    function getUserTokens(address account) external view returns (uint256[] memory) {
        return _userTokens[account];
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /// @dev Overridden to make tokens strictly Soulbound (non-transferable).
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override whenNotPaused returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("ZentrixReputation: soulbound, non-transferable");
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
