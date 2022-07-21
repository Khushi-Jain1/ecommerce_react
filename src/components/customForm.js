import React, { useState } from "react";
import "../styles/components/mailchip.css";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { Input, Form, Button, Typography } from "antd";

const {Text} = Typography;

const CustomForm = ({ status, message, onValidated }) => {
  const handleSubmit = (values) => {
    values.email &&
      values.email.indexOf("@") > -1 &&
      onValidated({
        MERGE0: values.email,
      });
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <Form
              name="customForm"
              className="mc__form"
              onFinish={(e) => handleSubmit(e)}
            >
              {status === "sending" && (
                <div className="mc__alert mc-alert-sending">sending...</div>
              )}
              {status === "error" && (
                <div
                  className="mc__alert mc-alert-error"
                  dangerouslySetInnerHTML={{ __html: message }}
                />
              )}
              {status === "success" && (
                <div
                  className="mc__alert mc-alert-success"
                  dangerouslySetInnerHTML={{ __html: message }}
                />
              )}
              <div className="mc__field-container">
                <Form.Item name="email" required>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                  />
                </Form.Item>
              </div>

              <Form.Item>
                <Button
                  label="subscribe"
                  type="primary"
                  htmlType="submit"
                  // formValues={[email, firstName, lastName]}
                >
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

export default CustomForm;
