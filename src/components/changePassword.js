import { Form, Input, Button, Alert, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import actions from "../action";
import { axiosInstance, userInstance } from "../services/api";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const handleSubmit = (values) => {
    const token = localStorage.getItem("access_token");
    axiosInstance
      .post(
        "changePassword/",
        {
          old_password: values.oldPassword,
          new_password1: values.newPassword,
          new_password2: values.confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setError("");
        message.success({
          content: "Password updated successfully",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
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
        } else if (err.response.status === 400) {
          if (err.response.data.old_password) {
            setError(err.response.data.old_password.old_password);
          } else {
            setError(err.response.data?.password[0]);
          }
        }
      });
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-4 offset-sm-4">
            <Form
              onFinish={handleSubmit}
              name="passwordChange"
              layout="vertical"
            >
              {error.length > 0 ? <Alert type="error" message={error} /> : null}
              <br />
              <Form.Item name="oldPassword" label="Old Password" required>
                <Input.Password />
              </Form.Item>
              <Form.Item name="newPassword" label="New Password" required>
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                required
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
