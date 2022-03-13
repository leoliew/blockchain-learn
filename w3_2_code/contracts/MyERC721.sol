// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyERC721 is ERC721 {

    address public owner;

    constructor() ERC721("MyERC721", "M721") {
        owner = msg.sender;
    }

    function mint(address to, uint256 tokenId) public {
        require(msg.sender == owner, "must owner can mint");
        _safeMint(to, tokenId);
    }

}