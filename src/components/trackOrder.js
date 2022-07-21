import { Form, message, Button, InputNumber, Timeline, Alert } from "antd";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import actions from "../action";
import {axiosInstance, userInstance} from "../services/api";

const TrackOrder = () => {
  const [timeline, setTimeline] = useState([]);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    if (isNaN(values.orderId)) {
      setError("Enter numeric order id");
    } else {
      const token = localStorage.getItem("access_token");
      await axiosInstance
        .get("track-order/", {
          params: { order_id: values.orderId },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.error) {
            setTimeline([]);
            setError(response.data.error);
          } else {
            setError("");
            response.data.map(item => {
              const d = new Date(item.created_on)
              item.created_on = d.toLocaleString()
            })
            setTimeline(response.data);
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
                handleSubmit(values);
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
          }else{
            console.log(err.response);
          }
        });
    }
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-4 offset-sm-4">
          <center>
            {" "}
            <h3>Track Order</h3>{" "}
          </center>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="orderId" label="Order Id" required>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ float: "right" }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
          <hr />
          {error.length > 0 ? <Alert type="error" message={error} /> : null}
          {timeline.length > 0 ? (
            <Timeline mode="left">
              {timeline?.map((item) => (
                <Timeline.Item label={item.created_on}>
                  {" "}
                  {item.status}{" "}
                </Timeline.Item>
              ))}
            </Timeline>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
