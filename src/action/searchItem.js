import { SEARCH_ITEM } from "./constants";

const SearchItem = (text) => {
  return {
    type: SEARCH_ITEM,
    searchText: text,
  };
};

export default SearchItem;
