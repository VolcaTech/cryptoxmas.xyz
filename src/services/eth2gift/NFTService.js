import Promise from "bluebird";
import NFT_ABI from '../../../contracts/build/NFT';

const TOKEN_ADDRESS =  '0x49f33ab1c4b159ac16c35ca7ebf25cd06a265276'; 


export default class NFTService {
    constructor(web3) {
	const contract = web3.eth.contract(NFT_ABI).at(TOKEN_ADDRESS);
	Promise.promisifyAll(contract, { suffix: "Promise" });	
	this.tokenContract = contract;
    }

    async tokensOf(owner) {
	const numberOfTokens = await this.tokenContract.balanceOfPromise(owner);
	console.log({numberOfTokens});
	const promises = [];
	for(let i = 0; i < numberOfTokens; i++) {
	    promises.push((this.tokenContract.tokenOfOwnerByIndexPromise(owner, i)));
	}

	const result = await Promise.all(promises);
	
	return result.map(t => t.toString());
    }

    async ownerOf(id) {
	return this.tokenContract.ownerOfPromise(id);
    }
}
