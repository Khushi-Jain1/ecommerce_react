import React from "react";
// import "./mcFormStyles.scss";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import CustomForm from "./customForm";

const MailchimpFormContainer = (props) => {
  const posturl = "https://gmail.us5.list-manage.com/subscribe/post?u=ac394084ce4951398e0fa2d6b&id=fc18f6006b";
  return (
    <div className="mc__form-container">
      <MailchimpSubscribe
        url={posturl}
        render={({ subscribe, status, message }) => (
          <CustomForm
            status={status}
            message={message}
            onValidated={(formData) => subscribe(formData)}
          />
        )}
      />
    </div>
  );
};

export default MailchimpFormContainer;
