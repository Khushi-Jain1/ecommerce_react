import { Card, Image, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {axiosInstance, userInstance} from "../services/api";
import "../styles/components/myOrders.css";
import actions from "../action";
import { BASE_URL } from "../services/config";

const MyOrders = () => {
  const [orders, setOrder] = useState([]);
  const dispatch = useDispatch();

  const getOrders = async () => {
    const token = localStorage.getItem("access_token");
    await axiosInstance
      .get("order/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        response.data.map((item) => {
          const d = new Date(item.order_date);
          item.order_date = d.toLocaleString();
        });
        setOrder(response.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          userInstance
            .post("/auth/refresh/", {
              refresh: localStorage.getItem("refresh_token"),
            })
            .then((result) => {
              localStorage.setItem("access_token", result.data.access);
              getOrders();
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "",
      dataIndex: "image",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Calculated Price",
      dataIndex: "total",
    },
  ];

  useEffect(() => {
    getOrders();
  }, []);
  return (
    <>
      <div className="container">
        {orders?.map((item) => (
          <>
            <div className="card">
              <div className="col-sm-12">
                <Card hoverable key={item.id}>
                  <div className="row card-title my-orders">
                    <div className="col-sm-3">
                      ORDER PLACED <br />
                      {item.order_date}
                    </div>
                    <div className="col-sm-3">
                      {console.log('coupon', item.coupon)}
                      {item.coupon ? (
                        <>
                          COUPON USED <br />
                          {item.coupon}
                        </>
                      ) : null}
                    </div>
                    <div className="col-sm-3">
                      ORDER STATUS <br />
                      {item.status}
                    </div>
                    <div className="col-sm-3">
                      ORDER ID <br />
                      {item.id}
                    </div>
                  </div>
                  {/* <hr /> */}
                  <div className="row card-body">
                    {item.shipping_address == item.billing_address ? (
                      <>
                        <div className="col-sm-3">
                          <b>Shipping and Billing Address</b>
                          <br />
                          {item.shipping_address}
                        </div>
                        <div className="col-sm-3"></div>
                      </>
                    ) : (
                      <>
                        <div className="col-sm-3">
                          <b>Shipping Address</b>
                          <br />
                          {item.shipping_address}
                        </div>
                        <div className="col-sm-3">
                          <b>Billing Address</b>
                          <br />
                          {item.billing_address}
                        </div>
                      </>
                    )}
                    <div className="col-sm-3">
                      <b>Payment Details</b>
                      <br />
                      <span>
                        Payment Mode:{" "}
                        {item.payment.payment_mode == "cod"
                          ? "Cash on Delivery"
                          : "Net banking"}{" "}
                      </span>
                      <br />
                      <span>
                        Payment Status: {item.payment.payment_status}{" "}
                      </span>{" "}
                      <br />
                      {item.payment.payment_mode == "netbanking" ? (
                        <>
                          <span>
                            Transaction Id: {item.payment.transaction_id}{" "}
                          </span>{" "}
                          <br />
                          <span>
                            Account Holder name: {item.payment.name}{" "}
                          </span>{" "}
                        </>
                      ) : null}
                    </div>
                    <div className="col-sm-3">
                      <b>Order Summary</b>
                      <br />
                      <span> Item(s) Subtotal: {item.cart_total} </span>
                      <br />
                      <span> Shipping: {item.shipping_amount} </span>
                      <br />
                      <span> Discount: {item.discount} </span>
                      <br />
                      <span> Grand Total: {item.subtotal} </span>
                      <br />
                    </div>
                  </div>
                  <hr />
                  <div className="row card-body">
                    <div className="col-sm-2">
                      <b>Item</b>
                    </div>
                    <div className="col-sm-2"></div>
                    <div className="col-sm-2">
                      <b>Quantity</b>
                    </div>
                    <div className="col-sm-1"></div>
                    <div className="col-sm-1">
                      <b>Unit Price</b>
                    </div>
                    <div className="col-sm-1"></div>
                    <div className="col-sm-2">
                      <b>Calculated Price</b>
                    </div>
                  </div>
                  <br />
                  {item.products?.map((product) => (
                    <div className="row">
                      <div className="col-sm-2" style={{ paddingLeft: "35px" }}>
                        {product.product_name}
                      </div>
                      <div className="col-sm-2">
                        <Image
                          src={BASE_URL + product.image}
                          height={200}
                          width={200}
                        />
                      </div>
                      <div className="col-sm-2">{product.quantity}</div>
                      <div className="col-sm-1">*</div>
                      <div className="col-sm-1">{product.price}</div>
                      <div className="col-sm-1">=</div>
                      <div className="col-sm-2">
                        {product.quantity * product.price}{" "}
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default MyOrders;
