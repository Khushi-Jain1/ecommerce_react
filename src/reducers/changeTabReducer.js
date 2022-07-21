import { initialState } from "./initialState";
import { CHANGE_TAB } from '../action/constants';
  
const changeTabReducer = (state = initialState, action) => {
    switch (action.type) {
      case CHANGE_TAB:
        return {
          ...state,
          currentTab: action.newTab,
          key: action.data,
        };
      default:
        return state;
    }
  };


export default changeTabReducer;
