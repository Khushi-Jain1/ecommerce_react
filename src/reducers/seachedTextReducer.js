import { initialState } from "./initialState";
import { SEARCH_ITEM } from '../action/constants';
  
const searchedTextReducer = (state = initialState, action) => {
    switch (action.type) {
      case SEARCH_ITEM:
        return {
          ...state,
          searchedText: action.searchText,
        };
      default:
        return state;
    }
  };


export default searchedTextReducer;
