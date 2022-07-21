import { useState, useEffect, useRef } from "react";
import {
  Spin,
  Breadcrumb,
  Table,
  message,
  Image,
  InputNumber,
  Button,
  Form,
  Input,
  Typography,
  Select,
  Card,
  Result,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import action from "../action";
import { axiosInstance, userInstance } from "../services/api";
import { CloseCircleOutlined } from "@ant-design/icons";
import "../styles/components/checkout.css";

const { Text, Paragraph } = Typography;
const { Option } = Select;

const Checkout = ({ ...filters }) => {
  const dispatch = useDispatch();
  const paypal = useRef();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handlePayment = (payment_method, tab) => {
    const token = localStorage.getItem("access_token");
    axiosInstance
      .get("payment/", {
        params: {
          order_id: filters.tab.order_id,
          payment_method: payment_method,
          transaction_id: tab?.transaction_id,
          status: tab?.status,
          email: tab?.email,
          name: tab?.payment_method,
        },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSuccess(true);
      })
      .catch((err) => {
        setError(true);
        if (err.response.status === 401) {
          userInstance
            .post("/auth/refresh/", {
              refresh: localStorage.getItem("refresh_token"),
            })
            .then((result) => {
              localStorage.setItem("access_token", result.data.access);
              handlePayment(payment_method, tab);
            })
            .catch((err) => {
              dispatch(action.removeUser());
              dispatch(action.ChangeTabs(4));
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
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: filters?.tab?.total,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(order);
          setSuccess(true);
          const tab = {
            transaction_id: order.id,
            status: order.status,
            email: order.payer.email_address,
            name: order.payer.name.given_name + " " + order.payer.name.surname,
          };
          handlePayment("netbanking", tab);
        },
        onError: (err) => {
          console.error(err);
          setError(true);
        },
      })
      .render(paypal.current);
  }, []);

  return (
    <>
      {success ? (
        <Result
          status="success"
          title="Order Placed Successfully"
          subTitle={"Order number: " + filters.tab.order_id}
          extra={[
            <Button
              onClick={() => dispatch(action.ChangeTabs(6))}
              type="primary"
            >
              Continue Shopping
            </Button>,
          ]}
        />
      ) : error ? (
        <Result
          status="error"
          title="Oh no, Your Payment Failed"
          subTitle={"Order Id " + filters.tab.order_id}
          extra={[
            <Button onClick={() => dispatch(action.ChangeTabs(6))}>
              Continue Shopping
            </Button>,
          ]}
        ></Result>
      ) : (
        <div className="container">
          <b>Place Order</b>
          <div className="row">
            <div className="col-sm-6">
              <div className="bill">
                <Card hoverable>
                  <div ref={paypal}> </div>
                  <div>
                    <Button
                      type="primary"
                      className="cod"
                      onClick={() => handlePayment("cod")}
                    >
                      Cash on delivery
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="bill">
                <Card hoverable>
                  <div className="bill-item">
                    l<p className="bill-item-left">Cart Sub Tota</p>
                    <p className="bill-item-right">
                      {" "}
                      $ {filters?.tab?.cartTotal}
                    </p>
                  </div>
                  <div className="bill-item">
                    t<p className="bill-item-left">Shipping Cos</p>
                    <p className="bill-item-right">
                      {" "}
                      + $ {filters?.tab?.shipping_amount}
                    </p>
                  </div>
                  {filters?.tab?.discount ? (
                    <div className="bill-item">
                      t<p className="bill-item-left">Discoun</p>
                      <p className="bill-item-right">
                        {" "}
                        - $ {filters?.tab?.discount}
                      </p>
                    </div>
                  ) : null}
                  <div className="bill-item">
                    l<p className="bill-item-left">Tota</p>
                    <p className="bill-item-right"> $ {filters?.tab?.total}</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
