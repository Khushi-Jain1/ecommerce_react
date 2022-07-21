import { message } from "antd";
import { Button } from "antd/lib/radio";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import actions from "../action";
import "../styles/components/slider.css";
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";
import { listInstance } from "../services/api";

const Banners = () => {
  const dispatch = useDispatch();
  const [images, setImage] = useState([]);

  const getBanners = () => {
    listInstance
      .get("banners/")
      .then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          setImage((oldImages) => [...oldImages, response.data[i]]);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(actions.removeUser());
          message.error({
            content: "Session Expired",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        }
      });
  };

  useEffect(() => {
    getBanners()
  }, []);

  return (
    <>
      <Slider autoplay={1000}>
        {images.map((item) => (
          <div key={item.id}>
            <div className="container">
              <div className="row">
                <div className="col-md-7">
                  <div className="leftBox">
                    <h1>
                      <span>{item?.title}</span>
                    </h1>
                    <h2>{item?.subtitle}</h2>
                    <p>{item?.paragraph}</p>
                    <Button className="get" type="primary">Get it now</Button>
                  </div>
                </div>
                <div className="col-md-5">
                  <img style={{ float: "right" }} src={item?.image} alt="" />
                </div>
              </div>{" "}
            </div>
          </div>
        ))}
      </Slider>
    </>
  );
};

export default Banners;
