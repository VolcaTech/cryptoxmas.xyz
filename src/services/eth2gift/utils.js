import sha3 from "solidity-sha3";
const Web3Utils = require("web3-utils");
const SIGNATURE_PREFIX = "\x19Ethereum Signed Message:\n32";
import ksHelper from "../../utils/keystoreHelper";

export const signReceiverAddress = ({ address, transitPrivateKey }) => {
  const verificationHash = Web3Utils.soliditySha3(SIGNATURE_PREFIX, {
    type: "address",
    value: address
  });
  const signature = ksHelper.signWithPK(
    transitPrivateKey,
    verificationHash.toString("hex")
  );
  const v = signature.v;
  const r = "0x" + signature.r.toString("hex");
  const s = "0x" + signature.s.toString("hex");
  return { v, r, s };
};
