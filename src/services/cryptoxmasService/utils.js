

export function getCategoryNameById(catId) {
  let catName;
    switch (String(catId)) {
    case "1":
	catName = "Special";
	break;
    case "2":
	catName = "Rare";
	break;
    case "3":
	catName = "Scarce";
	break;
    case "4":
	catName = "Limited";
	break;
    case "5":
	catName = "Epic";
	break;
    case "6":
      catName = "Unique";
      break;		
    default:
      catName = `Unknown network`;
  }
  return catName;
}
