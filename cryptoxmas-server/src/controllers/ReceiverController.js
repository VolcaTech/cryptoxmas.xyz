//const TransferService = require('../services/TransferService');
const EscrowContractService = require('../services/EscrowContractService');
const log = require('../libs/log')(module);
const Web3Utils = require('web3-utils');


const claimGift = async (req, res) => {
    let { transitAddress, receiverAddress } = req.body;
    if (!transitAddress) {
	throw new Error('Please provide transitAddress');
    };

    receiverAddress = receiverAddress.toString("hex");
    if (!receiverAddress) {
	throw new Error('Please provide receiver address');
    };

    // signature (v,r,s)
    const v = parseInt(req.body.v,10);
    if (!v) {
	throw new Error('Please provide valid signature (v)');
    };

    const r = req.body.r.toString("hex");
    if (!r) {
	throw new Error('Please provide valid signature (r)');
    };

    const s = req.body.s.toString("hex");
    if (!s) {
	throw new Error('Please provide valid signature (s)');
    };


    // check that signature is valid
    const signatureValid = await EscrowContractService.checkCanWithdraw(transitAddress,
								      receiverAddress, v, r, s);
    if (!signatureValid) {
	throw new Error('Signature is not valid');
    };

    // send transaction
    const {hash: txHash} = await EscrowContractService.withdraw(transitAddress,
							receiverAddress, v, r, s);

    res.json({success: true, txHash });
}


// const getTransfer = async (req, res) => {
//     const { transferId } = req.params;
//     if (!transferId) {
// 	throw new Error('Please provide transfer id');
//     };
    
//     const transfer = await TransferService.getByTransferId(transferId);
//     if (!transfer) {
// 	throw new Error('No transfer found on server. ' + transferId);
//     }
    
//     res.json({success: true, transfer });    
// }
    

module.exports = {
    //getTransfer,
    claimGift
}

