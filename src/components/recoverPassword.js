import { Form, Alert, Input, Button } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import '../styles/components/recoverPassword.css';
import actions from "../action";
import { listInstance } from "../services/api";

const RecoverPassword = ({ ...filters }) => {
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const dispatch = useDispatch()
  const handleSubmit = async (values) => {
    await listInstance
      .post(
        "recover-password/",
        {
          otp: values.otp,
          new_password1: values.newPassword,
          new_password2: values.confirmPassword,
        }
      )
      .then((response) => {
        console.log(response.data);
        setError("");
        setSuccessMsg("Password Changed Successfully")
      })
      .catch((err) => {
        console.log(err.response)
        setSuccessMsg("")
        if (err.response.data.non_field_errors){
          setError(err.response.data.non_field_errors[0]);
        }else if (err.response.data.password){
          setError(err.response.data.password[0]);
        }
      });
  };

  const get = () => {
    setSuccessMsg(filters.tab.message)
  }

  useEffect(() => {
    get()
  },[])
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-4 offset-sm-4">
            <div className="recover-password">
            <h3>Recover Password </h3>
            <Form
              onFinish={handleSubmit}
              name="passwordChange"
              layout="vertical"
            >
              {error ? <Alert type="error" message={error} /> : null}
              {successMsg ? <Alert type="success" message={successMsg} /> : null}
              <br />
              <Form.Item name="otp" label="One time password (OTP)" tooltip="OTP sent to your registered mail id" required>
                <Input />
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
                </Button> <Button type="link" onClick={() => dispatch(actions.ChangeTabs(4))} htmlType="button">Login</Button>
              </Form.Item>
            </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecoverPassword;
