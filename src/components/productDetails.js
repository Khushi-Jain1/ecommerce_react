import {
  message,
  Image,
  Tabs,
  InputNumber,
  Button,
  notification,
  Avatar,
  Comment,
  Form,
  Input,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "../action";
import "../styles/components/productDetails.css";
import Slider from "react-animated-slider";
import Sidebar from "./sidebar";
import Cookies from "universal-cookie/es6";
import { listInstance, axiosInstance, userInstance } from "../services/api";
import { BASE_URL } from "../services/config";

const { TabPane } = Tabs;
const { TextArea } = Input;

const ProductDetails = ({ ...filters }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [product, setProduct] = useState({});
  const [image, setImages] = useState([]);
  const [category, setCategory] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filter, setFilter] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReview] = useState([]);
  const username = useSelector((state) => state.setUserReducer);

  const handleCategory = () => {
    listInstance
      .get("category/")
      .then((response) => {
        setCategory(response.data);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 401) {
          dispatch(actions.removeUser());
          message.error({
            content: "Session Expired",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
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
        console.log(err.response);
        if (err.response.status === 401) {
          dispatch(actions.removeUser());
          message.error({
            content: "Session Expired",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        }
      });
  };
  const getProductDetails = () => {
    listInstance
      .get("product/" + filters.tab + "/")
      .then((response) => {
        setProduct(response.data);
        setImages(response.data.images);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 401) {
          dispatch(actions.removeUser());
          message.error({
            content: "Session Expired",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        }
      });
  };

  const getProductReview = () => {
    listInstance
      .get("product-review/", {
        params: {
          product: filters.tab,
        },
      })
      .then((response) => {
        response.data.map((item) => {
          const d = new Date(item.created_on);
          item.created_on = d.toLocaleString();
          item.avatar = BASE_URL + item.avatar;
        });
        setReview(response.data);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 401) {
          dispatch(actions.removeUser());
          message.error({
            content: "Session Expired",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        }
      });
  };

  const onReset = () => {
    form.resetFields();
  };

  const handleProductReview = async (values) => {
    form.setFieldsValue({
      review: values.review,
    });
    const token = localStorage.getItem("access_token");
    await axiosInstance
      .post(
        "product-review/",
        {
          review: values.review,
          name: username.user_id,
          product: filters.tab,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        onReset();
        getProductReview();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          userInstance
            .post("/auth/refresh/", {
              refresh: localStorage.getItem("refresh_token"),
            })
            .then((result) => {
              localStorage.setItem("access_token", result.data.access);
              handleProductReview(values);
            })
            .catch((err) => {
              dispatch(actions.removeUser());
              dispatch(actions.ChangeTabs(4));
              message.info({
                content: "please login first",
                className: "custom-class",
                style: {
                  marginTop: "20vh",
                },
              });
            });
        }
      });
  };

  const handleFilter = (value) => {
    var filters = filter;
    if (typeof value === "number") {
      filters = {
        brand: null,
        category: value,
        range: filters.range,
      };
    }
    if (typeof value === "string") {
      filters = {
        brand: value,
        category: null,
        range: filters.range,
      };
    }
    if (typeof value === "object") {
      filters = {
        brand: filters.brand,
        category: filters.category,
        range: value,
      };
    }
    setFilter(filters);
    dispatch(actions.ChangeTabs(8, filters));
  };

  const handleCart = () => {
    if (!product.out_of_stock_status) {
      if (username.user_id) {
        const token = localStorage.getItem("access_token");
        axiosInstance
          .post(
            "cart/",
            {
              user: username.user_id,
              product: filters.tab,
              quantity: quantity,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((response) => {})
          .catch((err) => {
            if (err.response.status === 401) {
              userInstance
                .post("/auth/refresh/", {
                  refresh: localStorage.getItem("refresh_token"),
                })
                .then((result) => {
                  localStorage.setItem("access_token", result.data.access);
                  handleCart();
                })
                .catch((err) => {
                  dispatch(actions.removeUser());
                  dispatch(actions.ChangeTabs(4));
                  message.info({
                    content: "please login first",
                    className: "custom-class",
                    style: {
                      marginTop: "20vh",
                    },
                  });
                });
            }
          });
      } else {
        const cookies = new Cookies();
        const cook = cookies.get("cart");
        cook?.length > 0
          ? cook.map((item) => {
              if (item.product === filters.tab) {
                var q = item.quantity + quantity;
                const temp = cook.filter(
                  (item) => item.product !== filters.tab
                );
                cookies.set("cart", [
                  ...temp,
                  { product: filters.tab, quantity: q },
                ]);
              } else {
                cookies.set(
                  "cart",
                  [...cook, { product: filters.tab, quantity: quantity }],
                  { path: "/" }
                );
              }
            })
          : cookies.set(
              "cart",
              [{ product: filters.tab, quantity: quantity }],
              {
                path: "/",
              }
            );
      }
      notification["success"]({
        message: "Added to Cart",
        description: "Product Added to cart",
      });
    } else {
      notification["error"]({
        message: "Out of Stock",
        description: "Product currently not avalilable.",
      });
    }
  };

  const handleWishlist = () => {
    const token = localStorage.getItem("access_token");
    axiosInstance
      .post(
        "wishlist/",
        {
          user: username.user_id,
          product: filters.tab,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          userInstance
            .post("/auth/refresh/", {
              refresh: localStorage.getItem("refresh_token"),
            })
            .then((result) => {
              localStorage.setItem("access_token", result.data.access);
              handleWishlist();
            })
            .catch((err) => {
              dispatch(actions.removeUser());
              dispatch(actions.ChangeTabs(4));
              message.info({
                content: "please login first",
                className: "custom-class",
                style: {
                  marginTop: "20vh",
                },
              });
            });
        }
      });
  };

  useEffect(() => {
    getProductDetails();
    getProductReview();
    handleBrands();
    handleCategory();
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
            />
          </div>
          <div className="col-sm-9">
            <div className="product-details">
              <div className="row">
                <div className="col-sm-5">
                  <div className="view-product">
                    {product?.images ? (
                      <Image src={BASE_URL + product?.images[0]} width={330} />
                    ) : null}
                  </div>
                  <div>
                    {image ? (
                      <Slider autoplay={1000}>
                        {image.map((item) => (
                          <div key={item.id}>
                            {/* <div className="row">
                              <div className='col-sm-'> */}
                            <img
                              style={{ float: "right" }}
                              src={BASE_URL + item}
                              alt=""
                              height={400}
                            />
                            {/* </div>
                            </div> */}
                          </div>
                        ))}
                      </Slider>
                    ) : null}
                  </div>
                </div>
                <div className="col-sm-7">
                  <div className="product-information">
                    <img
                      src="./images/product-details/new.jpg"
                      className="newarrival"
                      alt=""
                    />
                    <h2>{product?.name}</h2>
                    <p>Web ID: {product?.id}</p>
                    {/* <!-- <img src="./images/product-details/rating.png" alt="" /> --> */}
                    <span>
                      <form method="POST" action="">
                        <span className="price">$ {product?.price}</span>
                        <label>Quantity:</label>
                        <InputNumber
                          onChange={(value) => setQuantity(value)}
                          size="large"
                          defaultValue="1"
                          min="1"
                          keyboard={false}
                        />
                        <Button
                          type="primary"
                          className="get"
                          onClick={handleCart}
                        >
                          Add to cart
                        </Button>
                        <Button
                          type="primary"
                          onClick={handleWishlist}
                          className="get"
                        >
                          Add to wishlist
                        </Button>
                      </form>
                    </span>
                    <p>
                      <b>Availability:</b>
                      {product?.out_of_stock_status ? (
                        <span style={{ color: "red" }}>
                          {" "}
                          &nbsp; Out of Stock
                        </span>
                      ) : (
                        " In Stock"
                      )}
                      {/* {if (product?.out_of_stock_status) %} Out of stock 
                {% else %} In Stock {% endif %} */}
                    </p>
                    <p>
                      <b>Condition:</b> New
                    </p>
                    <p>
                      <b>Brand:</b> {product?.brand}
                    </p>
                    <a href="">
                      {/* <!-- <img
                  src="./images/product-details/share.png"
                  className="share img-responsive"
                  alt=""
              /> --> */}
                    </a>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="card-container">
                  <Tabs type="card">
                    <TabPane tab="Details" key="1">
                      <p>{product?.description}</p>
                    </TabPane>
                    <TabPane tab="Company Profile" key="2">
                      <p>{product?.brand} </p>
                    </TabPane>
                    <TabPane tab="Tag" key="3">
                      <ul>
                        {product?.attributes?.map((item) => (
                          <li>
                            {" "}
                            <b> {item?.attribute} </b> :{" "}
                            {item.values.map((value) => (
                              <span> {value} |&nbsp; </span>
                            ))}{" "}
                          </li>
                        ))}
                      </ul>
                    </TabPane>
                    <TabPane tab="Reviews" key="4">
                      {reviews.map((item) => (
                        <Comment
                          author={<a>{item.username}</a>}
                          avatar={
                            <Avatar src={item.avatar} alt={item.username} />
                          }
                          content={<p>{item.review}</p>}
                          datetime={item.created_on}
                        />
                      ))}
                      {username.user_id ? (
                        <>
                          <Form
                            layout="vertical"
                            form={form}
                            onFinish={handleProductReview}
                          >
                            <Form.Item name="review">
                              <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item>
                              <Button type="primary" htmlType="submit">
                                Add review
                              </Button>
                            </Form.Item>
                          </Form>
                        </>
                      ) : null}
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
