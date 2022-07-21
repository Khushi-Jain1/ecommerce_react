import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import actions from "../action";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Divider, message } from "antd";
import Product from "./products";
import "../styles/components/shop.css";
import { listInstance } from "../services/api";

const Shop = ({ ...filters }) => {
  const [filter, setFilter] = useState({});
  const [category, setCategory] = useState([]);
  const [brands, setBrands] = useState([]);

  const searchedText = useSelector(
    (state) => state.searchedTextReducer.searchedText
  );

  const dispatch = useDispatch();
  const handleCategory = () => {
    // const token = localStorage.getItem("access_token");
    listInstance
      .get("category/")
      .then((response) => {
        setCategory(response.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(actions.removeUser());
          message.error({
            content: "Session Expired",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        } else {
          console.log(err.response);
        }
      });
  };

  const handleBrands = () => {
    listInstance
      .get("brand/")
      .then((response) => {
        setBrands(response.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(actions.removeUser());
          message.error({
            content: "Session Expired",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        } else {
          console.log(err.response);
        }
      });
  };

  const handleFilter = (value) => {
    var temp = filter;
    if (typeof value == "number") {
      temp = {
        brand: null,
        category: value,
        range: temp?.range,
      };
    }
    if (typeof value == "string") {
      temp = {
        brand: value,
        category: null,
        range: temp?.range,
      };
    }
    if (typeof value == "object") {
      temp = {
        brand: temp?.brand,
        category: temp?.category,
        range: value,
      };
    }
    handleChangeFilters(temp);
  };

  const handleChangeFilters = (value) => {
    dispatch(actions.SearchItem(null));
    setFilter(value);
  };

  const onFilterReset = () => {
    setFilter({});
    dispatch(actions.SearchItem(null));
  };

  useEffect(() => {
    handleBrands();
    handleCategory();
    handleChangeFilters(filters.tab);
  }, []);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <Sidebar
              handleFilter={handleFilter}
              category={category}
              brands={brands}
              onFilterReset={onFilterReset}
              // handleSearch = {handleSearch}
            />
          </div>
          <div className="col-sm-9 padding-right" id="products">
            <div className="features_items">
              <Divider>
                <h2 className="title text-center">
                  {filter?.brand
                    ? filter.brand
                    : filter?.category
                    ? category.filter((item) => item.id == filter.category)[0]
                        .name
                    : searchedText
                    ? "Searched Items"
                    : "Featured Items"}
                </h2>
              </Divider>
              <Product filter={filter} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
