module.exports =[
    {
	"constant": false,
	"inputs": [],
	"name": "stop",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "commissionToWithdraw",
	"outputs": [
	    {
		"name": "",
		"type": "uint256"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "verifier",
	"outputs": [
	    {
		"name": "",
		"type": "address"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [
	    {
		"name": "_transitAddress",
		"type": "address"
	    }
	],
	"name": "getGift",
	"outputs": [
	    {
		"name": "sender",
		"type": "address"
	    },
	    {
		"name": "amount",
		"type": "uint256"
	    },
	    {
		"name": "tokenAddress",
		"type": "address"
	    },
	    {
		"name": "tokenId",
		"type": "uint256"
	    },
	    {
		"name": "status",
		"type": "uint8"
	    },
	    {
		"name": "tokenURI",
		"type": "string"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [
	    {
		"name": "_transitAddress",
		"type": "address"
	    },
	    {
		"name": "_recipient",
		"type": "address"
	    },
	    {
		"name": "_v",
		"type": "uint8"
	    },
	    {
		"name": "_r",
		"type": "bytes32"
	    },
	    {
		"name": "_s",
		"type": "bytes32"
	    }
	],
	"name": "verifySignature",
	"outputs": [
	    {
		"name": "success",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "pure",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [],
	"name": "withdrawCommission",
	"outputs": [
	    {
		"name": "success",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [],
	"name": "unpause",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "paused",
	"outputs": [
	    {
		"name": "",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "commissionFee",
	"outputs": [
	    {
		"name": "",
		"type": "uint256"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [
	    {
		"name": "_newCommissionFee",
		"type": "uint256"
	    }
	],
	"name": "changeFixedCommissionFee",
	"outputs": [
	    {
		"name": "success",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "stopped",
	"outputs": [
	    {
		"name": "",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [],
	"name": "pause",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [
	    {
		"name": "_transitAddress",
		"type": "address"
	    },
	    {
		"name": "_recipient",
		"type": "address"
	    },
	    {
		"name": "_v",
		"type": "uint8"
	    },
	    {
		"name": "_r",
		"type": "bytes32"
	    },
	    {
		"name": "_s",
		"type": "bytes32"
	    }
	],
	"name": "withdraw",
	"outputs": [
	    {
		"name": "success",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "owner",
	"outputs": [
	    {
		"name": "",
		"type": "address"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [
	    {
		"name": "_transitAddress",
		"type": "address"
	    },
	    {
		"name": "_recipient",
		"type": "address"
	    },
	    {
		"name": "_v",
		"type": "uint8"
	    },
	    {
		"name": "_r",
		"type": "bytes32"
	    },
	    {
		"name": "_s",
		"type": "bytes32"
	    }
	],
	"name": "canWithdraw",
	"outputs": [
	    {
		"name": "success",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [
	    {
		"name": "_tokenAddress",
		"type": "address"
	    },
	    {
		"name": "_tokenId",
		"type": "uint256"
	    },
	    {
		"name": "_transitAddress",
		"type": "address"
	    }
	],
	"name": "buyGiftLink",
	"outputs": [
	    {
		"name": "",
		"type": "bool"
	    }
	],
	"payable": true,
	"stateMutability": "payable",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [
	    {
		"name": "_transitAddress",
		"type": "address"
	    }
	],
	"name": "cancelTransfer",
	"outputs": [
	    {
		"name": "success",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [
	    {
		"name": "_sellerAddress",
		"type": "address"
	    },
	    {
		"name": "_tokenAddress",
		"type": "address"
	    }
	],
	"name": "addSeller",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [
	    {
		"name": "_newVerifier",
		"type": "address"
	    }
	],
	"name": "changeVerifier",
	"outputs": [
	    {
		"name": "success",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [
	    {
		"name": "_tokenAddress",
		"type": "address"
	    },
	    {
		"name": "_tokenId",
		"type": "uint256"
	    },
	    {
		"name": "_transitAddress",
		"type": "address"
	    }
	],
	"name": "canBuyGiftLink",
	"outputs": [
	    {
		"name": "",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"inputs": [
	    {
		"name": "_commissionFee",
		"type": "uint256"
	    },
	    {
		"name": "_tokenAddress",
		"type": "address"
	    }
	],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "constructor"
    },
    {
	"payable": true,
	"stateMutability": "payable",
	"type": "fallback"
    },
    {
	"anonymous": false,
	"inputs": [
	    {
		"indexed": true,
		"name": "transitAddress",
		"type": "address"
	    },
	    {
		"indexed": true,
		"name": "sender",
		"type": "address"
	    },
	    {
		"indexed": true,
		"name": "tokenAddress",
		"type": "address"
	    },
	    {
		"indexed": false,
		"name": "tokenId",
		"type": "uint256"
	    },
	    {
		"indexed": false,
		"name": "amount",
		"type": "uint256"
	    },
	    {
		"indexed": false,
		"name": "commission",
		"type": "uint256"
	    }
	],
	"name": "LogBuy",
	"type": "event"
    },
    {
	"anonymous": false,
	"inputs": [
	    {
		"indexed": true,
		"name": "transitAddress",
		"type": "address"
	    },
	    {
		"indexed": true,
		"name": "sender",
		"type": "address"
	    },
	    {
		"indexed": true,
		"name": "tokenAddress",
		"type": "address"
	    },
	    {
		"indexed": false,
		"name": "tokenId",
		"type": "uint256"
	    }
	],
	"name": "LogCancel",
	"type": "event"
    },
    {
	"anonymous": false,
	"inputs": [
	    {
		"indexed": true,
		"name": "transitAddress",
		"type": "address"
	    },
	    {
		"indexed": true,
		"name": "sender",
		"type": "address"
	    },
	    {
		"indexed": true,
		"name": "tokenAddress",
		"type": "address"
	    },
	    {
		"indexed": false,
		"name": "tokenId",
		"type": "uint256"
	    },
	    {
		"indexed": false,
		"name": "recipient",
		"type": "address"
	    },
	    {
		"indexed": false,
		"name": "amount",
		"type": "uint256"
	    }
	],
	"name": "LogWithdraw",
	"type": "event"
    },
    {
	"anonymous": false,
	"inputs": [
	    {
		"indexed": false,
		"name": "commissionAmount",
		"type": "uint256"
	    }
	],
	"name": "LogWithdrawCommission",
	"type": "event"
    },
    {
	"anonymous": false,
	"inputs": [
	    {
		"indexed": false,
		"name": "oldCommissionFee",
		"type": "uint256"
	    },
	    {
		"indexed": false,
		"name": "newCommissionFee",
		"type": "uint256"
	    }
	],
	"name": "LogChangeFixedCommissionFee",
	"type": "event"
    },
    {
	"anonymous": false,
	"inputs": [
	    {
		"indexed": false,
		"name": "oldVerifier",
		"type": "address"
	    },
	    {
		"indexed": false,
		"name": "newVerifier",
		"type": "address"
	    }
	],
	"name": "LogChangeVerifier",
	"type": "event"
    },
    {
	"anonymous": false,
	"inputs": [],
	"name": "Stop",
	"type": "event"
    },
    {
	"anonymous": false,
	"inputs": [],
	"name": "Pause",
	"type": "event"
    },
    {
	"anonymous": false,
	"inputs": [],
	"name": "Unpause",
	"type": "event"
    }
]
