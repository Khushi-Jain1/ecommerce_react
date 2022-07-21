import { Button, Input, Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "../styles/components/contact.css";
import actions from "../action";
import MailchimpFormContainer from "./mailchimp";
import { listInstance } from "../services/api";

const { TextArea } = Input;

const Contact = () => {
  const validateMessages = {
    types: {
      email: "${label} is not a valid email!",
    },
  };
  const dispatch = useDispatch();
  const username = useSelector((state) => state.setUserReducer);

  const handleSubmit = (values) => {
    // const token = localStorage.getItem("access_token");
    listInstance
      .post("contact/", {
        name: values.name,
        mail: values.email,
        subject: values.subject,
        message: values.message,
        user_logged_in: username.user_id ? true : false,
      })
      .then((response) => {
        if (typeof response.data === "string") {
          message.success({
            content: response.data,
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        } else {
          message.success({
            content: "Message sent",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(actions.removeUser());
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
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="title">
              <h2>Contact Us</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-9">
            <div className="title">
              <h2>Get in Touch</h2>
              <Form
                name="contactForm"
                layout="vertical"
                validateMessages={validateMessages}
                onFinish={handleSubmit}
              >
                <div className="row">
                  <div className="col-sm-6">
                    <Form.Item name="name" required>
                      <Input placeholder="Name" />
                    </Form.Item>
                  </div>
                  <div className="col-sm-6">
                    <Form.Item
                      name="email"
                      required
                      rules={[{ type: "email" }]}
                    >
                      <Input type="email" placeholder="Email" />
                    </Form.Item>
                  </div>
                  <Form.Item name="subject" required>
                    <Input placeholder="Subject" />
                  </Form.Item>
                  <Form.Item name="message" required>
                    <TextArea rows={10} placeholder="Message" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="title">
              <h2>Newsletter</h2>
              <center>
                <p>Subscribe our newsletter to get latest updates</p>
                {/* <Button onClick={() => dispatch(actions.ChangeTabs(13))} type="primary">Subscribe</Button> */}
                <MailchimpFormContainer />
              </center>
              <br />
              <h2>contact info</h2>
              <address>
                E-Shopper Inc.
                <br /> 935 W. Webster Ave New Streets Chicago
                <br /> 60614, NY
                <br /> Newyork USA <br />
                Mobile: +2346 17 38 93 <br />
                Fax: 1-714-252-0026 <br />
                Email: info@e-shopper.com
                <br />
              </address>
              {/* <h2>social networking</h2>
              <FacebookFilled /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
