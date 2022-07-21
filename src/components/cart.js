import {
  Table,
  Button,
  message,
  Image,
  InputNumber,
  Breadcrumb,
  Spin,
  Form,
  Input,
  Typography,
  Select,
  Card,
  notification,
  Drawer,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "../action";
import { CloseOutlined, SketchSquareFilled } from "@ant-design/icons";
import Cookies from "universal-cookie/es6";
import "../styles/components/cart.css";
import { listInstance, userInstance, axiosInstance } from "../services/api";
import { BASE_URL } from "../services/config";

const { Text } = Typography;
const { Option } = Select;

const Cart = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);
  const username = useSelector((state) => state.setUserReducer);
  const [cartTotal, setCartTotal] = useState(0);
  const [shipping, setShipping] = useState(50);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [address, setAddress] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [checkout, setCheckout] = useState(true);

  const columns = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      width: 200,
    },
    {
      title: "Item",
      dataIndex: "name",
      key: "name",
      width: 300,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 200,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 200,
    },
    {
      title: "",
      dataIndex: "delete",
      key: "delete",
      width: 150,
    },
  ];

  const handleCart = () => {
    if (username.user_id) {
      const token = localStorage.getItem("access_token");
      axiosInstance
        .get("cart/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCart(getData(response.data));
          var cart = 0;
          for (var i = 0; i < response.data.length; i++) {
            cart = cart + response.data[i].price * response.data[i].quantity;
          }
          setCartTotal(cart);
          var shipping_amount = cart >= 500 ? 0 : 50;
          setShipping(shipping_amount);
          setTotal(cart + shipping_amount);
          setLoading(false);
        })
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
      refreshCart();
      var cart = 0;
      cook?.map((item) => {
        listInstance
          .get("product/" + item.product + "/")
          .then((res) => {
            setCart((prev) => [
              ...prev,
              {
                key: item.product,
                image: (
                  <Image width={150} src={BASE_URL + res.data.images[0]} />
                ),
                name: res.data.name,
                price: "$ " + res.data.price,
                quantity: (
                  <>
                    <InputNumber
                      defaultValue={item.quantity}
                      min={0}
                      onChange={(value) => handleChange(value, item.product)}
                    />
                    <br />
                    {item.quantity > res.data.quantity ? (
                      <span className="quantity-error">Out of Stock</span>
                    ) : null}
                  </>
                ),
                delete: (
                  <Button
                    type="primary"
                    className="get"
                    icon={<CloseOutlined />}
                    key={item.product}
                    onClick={() => removeProduct(item.product)}
                  />
                ),
              },
            ]);
            cart = cart + res.data.price * item.quantity;
            setCartTotal(cart);
            var shipping_amount = cart >= 500 ? 0 : 50;
            setShipping(shipping_amount);
            setTotal(cart + shipping_amount);
          })
          .catch((err) => {
            // if (err.response.status === 401) {
            //   dispatch(actions.removeUser());
            //   dispatch(actions.ChangeTabs(4));
            //   message.info({
            //     content: "please login first",
            //     className: "custom-class",
            //     style: {
            //       marginTop: "20vh",
            //     },
            //   });
            // }
          });
      });
    }
  };

  const handleCoupon = (values) => {
    if (username.user_id) {
      const token = localStorage.getItem("access_token");
      axiosInstance
        .get("coupon/", {
          params: { coupon_code: values.coupon, total_amount: cartTotal },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.error) {
            setError(response.data.error);
          } else {
            setError("");
            setDiscount(response.data?.discount);
            const shipping_amount = response.data.free_shipping ? 0 : 50;
            setShipping(shipping_amount);
            setTotal(cartTotal + shipping_amount - response?.data.discount);
            setCoupon(response.data.coupon);
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            userInstance
              .post("/auth/refresh/", {
                refresh: localStorage.getItem("refresh_token"),
              })
              .then((result) => {
                localStorage.setItem("access_token", result.data.access);
                handleCoupon(values);
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
      errorNotification("Please Login/Register first to apply any coupon");
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setDiscount(0);
    cartTotal >= 500 ? setShipping(0) : setShipping(50);
  };

  const refreshCart = () => {
    setCart([]);
  };

  const getData = (data) => {
    const dataSource = [];
    var row = data.filter((item) => item.out_of_stock == true);
    row.length > 0 ? setCheckout(false) : setCheckout(true);
    data.map((item) => {
      dataSource.push({
        key: item.id,
        image: <Image width={150} src={BASE_URL + item.image} />,
        name: item.name,
        price: "$ " + item.price,
        quantity: (
          <>
            <InputNumber
              defaultValue={item.quantity}
              onChange={(value) => handleChange(value, item.id, item.product)}
              min={0}
            />
            <br />
            {item.out_of_stock ? (
              <span className="quantity-error">Out of Stock</span>
            ) : null}
          </>
        ),
        delete: (
          <Button
            type="primary"
            className="get"
            icon={<CloseOutlined />}
            key={item.id}
            onClick={() => removeProduct(item.id)}
          />
        ),
      });
    });
    return dataSource;
  };

  const handleChange = (value, key, product) => {
    if (username.user_id) {
      const token = localStorage.getItem("access_token");
      if (value > 0) {
        axiosInstance
          .put(
            "cart/" + key + "/",
            {
              quantity: value,
              product: product,
              user: username.user_id,
            }
            // {
            //   headers: { Authorization: `Bearer ${token}` },
            // }
          )
          .then((response) => {
            handleCart();
          })
          .catch((err) => {
            if (err.response.status === 401) {
              userInstance
                .post("/auth/refresh/", {
                  refresh: localStorage.getItem("refresh_token"),
                })
                .then((result) => {
                  localStorage.setItem("access_token", result.data.access);
                  handleChange(value, key, product);
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
        removeProduct(key);
      }
    } else {
      if (value > 0) {
        const cookies = new Cookies();
        const cook = cookies.get("cart");
        var updatedCart = cook.filter((item) => item.product !== key);
        updatedCart = [...updatedCart, { product: key, quantity: value }];
        cookies.set("cart", updatedCart, { path: "/" });
        handleCart();
      } else {
        removeProduct(key);
      }
    }
  };

  const removeProduct = (key) => {
    if (username.user_id) {
      const token = localStorage.getItem("access_token");
      axiosInstance
        .delete("cart/" + key + "/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          handleCart();
        })
        .catch((err) => {
          userInstance
            .post("/auth/refresh/", {
              refresh: localStorage.getItem("refresh_token"),
            })
            .then((result) => {
              localStorage.setItem("access_token", result.data.access);
              removeProduct(key);
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
        });
    } else {
      const cookies = new Cookies();
      const cook = cookies.get("cart");
      cookies.set(
        "cart",
        cook.filter((item) => item.product !== key)
      );
      handleCart();
    }
  };

  const handleAddress = async () => {
    const token = localStorage.getItem("access_token");
    await axiosInstance
      .get("address/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // setAddress(response.data);
        const children = [];
        for (var i = 0; i < response.data.length; i++) {
          var data = response.data[i];
          children.push(
            <Option value={data.id} key={data.id}>
              <b>{data.name}</b>, {data.address_line1} {data.address_line2}{" "}
              {data.city} {data.state} {data.country}, {data.pincode}
            </Option>
          );
        }
        setAddress(children);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          userInstance
            .post("/auth/refresh/", {
              refresh: localStorage.getItem("refresh_token"),
            })
            .then((result) => {
              localStorage.setItem("access_token", result.data.access);
              handleAddress();
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

  const errorNotification = (message) => {
    notification["error"]({
      message: "Error",
      description: message,
    });
  };

  const handleCheckout = () => {
    if (username.user_id) {
      if (checkout) {
        handleAddress();
        setVisible(true);
      } else {
        errorNotification("Product not available");
      }
    } else {
      errorNotification("Kindly Login/Register for checkout");
    }
  };

  const handleShippingAddress = (value) => {
    form.setFieldsValue({
      shippingAddress: value,
    });
  };

  const handleBillingAddress = (value) => {
    form.setFieldsValue({
      billingAddress: value,
    });
  };

  const placeOrder = async (values) => {
    const token = localStorage.getItem("access_token");
    await axiosInstance
      .post(
        "order/",
        {
          shipping_address: values.shippingAddress,
          billing_address: values.billingAddress,
          coupon: coupon,
          discount: discount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        onClose();
        var tab = {
          cartTotal: cartTotal,
          total: total,
          discount: discount,
          shipping_amount: shipping,
          order_id: response.data.order_id,
        };
        dispatch(actions.ChangeTabs(3, tab));
      })
      .catch((err) => {
        if (err.response.status === 401) {
          userInstance
            .post("/auth/refresh/", {
              refresh: localStorage.getItem("refresh_token"),
            })
            .then((result) => {
              localStorage.setItem("access_token", result.data.access);
              placeOrder(values);
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
        } else {
          console.log(err.response);
        }
      });
  };

  const onClose = () => {
    form.resetFields();
    setVisible(false);
  };
  useEffect(() => {
    handleCart();
  }, []);

  return (
    <>
      <Spin spinning={loading}>
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Cart</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-sm-12">
              <Table
                dataSource={cart}
                columns={columns}
                pagination={{ position: ["none", "none"] }}
              />
            </div>
          </div>
          {cart.length > 0 ? (
            <div className="row">
              <div className="col-sm-6">
                <Card hoverable className="coupon-card">
                  <Form className="coupon-form" onFinish={handleCoupon}>
                    <b>Redeem Coupon</b>
                    <div className="row">
                      <div className="col-sm-4">
                        {coupon ? (
                          <Form.Item name="coupon_name">
                            <Input placeholder={coupon} disabled={true} />
                          </Form.Item>
                        ) : (
                          <Form.Item name="coupon">
                            <Input placeholder="Coupon code" />
                          </Form.Item>
                        )}
                      </div>
                      <div className="col-sm-3">
                        {coupon ? (
                          <Form.Item>
                            <Button type="primary" onClick={removeCoupon}>
                              Cancel Coupon
                            </Button>
                          </Form.Item>
                        ) : null}
                        {coupon ? null : (
                          <Form.Item>
                            <Button type="primary" htmlType="submit">
                              Apply Coupon
                            </Button>
                          </Form.Item>
                        )}
                      </div>
                    </div>
                    {error ? <Text type="danger"> {error} </Text> : null}
                  </Form>
                </Card>
              </div>
              <div className="col-sm-6">
                <div className="bill">
                  <Card hoverable>
                    <div className="bill-item">
                      l<p className="bill-item-left">Cart Sub Tota</p>
                      <p className="bill-item-right"> $ {cartTotal}</p>
                    </div>
                    <div className="bill-item">
                      t<p className="bill-item-left">Shipping Cos</p>
                      <p className="bill-item-right"> + $ {shipping}</p>
                    </div>
                    {discount ? (
                      <div className="bill-item">
                        t<p className="bill-item-left">Discoun</p>
                        <p className="bill-item-right"> - $ {discount}</p>
                      </div>
                    ) : null}
                    <div className="bill-item">
                      l<p className="bill-item-left">Tota</p>
                      <p className="bill-item-right"> $ {total}</p>
                    </div>
                    {/* {username.user_id ? null : ( */}
                    <Button
                      onClick={handleCheckout}
                      type="primary"
                      className="checkout-button"
                    >
                      Checkout
                    </Button>
                    {/* )} */}
                  </Card>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <Drawer
          title="Select Address"
          placement="right"
          onClose={onClose}
          visible={visible}
          width={640}
        >
          <div className="address-form">
            <Form form={form} layout="vertical" onFinish={placeOrder}>
              <Form.Item
                name="shippingAddress"
                label="Shipping Address"
                required
              >
                <Select
                  // placeholder="Tags Mode"
                  onChange={handleShippingAddress}
                >
                  {address}
                </Select>
                <Button
                  type="link"
                  onClick={() => dispatch(actions.ChangeTabs(9))}
                >
                  Add Address
                </Button>
              </Form.Item>
              <Form.Item name="billingAddress" label="Billing Address" required>
                <Select
                  // placeholder="Tags Mode"
                  onChange={handleBillingAddress}
                >
                  {address}
                </Select>
                <Button
                  type="link"
                  onClick={() => dispatch(actions.ChangeTabs(9))}
                >
                  Add Address
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ float: "right" }}
                >
                  Place Order
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Drawer>
      </Spin>
    </>
  );
};

export default Cart;
