export default {
  row: {
    height: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    margin: "auto",
    marginBottom: 25
  },
  colVertAlign: {
    height: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  amount: {
    textAlign: "left",
    fontSize: 20,
    fontFamily: "Inter UI Medium",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    textTransform: "capitalize"
  },
  statusCellContainer: {},
  transfer: {
    color: "white",
    display: "inline",
    marginLeft: 10
  },
  directionIcon: {
    display: "inline",
    width: "unset",
    marginLeft: 12,
    marginRight: 4,
    paddingBottom: 3
  },
  statusCell: {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    statusText: {
      fontSize: 18,
      fontFamily: "Inter UI Medium",
      color: "#aaa"
    },
    pendingStatusText: {
      fontSize: 18,
      color: "#aaa",
      fontFamily: "Inter UI Medium"
    },
    infoIcon: {
      border: "1px solid white",
      color: "black",
      backgroundColor: "white",
      borderRadius: 12,
      textAlign: "center",
      lineHeight: 1,
      fontSize: 16,
      paddingLeft: 8,
      paddingRight: 8,
      fontFamily: "Inter UI Medium",
      verticalAlign: "text-top"
    },
    arrow: {
      display: "inline",
      width: "unset",
      marginLeft: 12,
      marginRight: 4,
      paddingBottom: 3
    }
  },
  screen: { minHeight: 600, paddingTop: 50 },
  transfers: {
    fontSize: 24,
    fontFamily: "SF Display Black",
    marginBottom: 30,
    color: "white"
  },
  noTransfersContainer: { textAlign: "center", marginTop: 100 },
  illustration: { width: "unset", marginBottom: 10 },
  illustrationText: {
    fontSize: 24,
    fontFamily: "SF Display Bold",
    color: "white"
  },
  sendscreenGreenTitle: {
    marginBottom: 20,
    fontFamily: "Inter UI Medium",
    fontSize: 30,
    color: "#4CD964",
    textAlign: "left"
  },
  textContainer: {
    width: 354,
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    marginTop: 50,
    textAlign: "left"
  },
  greenTitle: {
    fontFamily: "Inter UI Medium",
    fontSize: 30,
    color: "#4CD964",
    textAlign: "left"
  },
  whiteTitle: {
    fontFamily: "Inter UI Medium",
    fontSize: 24,
    color: "white",
    textAlign: "left"
  },
  greyText: {
    fontFamily: "Inter UI Regular",
    fontSize: 18,
    color: "#8B8B8B",
    textAlign: "left",
    marginBottom: 40
  },
  gifContainer: {
    display: "block",
    margin: "auto",
    height: 200,
    width: 200
  },
  tokenBorder: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: 300,
    height: 300,
    backgroundColor: "white",
    backgroundImage:
      "url(https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/nft_border.png)",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: 280,
    borderRadius: 5,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  tokenImage: {},
  grinchText: {
    display: "block",
    textAlign: "center",
    fontFamily: "Inter UI Regular",
    fontSize: 18,
    color: "#4CD964",
    marginTop: 10
  }
};
