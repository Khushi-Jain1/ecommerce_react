import { PRICE_RANGE } from "./constants";

const priceRange = (range) => {
  return {
    type: PRICE_RANGE,
    range: range,
  };
};

export default priceRange;
