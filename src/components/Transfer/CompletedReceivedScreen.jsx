import React, { CAomponent } from "react";
import { getEtherscanLink } from "./components";
import TransferStepsBar from "./../common/TransferStepsBar";
import ButtonPrimary from "./../../components/common/ButtonPrimary";
import wallets from "../NotConnectedScreens/NoWalletScreen/wallets";
import { getCurrentWalletId } from "../../utils";
import web3Service from "./../../services/web3Service";
import TokenImage from "./../common/TokenImage";

const styles = {
  titleContainer: {
    width: 354,
    margin: "auto",
    marginTop: 50,
    textAlign: "left"
  },
  title: {
    marginBottom: 45,
    fontFamily: "Inter UI Medium",
    fontSize: 30,
    color: "#4CD964",
    textAlign: "left"
  },
  textContainer: {
    marginTop: 20
  },
  text: {
    color: "#fff",
    fontFamily: "Inter UI Medium",
    fontSize: 24,
    lineHeight: "29px"
  },
  amount: {
    color: "#4CD964"
  },
  imageContainer: {
    marginTop: 40
  }
};

const CompletedReceivedScreen = ({ transfer }) => {
  const etherscanLink = getEtherscanLink({
    txHash: transfer.txHash,
    networkId: transfer.networkId
  });

  let dappStoreUrl = "https://dapps.trustwalletapp.com/";
  // get current wallet id
  const web3 = web3Service.getWeb3();
  const currentWalletId = getCurrentWalletId(web3);

  // get dapp store url for wallet if it has one
  if (
    currentWalletId !== "other" &&
    wallets[currentWalletId] &&
    wallets[currentWalletId].dappStoreUrl
  ) {
    dappStoreUrl = wallets[currentWalletId].dappStoreUrl;
  }

  const gift = transfer.gift || {};
  console.log({ gift });

  return (
    <div>
      <div style={styles.titleContainer}>
        <div style={styles.title}>Hooray!</div>
        <div style={styles.textContainer}>
          <div style={styles.text}>
            You received {gift.name}
            <br />
            and <span style={styles.amount}>{gift.amount}</span> ETH
          </div>
          <div style={styles.imageContainer}>
            <TokenImage url={gift.image} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedReceivedScreen;
