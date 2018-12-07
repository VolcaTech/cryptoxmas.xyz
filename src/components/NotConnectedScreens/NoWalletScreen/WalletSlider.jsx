import React from "react";
import Slider from "react-slick";
import RetinaImage from "react-retina-image";
import wallets from "./wallets";
import { getDeviceOS } from "../../../utils";
import styles from "./../styles";

const NextArrow = props => {
  const { onClick } = props;
  return (
    <div
      style={
        window.innerWidth > 320
          ? styles.walletSliderNextArrow
          : { ...styles.walletSliderNextArrow, top: 20 }
      }
      onClick={onClick}
    >
      <RetinaImage src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/right_arrow.png" />
    </div>
  );
};

const PreviousArrow = props => {
  return <div />;
};

class WalletSlider extends React.Component {
  render() {
    const settings = {
      arrows: true,
      padding: 7,
      nextArrow: <NextArrow />,
      prevArrow: <PreviousArrow />,
      fontSize: 10,
      slidesToShow: 4,
      slidesToScroll: 4
    };

    const deviceOS = getDeviceOS();

    return (
      <div style={{ padding: 10, paddingBottom: 50 }}>
        <div style={styles.walletSliderTitle}>Choose another wallet:</div>
        <Slider {...settings}>
          {Object.keys(wallets)
            .map(walletId => wallets[walletId])
            .filter(wallet => {
              return wallet.mobile[deviceOS] && wallet.mobile[deviceOS].support;
            })
            .map(wallet => {
              return (
                <WalletButtonContainer
                  key={wallet.id}
                  wallet={wallet}
                  selectWallet={this.props.selectWallet}
                />
              );
            })}
        </Slider>
      </div>
    );
  }
}

const WalletButtonContainer = ({ wallet, selectWallet }) => {
  let logoStyle;
  if (window.innerWidth > 320) {
    logoStyle = styles.walletSliderLogo;
  } else {
    logoStyle = styles.walletSliderLogo5;
  }

  const walletIcon = `https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/${
    wallet.id
  }.png`;

  return (
    <RetinaImage
      onClick={() => selectWallet(wallet.id)}
      className="img-responsive"
      style={logoStyle}
      src={walletIcon}
    />
  );
};

export default WalletSlider;
