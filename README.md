# Decentralized Lost & Found DApp

A blockchain-based campus Lost & Found system developed using Solidity, Ethereum, Ganache, MetaMask, Ethers.js, HTML, CSS, and JavaScript.

## 1. Project Overview

The Decentralized Lost & Found DApp is designed to help students report, track, and recover lost belongings on campus.

The application stores lost item records on an Ethereum blockchain using a Solidity smart contract. Each item is associated with the wallet address of the user who registered it.

Only the original reporter can mark an item as recovered, ensuring ownership-based access control.

## 2. Technologies Used

| Technology | Purpose |
|---|---|
| Solidity | Smart contract development |
| Remix IDE | Compilation, deployment, and testing |
| Ganache | Local Ethereum blockchain |
| MetaMask | Wallet connection and transaction signing |
| Ethers.js | Frontend-blockchain communication |
| HTML | Website structure |
| CSS | Website styling |
| JavaScript | Frontend functionality |
| GitHub | Version control and project hosting |

## 3. Features

- Connect Ethereum wallets using MetaMask.
- Register lost items with a name and description.
- Store item records on the blockchain.
- Retrieve and display registered items.
- Mark items as recovered.
- Allow only the original reporter to update recovery status.
- Prevent duplicate recovery transactions.
- Reject invalid item names.
- Support multiple users through different Ethereum accounts.

## 4. Smart Contract Implementation

**Contract Name:** `LostAndFound`

The smart contract uses a Solidity structure to represent lost items.

Each item contains:

- `id` — Unique item identifier.
- `name` — Name of the lost item.
- `description` — Additional details about the item.
- `reporter` — Ethereum address that registered the item.
- `recovered` — Boolean indicating whether the item has been recovered.

Item records are stored using a mapping from item IDs to their corresponding structures.

### Smart Contract Functions

**`reportItem(string _name, string _description)`**

Registers a new lost item. The function validates that the item name is not empty, assigns a unique ID, and stores the reporter's wallet address.

**`markRecovered(uint256 _id)`**

Marks an item as recovered after validating the item ID, verifying the caller's address, and checking that the item has not already been recovered.

**`items(uint256 _id)`**

Retrieves the details of a registered item.

**`itemCount()`**

Returns the total number of items registered.

### Events

- `ItemReported` — Emitted when an item is registered.
- `ItemRecovered` — Emitted when an item is marked as recovered.

## 5. System Architecture

The application follows this architecture:

**User → Web Frontend → Ethers.js → MetaMask → Ganache → Solidity Smart Contract**

The frontend collects user input and displays item records. Ethers.js communicates with the smart contract, while MetaMask signs transactions. Ganache provides the local Ethereum blockchain.

## 6. Installation and Setup

### Prerequisites

- VS Code
- MetaMask browser extension
- Ganache
- Remix IDE
- Web browser
- Live Server extension for VS Code

### Running the Application

1. Clone or download this GitHub repository.
2. Start Ganache and create or open an Ethereum workspace.
3. Configure MetaMask to connect to the Ganache network.
4. Fund a MetaMask account using Ganache test ETH.
5. Open `LostAndFound.sol` in Remix IDE.
6. Compile the contract with a Solidity compiler targeting the Paris EVM.
7. Select Browser Extension as the deployment environment.
8. Deploy the contract to Ganache using MetaMask.
9. Copy the successfully deployed contract address.
10. Replace `CONTRACT_ADDRESS` in `app.js` with the new address.
11. Open `index.html` using Live Server.
12. Connect MetaMask and interact with the application.

### Local Blockchain Configuration

| Parameter | Value |
|---|---|
| Network | Ganache Local |
| Chain ID | 1337 |
| RPC URL | http://127.0.0.1:7545 |
| Currency | Test ETH |
| EVM Version | Paris |

The application requires Ganache to remain running. If the blockchain is reset, the smart contract must be redeployed and the contract address updated.

## 7. Testing and Results

| Test Case | Expected Result | Result |
|---|---|---|
| Connect MetaMask | Wallet connects successfully | Passed |
| Register lost item | Item stored on blockchain | Passed |
| Retrieve item details | Correct item information returned | Passed |
| Recover lost item | Recovery status changes to true | Passed |
| Empty item name | Registration rejected | Passed |
| Duplicate recovery | Transaction rejected | Passed |
| Unauthorized recovery | Transaction rejected | Passed |
| Register item using Account 2 | Item registered under Account 2 | Passed |
| View Account 2's item using Account 1 | Item details visible | Passed |
| Recover Account 2's item using Account 1 | Access denied | Passed |
| Recover item using original reporter | Transaction succeeds | Passed |

### Access Control Testing

Two MetaMask accounts were used to test authorization.

An item was registered using Account 2. Account 1 could view the item but could not mark it as recovered.

The smart contract rejected unauthorized recovery attempts through the following condition:

`require(msg.sender == item.reporter, "Not authorized");`

This demonstrates that access control is enforced by the smart contract rather than relying solely on frontend restrictions.

## 8. Security Features

The smart contract implements several validation mechanisms:

- Input validation prevents empty item names.
- Item ID validation rejects invalid recovery requests.
- Wallet-based authorization restricts recovery to the original reporter.
- Duplicate recovery prevention rejects repeated recovery operations.
- Transaction events provide a record of important contract operations.

## 9. Screenshots

Screenshots of the application, transactions, and testing results are available in the `screenshots/` directory.

These demonstrate wallet connectivity, item registration, recovery operations, and access control.

## 10. Limitations and Future Improvements

The current application runs on a local Ethereum blockchain using Ganache.

Potential improvements include:

- Allowing users to report found items.
- Implementing a verification process for rightful ownership.
- Adding item categories and search functionality.
- Supporting image uploads using decentralized storage.
- Deploying the application to a public Ethereum test network.
- Introducing administrative features for campus lost and found management.

## 11. Conclusion

The Decentralized Lost & Found DApp demonstrates the development of a blockchain-based application using Solidity and Ethereum.

The project successfully integrates a smart contract with a web frontend and MetaMask wallet authentication.

It demonstrates blockchain data storage, smart contract transactions, input validation, ownership-based access control, and multi-user interaction.