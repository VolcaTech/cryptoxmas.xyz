import Promise from "bluebird";
import eth2giftABI from "../../../contracts/build/eth2gift";
import NFTService from "./NFTService";

const CONTRACT_ADDRESS = "0xa1d89cb2dc2283325dde52defd2056e099916103";
const SELLER_ADDRESS = "0xF695e673d7D159CBFc119b53D8928cEca4Efe99e";

const EscrowContractService = () => {
  var web3, contract, nftService;

  function setup(_web3) {
    web3 = _web3;
    contract = web3.eth.contract(eth2giftABI).at(CONTRACT_ADDRESS);
    Promise.promisifyAll(contract, { suffix: "Promise" });
    nftService = new NFTService(web3);
  }

  function buyGift(tokenAddress, tokenId, transitAddress, amount) {
    const weiAmount = web3.toWei(amount, "ether");
    return contract.buyGiftLinkPromise(
      web3.toHex(tokenAddress),
      web3.toHex(tokenId),
      web3.toHex(transitAddress),
      {
        from: web3.eth.accounts[0],
        value: weiAmount
        //gas: 110000
      }
    );
  }

  function cancel(transitAddress) {
    return contract.cancelTransferPromise(transitAddress, {
      from: web3.eth.accounts[0],
      gas: 100000
    });
  }

  function getGiftsForSale() {
    return nftService.tokensOf(SELLER_ADDRESS);
  }

  function getTokenMetadata(tokenId) {
    return nftService.getMetadata(tokenId);
  }

  async function getGift(transitAddress) {
    async function _parse(g) {
      const tokenURI = g[5].toString();
      const tokenId = g[3].toString();
      const { image, name, description } = await nftService.getMetadata(
        tokenId,
        tokenURI
      );

      return {
        transitAddress,
        sender: g[0],
        amount: web3.fromWei(g[1], "ether").toString(),
        tokenAddress: g[2],
        tokenId,
        status: g[4].toString(),
        image,
        name,
        description
      };
    }
    const result = await contract.getGiftPromise(transitAddress);
    const parsed = await _parse(result);
    return parsed;
  }

  // api
  return {
    buyGift,
    setup,
    getGift,
    getGiftsForSale,
    cancel,
    getContractAddress: () => CONTRACT_ADDRESS,
    getTokenMetadata
  };
};

export default EscrowContractService();
