import "../styles/components/login.css";
import { Form, Input, Button, message, Spin } from "antd";
import { axiosInstance, userInstance } from "../services/api";
import actions from "../action";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie/es6";
import { useState } from "react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  var msg = {
    required: "${label} is required",
    types: {
      email: "Enter a valid email address.",
    },
    password: {
      range: "must be 8 character long",
    },
  };
  const handleLogin = (values) => {
    userInstance
      .post("/auth/login/", {
        username: values.username,
        password: values.password,
      })
      .then((result) => {
        if (result.data.error) {
          message.error({
            content: result.data.error,
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        } else {
          axiosInstance.defaults.headers["Authorization"] =
            "JWT " + result.data.access;
          localStorage.setItem("access_token", result.data.access);
          localStorage.setItem("refresh_token", result.data.refresh);
          localStorage.setItem("user", JSON.stringify(result.data.user));
          dispatch(actions.setUser(result.data.user));
          dispatch(actions.ChangeTabs(6));
          message.success({
            content: "Welcome " + values.username,
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
          handleCart(result.data.user.id);
        }
      })
      .catch((error) => {
        throw error;
        // error.response
      });
  };
  const handleCart = (user) => {
    const cookie = new Cookies();
    if (cookie.get("cart")) {
      const cook = cookie.get("cart");
      cook?.map((item) => {
        const token = localStorage.getItem("access_token");
        axiosInstance
          .post(
            "cart/",
            {
              user: user,
              product: item.product,
              quantity: item.quantity,
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
                  handleCart(user);
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
      });
      cookie.remove("cart");
    }
  };
  const handleRegister = (values) => {
    setLoading(true);
    userInstance
      .post(
        "/auth/register/",
        {
          email: values.email,
          username: values.username,
          password: values.password,
        },
        {
          validateStatus: (status) => {
            return status < 500;
          },
        }
      )
      .then((result) => {
        if (result.status === 400) {
          if (result.data.username) {
            for (var i = 0; i < result.data.username.length; i++) {
              message.error({
                content: result.data.username[i],
                className: "custom-class",
                style: {
                  marginTop: "20vh",
                },
              });
            }
          }
          if (result.data.email) {
            for (var j = 0; j < result.data.email.length; j++) {
              console.log("email", result.data);
              message.error({
                content: result.data.email[j],
                className: "custom-class",
                style: {
                  marginTop: "20vh",
                },
              });
            }
          }
          if (result.data.password) {
            for (var k = 0; k < result.data.password.length; k++) {
              console.log("password", result.data.password[k]);
              message.error({
                content: result.data.password[k],
                className: "custom-class",
                style: {
                  marginTop: "20vh",
                },
              });
            }
          }
        } else {
          message.success({
            content: "User Created",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
          axiosInstance.defaults.headers["Authorization"] =
            "JWT " + result.data.token;
          localStorage.setItem("access_token", result.data.token);
          localStorage.setItem("refresh_token", result.data.refresh);
          localStorage.setItem("user", JSON.stringify(result.data.user));
          dispatch(actions.setUser(result.data.user));
          setLoading(false);
          dispatch(actions.ChangeTabs(6));
          handleCart(result.data.user.id);
        }
      })
      .catch((error) => {
        console.log("error", error.response);
        message.error({
          content: error.response.data,
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        throw error;
        // error.response
      });
  };
  return (
    <>
      <Spin spinning={loading}>
        <section id="form">
          <div className="container">
            <div className="row">
              <div className="col-sm-1"></div>
              <div className="col-sm-4 ">
                <div className="login-form">
                  <h2>Login to your account</h2>
                  <Form
                    name="basic"
                    onFinish={handleLogin}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <Form.Item
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                      ]}
                    >
                      <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                      style={{ padding: "0", margin: 0 }}
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        className="button"
                        htmlType="submit"
                      >
                        Login
                      </Button>
                      <Button
                        type="link"
                        onClick={() => dispatch(actions.ChangeTabs(17))}
                      >
                        Forgot password
                      </Button>
                    </Form.Item>
                  </Form>
                  {/* <Button type="link">Forgot password</Button> */}
                </div>
              </div>
              <div className="col-sm-1">
                <h2 className="or">OR</h2>
              </div>
              <div className="col-sm-4">
                <div className="signup-form">
                  <h2>New User Signup!</h2>
                  <Form onFinish={handleRegister} validateMessages={msg}>
                    <Form.Item
                      name="username"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                        },
                      ]}
                    >
                      <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                      name={["password"]}
                      rules={[
                        {
                          required: true,
                          min: 8,
                        },
                      ]}
                    >
                      <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        className="button"
                        htmlType="submit"
                      >
                        Register
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Spin>
    </>
  );
};

export default Login;
