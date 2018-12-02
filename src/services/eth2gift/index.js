import escrowContract from "./escrowContract";
import * as server from "./serverApi";
import { signReceiverAddress } from "./utils";
const Wallet = require("ethereumjs-wallet");

const _generateTransferIdForLink = address => {
  return `link-${address}`;
};

export const buyGift = async ({ tokenAddress, tokenId, amountToPay }) => {
  const wallet = Wallet.generate();
  const transitAddress = wallet.getChecksumAddressString();
  const transitPrivateKey = wallet.getPrivateKeyString().substring(2);
  const transferId = _generateTransferIdForLink(transitAddress);

  // 3. send deposit to smart contract
  const txHash = await escrowContract.buyGift(
    tokenAddress,
    tokenId,
    transitAddress,
    amountToPay
  );
  return { txHash, transitPrivateKey, transferId, transitAddress };
};

const _getAddressFromPrivateKey = privateKey => {
  return (
    "0x" +
    Wallet.fromPrivateKey(new Buffer(privateKey, "hex"))
      .getAddress()
      .toString("hex")
  );
};

export const cancelTransfer = (transitAddress, contractVersion) =>
  escrowContract.cancel(transitAddress, contractVersion);
export const getTokenMetadata = tokenId =>
  escrowContract.getTokenMetadata(tokenId);
export const getGift = transitPrivateKey => {
  const transitAddress = _getAddressFromPrivateKey(transitPrivateKey);
  return escrowContract.getGift(transitAddress);
};

export const getGiftsForSale = () => escrowContract.getGiftsForSale();

export const claimGift = async ({ transitPrivateKey, receiverAddress }) => {
  const transitAddress = _getAddressFromPrivateKey(transitPrivateKey);
  const transferId = _generateTransferIdForLink(transitAddress);

  const { v, r, s } = signReceiverAddress({
    address: receiverAddress,
    transitPrivateKey
  });

  const result = await server.confirmLinkTx(
    transitAddress,
    receiverAddress,
    v,
    r,
    s
  );

  if (!result.success) {
    throw new Error(result.errorMessage || "Server error on withdrawal!");
  }

  return { txHash: result.txHash, amount: result.amount, transferId };
};
