// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./BokkyPooBahsDateTimeLibrary.sol";

contract TrikiWord is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => mapping(uint256 => uint256[3])) public walletDateToWords;
    mapping(uint256 => string) public idToWord;
    mapping(uint256 => uint256) public idToDate;

    constructor() ERC721("TrikiWord", "TW") {}

    function mint3Words(
        uint256 date,
        string memory word1,
        string memory word2,
        string memory word3
    ) public {
        require(bytes(word1).length > 0, "Word1 must be provided");
        require(bytes(word2).length > 0, "Word2 must be provided");
        require(bytes(word3).length > 0, "Word3 must be provided");

        require(
            keccak256(abi.encodePacked((word1))) !=
                keccak256(abi.encodePacked((word2))),
            "Words must be unique"
        );
        require(
            keccak256(abi.encodePacked((word2))) !=
                keccak256(abi.encodePacked((word3))),
            "Words must be unique"
        );
        require(
            keccak256(abi.encodePacked((word1))) !=
                keccak256(abi.encodePacked((word3))),
            "Words must be unique"
        );

        // Check date
        uint256 currentDate = _getCurrentDate();
        require(date <= currentDate, "Cannot mint tokens for future dates");
        require(
            date >= currentDate - 7,
            "Cannot mint tokens for dates older than 7 days"
        );

        // Ensure not more than 3 tokens minted for this date
        require(
            walletDateToWords[msg.sender][date][0] == 0 &&
                walletDateToWords[msg.sender][date][1] == 0 &&
                walletDateToWords[msg.sender][date][2] == 0,
            "Already minted 3 tokens for this date"
        );

        _mintWord(msg.sender, date, word1);
        _mintWord(msg.sender, date, word2);
        _mintWord(msg.sender, date, word3);

        walletDateToWords[msg.sender][date] = [
            _tokenIds.current() - 2,
            _tokenIds.current() - 1,
            _tokenIds.current()
        ];
    }

    function _mintWord(address to, uint256 date, string memory word) internal {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(to, newTokenId);
        idToWord[newTokenId] = word;
        idToDate[newTokenId] = date;
    }

    function _getCurrentDate() internal view returns (uint256) {
        uint year;
        uint month;
        uint date;
        (year, month, date) = BokkyPooBahsDateTimeLibrary.timestampToDate(
            block.timestamp
        );
        return year * 10000 + month * 100 + date;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_exists(tokenId), "Nonexistent token");

        string memory word = idToWord[tokenId];
        uint256 date = idToDate[tokenId];

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                "{",
                                '"name": "#',
                                Strings.toString(tokenId),
                                " | ",
                                word,
                                '",',
                                '"description": "',
                                word,
                                " on ",
                                Strings.toString(date),
                                '",',
                                '"attributes": [',
                                "{",
                                '"trait_type": "Keyword",',
                                '"value": "',
                                word,
                                '"',
                                "},",
                                "{",
                                '"trait_type": "Date",',
                                '"value": "',
                                Strings.toString(date),
                                '"',
                                "}",
                                "],",
                                '"image": "https://0xkusari.github.io/triki/triki.jpg"',
                                "}"
                            )
                        )
                    )
                )
            );
    }
}
