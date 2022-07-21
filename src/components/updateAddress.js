import { Form, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import actions from "../action";
import { axiosInstance, userInstance } from "../services/api";

const UpdateAddress = ({ ...filters }) => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.setUserReducer);
  var msg = {
    mobileNumber: {
      range: "Ensure this field has no more than 10 characters.",
    },
  };
  const handleSubmit = (values) => {
    const token = localStorage.getItem("access_token");
    axiosInstance
      .put(
        "address/" + filters.tab.id + "/",
        {
          user: username.user_id,
          mobile_number: values.mobile_number,
          pincode: values.pincode,
          address_line1: values.address_line1,
          address_line2: values.address_line2,
          city: values.city,
          state: values.state,
          country: values.country,
          name: values.name,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        message.success({
          content: "changes done",
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
        } else {
          console.log(err.response);
        }
      });
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-6 offset-sm-3">
            <h1>Edit Address</h1>
            <Form
              initialValues={filters.tab}
              validateMessages={msg}
              name="addAddress"
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                name="name"
                rules={[
                  {
                    max: 50,
                  },
                ]}
                label="Name"
                required
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="mobile_number"
                label="Mobile Number"
                rules={[
                  {
                    max: 10,
                  },
                ]}
                required
              >
                {/* <InputNumber controls={false} style={{width:'100%'}} /> */}
                <Input type="number" controls={false} />
              </Form.Item>
              <Form.Item
                name="pincode"
                label="Pincode"
                rules={[
                  {
                    max: 10,
                  },
                ]}
                required
              >
                <Input type="number" controls={false} />
              </Form.Item>
              <Form.Item
                name="address_line1"
                label="Address line 1"
                required
                rules={[
                  {
                    max: 20,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="address_line2"
                label="Address line 2"
                rules={[
                  {
                    max: 20,
                  },
                ]}
                required
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="city"
                label="City"
                required
                rules={[
                  {
                    max: 10,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="state"
                label="State"
                required
                rules={[
                  {
                    max: 10,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="country"
                label="Country"
                rules={[
                  {
                    max: 10,
                  },
                ]}
                required
              >
                <Input />
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
export default UpdateAddress;
