import React from "react";
import copy from "copy-to-clipboard";
import ButtonPrimary from "./../common/ButtonPrimary";
const HOST = "https://app.cryptoxmas.xyz";
const shareIcon = require("../../../public/images/share_icon.png");
import { getCurrentWalletId } from "../../utils";
import web3Service from "./../../services/web3Service";
import styles from "./styles";

export const getEtherscanLink = ({ txHash, networkId }) => {
  let subdomain = "";
  if (networkId === "3") {
    subdomain = "ropsten.";
  }
  const etherscanLink = `https://${subdomain}etherscan.io/tx/${txHash}`;
  return etherscanLink;
};

export const ShareButton = ({ transfer }) => {
  let shareLink;

  shareLink = `${HOST}/#/r?pk=${transfer.transitPrivateKey}`;

  if (transfer.networkId !== "1") {
    shareLink += `&n=${transfer.networkId}`;
  }

  // get current wallet id
  const web3 = web3Service.getWeb3();
  const currentWalletId = getCurrentWalletId(web3);

  if (currentWalletId !== "other") {
    shareLink += `&w=${currentWalletId}`;
  }

  return (
    <div style={styles.shareLinkContainer}>
      <ButtonPrimary
        handleClick={() => {
          // copy share link to clipboard
          copy(shareLink);
          alert(
            "The link is copied to your clipboard. Share the link with receiver"
          );
        }}
      >
        <span>Copy & Share Link</span>
        <img
          src={shareIcon}
          style={styles.shareIcon}
          className="hidden-iphone5"
        />
      </ButtonPrimary>
    </div>
  );
};
