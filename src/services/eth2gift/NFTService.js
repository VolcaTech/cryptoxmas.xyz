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
	const service = this;
	const numberOfTokens = await this.tokenContract.balanceOfPromise(owner);
	console.log({numberOfTokens});
	const promises = [];
	for(let i = 0; i < numberOfTokens; i++) {
	    promises.push(
		this.tokenContract.tokenOfOwnerByIndexPromise(owner, i)
		    .then(t => t.toString())
		    .then(async tokenId => {
			console.log({tokenId});
			const metadata = await this.getMetadata(tokenId);
			return { tokenId, metadata };
		    })
	    );
	}

	const result = await Promise.all(promises)
	return result;
    }

    async ownerOf(id) {
	return this.tokenContract.ownerOfPromise(id);
    }

    async getMetadata(id, tokenURI="NOT_FETCHED") {
	// default metadata
	let metadata;
	let defaultMeta = {
	    description: "",
	    name: `NFT #${id}`,
	    image: "https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/santa_zombie.png"
	};
	
	// fetch token URI if it wasn't fetched
	if (tokenURI === "NOT_FETCHED") {
	    tokenURI = await this.tokenContract.tokenURIPromise(id);
	}

	// if there is tokenURI, get metadata from URI
	if (tokenURI) {
	    try { 
		metadata = await fetch(tokenURI).then(res => res.json());
		console.log({metadata});
	    } catch (err) {
		console.log(err)
	    }
	}
	
	return metadata || defaultMeta;	   
    }
    
}
