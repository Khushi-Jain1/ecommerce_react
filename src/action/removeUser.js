import { REMOVE_USER } from "./constants";

const removeUser = (user) => {
  return {
    type: REMOVE_USER,
  };
};

export default removeUser;
