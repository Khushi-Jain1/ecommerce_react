import changeTabReducer from "./changeTabReducer";
import setUserReducer from "./userReducer";
import PriceRangeReducer from "./priceRangeReducer";
import searchedTextReducer from "./seachedTextReducer";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
    changeTabReducer, 
    setUserReducer,
    PriceRangeReducer,
    searchedTextReducer,
})