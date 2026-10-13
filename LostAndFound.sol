
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LostAndFound {
    address public owner;
    uint256 public itemCount;

    struct Item {
        uint256 id;
        string name;
        string description;
        address reporter;
        bool recovered;
    }

    mapping(uint256 => Item) public items;

    event ItemReported(uint256 id, address reporter);
    event ItemRecovered(uint256 id);

    constructor() {
        owner = msg.sender;
    }

    function reportItem(
        string memory _name,
        string memory _description
    ) public {
        require(bytes(_name).length > 0, "Name cannot be empty");

        itemCount++;

        items[itemCount] = Item(
            itemCount,
            _name,
            _description,
            msg.sender,
            false
        );

        emit ItemReported(itemCount, msg.sender);
    }

    function markRecovered(uint256 _id) public {
        require(_id > 0 && _id <= itemCount, "Invalid item ID");

        Item storage item = items[_id];

        require(msg.sender == item.reporter, "Not authorized");
        require(!item.recovered, "Already recovered");

        item.recovered = true;

        emit ItemRecovered(_id);
    }
}
