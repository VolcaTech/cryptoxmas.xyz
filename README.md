# 🎁 Crypto Christmas [WIP] 🎺


## Christmas Cards & Gifts on Ethereum


### Share Christmas Cards & Gifts with anyone

Using the eth2.io technology you can generate a simple URL, sendable to anyone — just like a text message. 
The receiver simply opens the link, gets forwarded to install a wallet and receive the Christmas Card (ERC721 token) and (optionally) ETH. The Christmas Card and ETH are securely hold in an escrow smart contract, until the receiver claims them. If nobody claims the crypto, you can just claim it back yourself.

### Donate tokens to people in need

You can attach an Etheruem or ERC20 donation to a Charity DAO, saving the christmas for the people most in need.


## How it works

### Based on the eth.io technology
* [Sending demo](https://www.youtube.com/watch?v=FeqQyFrmptA)
* [Receiving demo](https://www.youtube.com/watch?v=qp3kkXKIHP8)

### Send
![Send](/public/eth2phone_send.png)
1. Sender generates transit private-public key pair, deposits ether to the escrow smart contract and assigns transit public key to the deposit. On withdrawal the escrow smart contract verifies that receiver's address is signed by the transit private key.
2. Sender encrypts transit private key with random secret code and sends encrypted transit private key to verification server.
3. Sender passes the secret code to receiver by the way he chooses (voice, sms, e-mail, etc.)

### Receive
![Receive](/public/eth2phone_receive.png)
1. Receiver cliks link types in his phone number and the secret code. Hashed phone verification request is sent to server. (So not at any point in time verification server has the transit private key.)
2. Server sends the verification code via SMS to the phone entered.
3. Receiver gets the code from SMS and types it in. If the code is correct, server returns encrypted transit private key to receiver.
4. Receiver decrypts the transit private key with the secret code provided by sender and gets the transit private key. Receiver signs address of his choice with the transit private key. Receiver sends signed address to verification server.
5. Verification server tries to withdraw ether from Escrow Smart Contract to signed address. If signature is correct, the transaction is executed and receiver gets the ether.

## Code structure

We are working hard on saving Christmas, join us!

## License

MIT License
