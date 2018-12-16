export default {
  nftContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "auto",
    width: 170,
    height: 170,
    backgroundColor: "white",
    backgroundImage:
      "url(https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/nft_border.png)",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderRadius: 5,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    marginBottom: 30
  },
  nftPrice: {
    textAlign: "right",
    color: "#4CD964",
    fontFamily: "Inter UI Bold",
    fontSize: 14
  },
  nftPriceContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 10px 0px 10px"
  },
  nftRarity: {
    display: "inline",
    textAlign: "center",
    fontFamily: "Inter UI Medium",
    fontSize: 11,
    textTransform: "capitalize",
    padding: "3px 7px",
    borderRadius: 10,
    color: "white"
  },
  nftImage: {
    display: "block",
    height: 115,
    width: 115
  },
  nftName: {
    textAlign: "center",
    color: "black",
    fontFamily: "Inter UI Bold",
    fontSize: 14,
    height: 20,
    overflow: "hidden"
  },
  homescreenContainer: {
    width: "100%",
    backgroundColor: "#474D5B",
    backgroundImage:
      "url(https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/sparkles_tree.png)",
    backgroundPosition: "right top",
    backgroundRepeat: "no-repeat"
    //
  },
  homescreenContent: {
    maxWidth: 1000,
    margin: "auto",
    height: window.innerHeight
  },
  homescreenTextContainer: {
    width: window.innerWidth > 667 ? 528 : Math.min(354, window.innerWidth),
    margin: "auto",
    marginLeft: window.innerWidth > 667 ? "auto" : 20,
    marginTop: 50,
    textAlign: "left"
  },
  homescreenGreenTitle: {
    marginBottom: 25,
    fontFamily: "Inter UI Medium",
    fontSize: 30,
    color: "#4CD964",
    textAlign: "left"
  },
  homescreenWhiteText: {
    marginLeft: 52,
    marginBottom: 50,
    width: window.innerWidth > 667 ? 402 : 237,
    fontFamily: "Inter UI Regular",
    fontSize: 18,
    color: "white",
    textAlign: window.innerWidth > 667 ? "center" : "left"
  },
  greenContainer: {
    width: 250,
    height: 40,
    textAlign: "center",
    backgroundColor: "#4CD964",
    margin: "auto",
    marginBottom: 20,
    borderRadius: 20,
    fontFamily: "Inter UI Regular",
    fontSize: 20,
    color: "white",
    paddingTop: 5
  },
  groupTitle: {
    margin: "auto",
    marginBottom: 30,
    fontFamily: "Inter UI Medium",
    fontSize: 24,
    textAlign: "left",
    marginBottom: 25,
    width: window.innerWidth > 667 ? "100%" : Math.min(354, window.innerWidth),
    paddingLeft: window.innerWidth > 667 ? 25 : 0,
    color: "#FFF100"
  },
  redDot: {
    display: "inline-block",
    fontSize: 20,
    verticalAlign: "text-bottom",
    paddingTop: 2,
    marginTop: 6,
    marginRight: 20,
    textAlign: "center",
    color: "white",
    width: 32,
    height: 32,
    backgroundColor: "#D9544C",
    borderRadius: 16
  }
};
