import Promise from "bluebird";
import eth2giftABI from '../../../contracts/build/eth2gift';
const contract = require('truffle-contract');
import web3Service from "../web3Service";

const CONTRACT_ADDRESS =  '0xa15c6e8df890c864c3185898e805fbd32721368c'; 

const EscrowContractService = () => {
    var web3, contract;    


    // function _parseTransfer(result) {
    // 	return {
    // 	    transitAddress: result[0].toString(),
    // 	    from: result[2].toString('hex'),
    // 	    amount: web3.fromWei(result[3], "ether").toString()
    // 	};
    // }
    
    function setup(_web3) {
	web3 = _web3;
	contract = web3.eth.contract(eth2giftABI).at(CONTRACT_ADDRESS);
	Promise.promisifyAll(contract, { suffix: "Promise" });
	console.log(" eth2phone escrow contract is set up!");
    }
    
    function buyGift(tokenId, transitAddress, amount){	
        const weiAmount = web3.toWei(amount, "ether");
	return contract.buyGiftLinkPromise(web3.toHex(tokenId),
					   web3.toHex(transitAddress), {
					       from: web3.eth.accounts[0],
					       value: weiAmount,
					       //gas: 110000
					   });
    }
    
    function cancel(transitAddress, contractVersion = 2){	
	return contract.cancelTransferPromise(transitAddress, {from: web3.eth.accounts[0], gas: 100000});
    }
 
    
    // function getWithdrawalEvents(address, fromBlock){
    // 	return new Promise((resolve, reject) => {
    // 	    const eventsGetter = contract.LogWithdraw({'sender': address}, { fromBlock, toBlock: 'latest', address: contractInstance.address });
    // 	    eventsGetter.get((error, response) => {
    // 		if (error) { return reject(error); }
    // 		resolve(response);
    // 	    });
    // 	});
    // };
    

    // api
    return {
	buyGift,
	setup,
	//getWithdrawalEvents,
	//getAmountWithCommission,
	cancel,
	getContractAddress: () => CONTRACT_ADDRESS
    };
    
}

export default EscrowContractService();