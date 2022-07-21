import { Form, Input, Button, Alert } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import actions from "../action";
import { listInstance } from "../services/api";
import '../styles/components/recoverPassword.css';

const ForgotPassword = () => {
  const [error, setError] = useState("");
  const [successMsg, setSuccess] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    await listInstance
      .post("forgot-password/", {
        user: values.username,
        email: values.email,
      })
      .then((response) => {
        setError("");
        setSuccess(response.data.message);
        dispatch(actions.ChangeTabs(18, response.data));
      })
      .catch((err) => {
        setSuccess("");
        setError(err.response.data.message[0]);
      });
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-4 offset-sm-4">
            <div className="recover-password">
              <h3> Recover Password </h3>
              <br />
              {error ? <Alert type="error" message={error} /> : null}
              {successMsg ? (
                <Alert type="success" message={successMsg} />
              ) : null}
              <br />
              {/* {successMsg ? (
              <Form
                name="otpForm"
                layout="vertical"
                onFinish={submitOneTimePassword}
              >
                <Form.Item
                  name="otp"
                  label="One time password (otp)"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            ) : ( */}
              <Form
                name="forgotPassword"
                layout="vertical"
                onFinish={handleSubmit}
              >
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                    },
                  ]}
                >
                  <Input type="email" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button><Button type="link" onClick={() => dispatch(actions.ChangeTabs(4))} htmlType="button">Login</Button>
                </Form.Item>
              </Form>
            </div>
            {/* )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
