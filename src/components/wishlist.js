import { Table, Button, message, Image, Breadcrumb } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "../action";
import { CloseOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { axiosInstance, userInstance } from "../services/api";
import { BASE_URL } from "../services/config";

const Wishlist = () => {
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState([]);
  const username = useSelector((state) => state.setUserReducer);

  const handleWishlist = () => {
    const token = localStorage.getItem("access_token");
    axiosInstance
      .get("wishlist/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setWishlist(response.data);
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
        } else {
          console.log(err.response);
        }
      });
  };

  useEffect(() => {
    handleWishlist();
  }, []);

  const dataSource = [];
  for (let i = 0; i < wishlist.length; i++) {
    dataSource.push({
      key: wishlist[i].id,
      name: wishlist[i].name,
      image: <Image width={150} src={BASE_URL + wishlist[i].image} />,
      price: "$ " + wishlist[i].price,
      cart: (
        <Button
          type="default"
          icon={<ShoppingCartOutlined />}
          key={wishlist[i].id}
          onClick={() => addToCart(wishlist[i].product)}
        />
      ),
      delete: (
        <Button
          type="primary"
          className="get"
          icon={<CloseOutlined />}
          key={wishlist[i].id}
          onClick={() => removeProduct(wishlist[i].id)}
        />
      ),
    });
  }

  const removeProduct = (value) => {
    const token = localStorage.getItem("access_token");
    axiosInstance
      .delete("wishlist/" + value + "/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        handleWishlist();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          userInstance
            .post("/auth/refresh/", {
              refresh: localStorage.getItem("refresh_token"),
            })
            .then((result) => {
              localStorage.setItem("access_token", result.data.access);
              removeProduct(value);
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

  const addToCart = (value) => {
    const token = localStorage.getItem("access_token");
    axiosInstance
      .post(
        "cart/",
        {
          user: username.user_id,
          product: value,
          quantity: 1,
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
              addToCart(value);
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

  const columns = [
    {
      title: "Item",
      dataIndex: "name",
      key: "name",
      width: 300,
    },
    {
      title: "",
      dataIndex: "image",
      key: "image",
      width: 200,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 200,
    },
    {
      title: "",
      dataIndex: "cart",
      key: "cart",
      width: 200,
    },
    {
      title: "",
      dataIndex: "delete",
      key: "delete",
      width: 150,
    },
  ];
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Wishlist</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-sm-12">
            <Table dataSource={dataSource} columns={columns} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
