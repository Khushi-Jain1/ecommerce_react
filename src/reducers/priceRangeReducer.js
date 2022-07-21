import { initialState } from "./initialState";
import { PRICE_RANGE } from '../action/constants';
  
const PriceRangeReducer = (state = initialState, action) => {
    switch (action.type) {
      case PRICE_RANGE:
        return {
          ...state,
          min: action.range.min,
          max: action.range.max,
        };
      default:
        return state;
    }
  };


export default PriceRangeReducer;
