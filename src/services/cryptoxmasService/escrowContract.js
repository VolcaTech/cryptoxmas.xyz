import Promise from "bluebird";
import Eth2gift from "../../../cryptoxmas-contracts/build/eth2giftEscrow.json";
import config from '../../../config.json';


class EscrowContractService {

    setup({web3, network}) {
	this.web3 = web3;
	const contractAddress = config[network].ESCROW_CONTRACT;
	
	// init contract object
	this.contract = web3.eth
	    .contract(JSON.parse(Eth2gift.interface))
	    .at(contractAddress);
	Promise.promisifyAll(this.contract, { suffix: "Promise" });
    }

    buyGift(tokenAddress, tokenId, transitAddress, amount) {
	const weiAmount = this.web3.toWei(amount, "ether");
	return this.contract.buyGiftLinkPromise(
	    this.web3.toHex(tokenAddress),
	    this.web3.toHex(tokenId),
	    this.web3.toHex(transitAddress),
	    {
		from: this.web3.eth.accounts[0],
		value: weiAmount
		//gas: 110000
	    }
	);
    }

    cancel(transitAddress) {
	return this.contract.cancelTransferPromise(transitAddress, {
	    from: this.web3.eth.accounts[0],
	    gas: 100000
	});
    }
}


export default EscrowContractService;
