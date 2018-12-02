export const getDepositTxHash = events => {
  const event = events
    .filter(
      event => event.eventName === "deposit" && event.txStatus === "pending"
    )
    .sort((a, b) => b.gasPrice - a.gasPrice)[0];
  return event.txHash;
};

export const getTxHashForMinedEvent = (events, eventName) => {
  const event = events.filter(
    event => event.eventName === eventName && event.txStatus === "success"
  )[0];
  return event.txHash;
};

export const getTxHashForStatus = transfer => {
  let txHash;
  switch (transfer.status) {
    case "completed":
      txHash = getTxHashForMinedEvent(transfer.events, "withdraw");
      break;
    case "cancelled":
      txHash = getTxHashForMinedEvent(transfer.events, "cancel");
      break;
    case "error":
      txHash = getDepositTxHash(transfer.events);
      break;
  }
  return txHash;
};
