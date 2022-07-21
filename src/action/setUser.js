import { SET_USER } from "./constants";

const setUser = (user) => {
  return {
    type: SET_USER,
    user: user,
  };
};

export default setUser;
