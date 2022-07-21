import { UploadOutlined } from "@ant-design/icons";
import { Spin, Image, Form, Input, Upload, Button, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "../action";
import { axiosInstance, userInstance } from "../services/api";
import { BASE_URL } from "../services/config";

const Account = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const username = useSelector((state) => state.setUserReducer);

  const token = localStorage.getItem("access_token");
  const getData = async () => {
    await axiosInstance
      .get(
        "profile/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setProfile(response.data[0]);
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
              getData();
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

  const props = {
    name: "file",
    action: BASE_URL + "/api/profile/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const handleSubmit = async (values) => {
    setLoading(true);
    await axiosInstance
      .put(
        "profile/" + username.user_id + "/",
        {
          username: values.username,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          mobile_number: values.mobile_number,
          // image: profile.image,
        }
        // {
        //   headers: { Authorization: `Bearer ${token}` },
        // }
      )
      .then((response) => {
        getData();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(actions.removeUser());
          dispatch(actions.ChangeTabs(4));
          message.info({
            content: "please login first",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        }
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="container">
        <div className="row">
          {loading ? (
            <Spin />
          ) : (
            <div className="col-sm-6 offset-sm-3">
              <h3>Profile</h3>
              <Form
                initialValues={profile}
                name="profileForm"
                layout="vertical"
                onFinish={handleSubmit}
              >
                <Form.Item name="username" label="Username" required>
                  <Input type="text" />
                </Form.Item>
                <Form.Item name="first_name" label="First Name">
                  <Input name="first_name" />
                </Form.Item>
                <Form.Item name="last_name" label="Last Name">
                  <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" required>
                  <Input />
                </Form.Item>
                <Form.Item name="mobile_number" label="Mobile Number">
                  <Input />
                </Form.Item>
                <Form.Item name="image" label="Image" required>
                  <Upload maxCount={1} {...props} onChange={getData}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>
                <Image src={profile.image} />

                <div className="row">
                  <div className="col-sm-2">
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                  </div>
                  <div className="col-sm-3">
                    <Form.Item>
                      <Button
                        type="primary"
                        onClick={() => dispatch(actions.ChangeTabs(16))}
                      >
                        Change Password
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Account;
