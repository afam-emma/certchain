// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title CertificateRegistry
 * @dev Smart contract to store certificate hashes on the blockchain
 * 
 * This contract allows:
 * - Registering certificate hashes with a timestamp
 * - Verifying if a certificate hash exists on-chain
 * - Retrieving the timestamp when a certificate was registered
 */
contract CertificateRegistry {
    // Mapping from certificate hash to timestamp (0 = not registered)
    mapping(bytes32 => uint256) public certificateTimestamps;

    // Event emitted when a certificate is registered
    event CertificateRegistered(bytes32 indexed certHash, uint256 timestamp, address indexed registrar);

    /**
     * @dev Register a certificate hash on the blockchain
     * @param certHash The SHA256 hash of the certificate
     */
    function registerCertificate(bytes32 certHash) external {
        require(certificateTimestamps[certHash] == 0, "Certificate already registered");
        
        certificateTimestamps[certHash] = block.timestamp;
        
        emit CertificateRegistered(certHash, block.timestamp, msg.sender);
    }

    /**
     * @dev Verify if a certificate hash exists on the blockchain
     * @param certHash The SHA256 hash of the certificate
     * @return timestamp The timestamp when the certificate was registered (0 = not found)
     */
    function verifyCertificate(bytes32 certHash) external view returns (uint256) {
        return certificateTimestamps[certHash];
    }

    /**
     * @dev Check if a certificate is registered
     * @param certHash The SHA256 hash of the certificate
     * @return bool True if the certificate is registered
     */
    function isRegistered(bytes32 certHash) external view returns (bool) {
        return certificateTimestamps[certHash] > 0;
    }
}