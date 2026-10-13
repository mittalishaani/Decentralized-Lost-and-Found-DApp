
const CONTRACT_ADDRESS = "0x1fb0B60e60DBE20Bf01597aeD1D8bEC9381C1753";

const CONTRACT_ABI = [
    "function itemCount() view returns (uint256)",
    "function items(uint256) view returns (uint256 id, string name, string description, address reporter, bool recovered)",
    "function reportItem(string _name, string _description)",
    "function markRecovered(uint256 _id)"
];

let provider;
let signer;
let contract;
let currentAccount;

const statusMessage = document.getElementById("statusMessage");
const walletAddress = document.getElementById("walletAddress");
const itemsList = document.getElementById("itemsList");

function showStatus(message) {
    statusMessage.textContent = message;
}

async function connectWallet() {
    try {
        if (!window.ethereum) {
            showStatus("Please install MetaMask.");
            return;
        }

        provider = new ethers.BrowserProvider(window.ethereum);

        await provider.send("eth_requestAccounts", []);

        const network = await provider.getNetwork();

        if (network.chainId !== 1337n) {
            showStatus("Please switch MetaMask to Ganache Local.");
            return;
        }

        signer = await provider.getSigner();
        currentAccount = await signer.getAddress();

        contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
        );

        walletAddress.textContent =
            "Connected: " + currentAccount;

        showStatus("Wallet connected successfully!");

        await loadItems();

    } catch (error) {
        showStatus("Connection failed: " + error.message);
    }
}

async function reportItem(event) {
    event.preventDefault();

    if (!contract) {
        showStatus("Connect your wallet first.");
        return;
    }

    const name = document.getElementById("itemName").value.trim();
    const description =
        document.getElementById("itemDescription").value.trim();

    if (!name) {
        showStatus("Item name cannot be empty.");
        return;
    }

    try {
        showStatus("Waiting for MetaMask confirmation...");

        const tx = await contract.reportItem(name, description);

        showStatus("Transaction submitted. Waiting for confirmation...");

        await tx.wait();

        showStatus("Item reported successfully!");

        document.getElementById("reportForm").reset();

        await loadItems();

    } catch (error) {
        showStatus("Transaction failed: " + (error.shortMessage || error.message));
    }
}

async function loadItems() {
    if (!contract) {
        showStatus("Connect your wallet first.");
        return;
    }

    try {
        itemsList.innerHTML = "";

        const count = await contract.itemCount();

        if (count === 0n) {
            itemsList.textContent = "No items reported yet.";
            return;
        }

        for (let i = 1n; i <= count; i++) {
            const item = await contract.items(i);

            const itemDiv = document.createElement("div");
            itemDiv.className = "item";

            const heading = document.createElement("h3");
            heading.textContent = item.name;

            const description = document.createElement("p");
            description.textContent = item.description;

            const reporter = document.createElement("p");
            reporter.textContent = "Reported by: " + item.reporter;

            const status = document.createElement("p");
            status.className =
                "status " + (item.recovered ? "recovered" : "lost");

            status.textContent =
                item.recovered ? "Recovered" : "Lost";

            itemDiv.append(heading, description, reporter, status);

            if (
                !item.recovered &&
                item.reporter.toLowerCase() === currentAccount.toLowerCase()
            ) {
                const button = document.createElement("button");
                button.textContent = "Mark as Recovered";

                button.addEventListener("click", async () => {
                    await markRecovered(i);
                });

                itemDiv.appendChild(button);
            }

            itemsList.appendChild(itemDiv);
        }

    } catch (error) {
        showStatus("Failed to load items: " + (error.shortMessage || error.message));
    }
}

async function markRecovered(id) {
    try {
        showStatus("Waiting for MetaMask confirmation...");

        const tx = await contract.markRecovered(id);

        await tx.wait();

        showStatus("Item marked as recovered!");

        await loadItems();

    } catch (error) {
        showStatus("Recovery failed: " + (error.shortMessage || error.message));
    }
}

document.getElementById("connectWallet")
    .addEventListener("click", connectWallet);

document.getElementById("reportForm")
    .addEventListener("submit", reportItem);

document.getElementById("refreshItems")
    .addEventListener("click", loadItems);

if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => {
        window.location.reload();
    });

    window.ethereum.on("chainChanged", () => {
        window.location.reload();
    });
}
