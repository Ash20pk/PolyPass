// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Ticketing is ERC721, ERC721URIStorage {
    uint256 public totalTickets;
    uint256 public price;
    uint256 public maxTicket;
    uint256 public ticketId;
    string public eventName;
    string public uri;

    mapping(uint256 => bool) public usedTickets;
    mapping(address => uint256) public TicketsBrought;

    constructor(string memory _name, string memory _symbol, uint256 _price, uint256 _maxTicket, string memory _eventName, string memory _uri) ERC721(_name, _symbol) {
        totalTickets = 0;
        price = _price;
        maxTicket = _maxTicket;
        eventName = _eventName;
        uri = _uri;
    }

    function buyTicket() public payable {
        require(totalTickets <= maxTicket, "All tickets sold out");
        require(msg.value == price, "Incorrect payment amount");

        ticketId = totalTickets + 1;
        totalTickets++;
        TicketsBrought[msg.sender] = ticketId;
        
        _setTokenURI(ticketId, uri);
        _mint(msg.sender, ticketId);
    }

    function useTicket(uint256 id) public {
        require(ownerOf(id) == msg.sender, "Ticket owner only");
        require(!usedTickets[id], "Ticket already used");

        usedTickets[id] = true;
    }

    function refundTicket(uint256 id) public {
        require(ownerOf(id) == msg.sender, "Ticket owner only");
        require(!usedTickets[id], "Ticket already used");

        usedTickets[id] = true;

        payable(msg.sender).transfer(price);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function whichEvent() public view returns(string memory) {
        return eventName;
    }
}