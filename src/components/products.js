import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "../action";
import { listInstance } from "../services/api";
import { BASE_URL } from "../services/config";
import "../styles/components/products.css";

const Product = (filters) => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  const searchedText = useSelector(
    (state) => state.searchedTextReducer.searchedText
  );

  const handleProducts = () => {
    listInstance
      .get("product/")
      .then((response) => {
        var product = response.data;
        if (searchedText) {
          let str;
          product = response.data.filter(function (l) {
            str = `${l.name}# ${l.brand}`;
            return str.toLowerCase().match(searchedText);
          });
          setProducts(product);
        } else if (filters.filter?.brand) {
          product = filters.filter.brand
            ? response.data.filter(
                (item) =>
                  item.brand
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/[^\w-]+/g, "") === filters.filter.brand
              )
            : product;
        } else if (filters.filter?.category) {
          product = filters.filter.category
            ? response.data.filter(
                (item) => item.category === filters.filter.category
              )
            : product;
        }
        product = filters.filter.range
          ? product
              .filter((item) => item.price >= filters.filter?.range[0])
              .filter((item) => item.price <= filters.filter?.range[1])
          : product;
        setProducts(product);
      })
      .catch((err) => {});
  };

  const handleProductDetails = (key) => {
    dispatch(actions.ChangeTabs(7, key));
  };

  useEffect(() => {
    handleProducts();
  }, [filters, searchedText]);

  return (
    <>
      <div className="container">
        <div className="row">
          {products.map((product) => (
            <div
              className="col-sm-4"
              key={product.id}
              onClick={() => handleProductDetails(product.id)}
            >
              <div className="product-image-wrapper">
                <div className="single-products">
                  <div className="productinfo text-center">
                    <img src={BASE_URL + product.images[0]} alt="" />
                    <h2> $ {product.price}</h2>
                    <p>{product.name}</p>
                  </div>
                  <div className="product-overlay">
                    <div className="overlay-content">
                      <h2> $ {product.price}</h2>
                      <p>{product.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Product;
