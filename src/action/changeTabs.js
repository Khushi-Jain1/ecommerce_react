import { CHANGE_TAB } from "./constants";

const ChangeTabs = (newTab, key) => {
  return {
    type: CHANGE_TAB,
    newTab: newTab,
    data: typeof(key) != null ? key : null,
  };
};

export default ChangeTabs;
