import { Divider, message } from "antd";
import "../styles/components/home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import actions from "../action";
import { useDispatch, useSelector } from "react-redux";
import Banners from "./slider";
import Product from "./products";
import Sidebar from "./sidebar";
import { listInstance } from "../services/api";

const Home = ({ ...filters }) => {
  const [category, setCategory] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filter, setFilter] = useState({});
  const searchedText = useSelector(
    (state) => state.searchedTextReducer.searchedText
  );
  const dispatch = useDispatch();

  const handleCategory = () => {
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

  const onFilterReset = () => {
    setFilter({});
    dispatch(actions.SearchItem(null));
  };

  const handleFilter = (value) => {
    var filters = filter;
    if (typeof value == "number") {
      filters = {
        brand: null,
        category: value,
        range: filters?.range,
      };
    }
    if (typeof value == "string") {
      filters = {
        brand: value,
        category: null,
        range: filters?.range,
      };
    }
    if (typeof value == "object") {
      filters = {
        brand: filters?.brand,
        category: filters?.category,
        range: value,
      };
    }
    handleChangeFilters(filters);
  };

  const handleChangeFilters = (value) => {
    setFilter(value);
  };

  const get = () => {
    handleChangeFilters(filters.tab);
    handleCategory();
    handleBrands();
  };
  useEffect(() => {
    get();
  }, []);

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <Banners />
            </div>
          </div>
          <br />
          <br />
          <div className="row">
            <div className="col-sm-3">
              <Sidebar
                handleFilter={handleFilter}
                category={category}
                brands={brands}
                onFilterReset={onFilterReset}
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
      </section>
    </>
  );
};

export default Home;
