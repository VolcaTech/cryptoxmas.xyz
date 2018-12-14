export default {
  nftContainer: {
    display: "flex",
    flexDirection: "column",
      alignItems: "center",
      margin:'auto',
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
    width: "100%",
    margin: "8px 25px 0px 0px",
    textAlign: "right",
    color: "#4CD964",
    fontFamily: "Inter UI Bold",
    fontSize: 14
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
      overflow: 'hidden'
  },
  homescreenContainer: {
      width: "100%",
      backgroundColor: "#474D5B",
      backgroundImage:
      "url(https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/sparkles_tree.png)",
      backgroundPosition: "right top",
      backgroundRepeat: "no-repeat",
      //
  },
  homescreenContent: {
      maxWidth: 1000,
      margin: 'auto',
      height: window.innerHeight,
  },    
  homescreenTextContainer: {
      width: (window.innerWidth > 667 ? '100%': Math.min(354, window.innerWidth)),
      margin: "auto",
      marginTop: 50,
      textAlign: "left",      
  },
  homescreenGreenTitle: {
    marginBottom: 25,
    fontFamily: "Inter UI Medium",
    fontSize: 30,
    color: "#4CD964",
      textAlign: (window.innerWidth > 667 ? 'center': 'left'),
  },
  homescreenGreyText: {
      marginBottom: 50,
      fontFamily: "Inter UI Regular",
      fontSize: 18,
      color: "#8B8B8B",
      textAlign: (window.innerWidth > 667 ? 'center': 'left'),
  },
  homescreenWhiteTitle: {
      marginBottom: 20,
      fontFamily: "Inter UI Medium",
      fontSize: 24,
      color: "white",
      paddingLeft: (window.innerWidth > 667 ? 40: 0),
  },
    groupTitle: {
	margin: "auto",
	marginBottom: 30,
	fontFamily: "Inter UI Medium",
	fontSize: 24,
	textAlign: "left",
	marginBottom: 25,
	width: (window.innerWidth > 667 ? '100%': Math.min(354, window.innerWidth)),
	paddingLeft: (window.innerWidth > 667 ? 25: 0),
	color: "#FFF100"  
    },

};
