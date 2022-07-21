import { Card, message, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import actions from "../action";
import { axiosInstance, userInstance } from "../services/api";

const AddressBook = () => {
  const username = useSelector((state) => state.setUserReducer);
  const [address, setAddress] = useState([]);
  const dispatch = useDispatch();

  const handleAddress = async () => {
    const token = localStorage.getItem("access_token");
    await axiosInstance
      .get("address/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAddress(response.data);
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
  const handleDelete = (values) => {
    console.log(values);
    const token = localStorage.getItem("access_token");
    axiosInstance
      .put(
        "address/" + values.id + "/",
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
          status: false,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        handleAddress();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          userInstance
            .post("/auth/refresh/", {
              refresh: localStorage.getItem("refresh_token"),
            })
            .then((result) => {
              localStorage.setItem("access_token", result.data.access);
              handleDelete(values);
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
    handleAddress();
  }, []);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <Card
              style={{ padding: "35px" }}
              hoverable
              onClick={() => dispatch(actions.ChangeTabs(10))}
            >
              <center>
                <PlusOutlined style={{ fontSize: "500%" }} />
                <br />
                <span>Add Address</span>
              </center>
            </Card>
          </div>
          {address?.map((item) => (
            <div className="col-sm-3" key={item.id}>
              <Card hoverable style={{ marginBottom: "20px" }}>
                <b>{item.name}</b>
                <br />
                {item.address_line1},<br />
                {item.address_line2},<br />
                {item.city},{item.state} -{item.pincode}
                <br />
                {item.country}
                <p className="card-subtitle mb-2 text-muted">
                  Phone Number : {item.mobile_number}
                </p>
                <Button
                  type="link"
                  onClick={() => dispatch(actions.ChangeTabs(11, item))}
                >
                  Edit
                </Button>{" "}
                |{" "}
                <Button onClick={() => handleDelete(item)} type="link">
                  Delete
                </Button>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AddressBook;
