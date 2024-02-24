// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ticket.sol";

contract TicketingFactory {
    mapping(address => address[]) public userContracts;
    mapping(address => string) public fetchEvents;
    mapping(address => string) public contractURI;
    address[] public contractAddresses;
    uint256 public totalContracts;

    event TicketingContractCreated(address indexed user, address indexed contractAddress);

    function createTicketingContract(
        string memory name,
        string memory symbol,
        uint256 price,
        uint256 maxTicket,
        string memory eventName,
        string memory uri
    ) external {
        Ticketing newContract = new Ticketing(name, symbol, price, maxTicket, eventName, uri);
        address contractAddress = address(newContract);
        userContracts[msg.sender].push(contractAddress);
        fetchEvents[contractAddress] = eventName;
        contractURI[contractAddress] = uri;
        contractAddresses.push(contractAddress);
        totalContracts++;
        emit TicketingContractCreated(msg.sender, contractAddress);
    }

    function getUserContracts(address user) external view returns (address[] memory) {
        return userContracts[user];
    }

    function getAllContractAddresses() external view returns (address[] memory) {
        address[] memory allAddresses = new address[](totalContracts);
        uint index = 0;
        for (uint i = 0; i < contractAddresses.length; i++) {
            allAddresses[index] = contractAddresses[i];
            index++;
            }

        return allAddresses;
    }
}
