pragma solidity ^0.4.25;

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
/**
 * @notice It is not recommened to call this function outside of the giveth dapp (giveth.io)
 * this function is bridged to a side chain. If for some reason the sidechain tx fails, the donation
 * will end up in the givers control inside LiquidPledging contract. If you do not use the dapp, there
 * will be no way of notifying the sender/giver that the giver has to take action (withdraw/donate) in
 * the dapp
 */
contract GivethBridge is Pausable {

  mapping(address => bool) tokenWhitelist;

  event Donate(uint64 giverId, uint64 receiverId, address token, uint amount);
  event DonateAndCreateGiver(address giver, uint64 receiverId, address token, uint amount);
  event EscapeFundsCalled(address token, uint amount);

  constructor() public 
  {
    tokenWhitelist[0] = true; // enable eth transfers
  }

  /* function donateAndCreateGiver(address giver, uint64 receiverId) payable external { */
  /*   donateAndCreateGiver(giver, receiverId, 0, 0); */
  /* } */
  
  
  function donateAndCreateGiver(address giver, uint64 receiverId, address token, uint _amount) whenNotPaused payable public {
    require(giver != 0);
    require(receiverId != 0);
    uint amount = _receiveDonation(token, _amount);
    emit DonateAndCreateGiver(giver, receiverId, token, amount);
  }

  function donate(uint64 giverId, uint64 receiverId, address token, uint _amount) whenNotPaused payable public {
    require(giverId != 0);
    require(receiverId != 0);
    uint amount = _receiveDonation(token, _amount);
    emit Donate(giverId, receiverId, token, amount);
  }

  
  function _receiveDonation(address token, uint _amount) internal returns(uint amount) {
    require(tokenWhitelist[token]);
    amount = _amount;

    // eth donation
    if (token == 0) {
      amount = msg.value;
    }

    require(amount > 0);

    /* if (token != 0) { */
    /*   require(ERC20(token).transferFrom(msg.sender, this, amount)); */
    /* } */
  }
}
