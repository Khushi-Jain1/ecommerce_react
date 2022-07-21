import { initialState } from "./initialState";
import { REMOVE_USER, SET_USER } from '../action/constants';

const setUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        username: action.user.username,
        user_id: action.user.id,
        loggedIn: true,
      };
    case REMOVE_USER:
      return {
        ...state,
        username: null,
        user_id: null,
        loggedIn: false,
      };
    default:
      return state;
  }
};

export default setUserReducer;
