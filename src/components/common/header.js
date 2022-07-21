import { Button, Dropdown, Form, Input, Menu, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import action from "../../action";
import "../../styles/components/common/header.css";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { listInstance } from "../../services/api";

const Header = () => {
  const dispatch = useDispatch();
  const [pages, setPages] = useState({});

  const user = useSelector((state) => state.setUserReducer.username);
  const tab = useSelector((state) => state.changeTabReducer.currentTab);

  const handleTabs = (value) => {
    if (value != 8) {
      dispatch(action.SearchItem(null));
    }
    dispatch(action.ChangeTabs(value));
  };

  const getPages = () => {
    listInstance
      .get("extra/")
      .then((response) => {
        setPages(response.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(action.removeUser());
          message.error({
            content: "Session Expired",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        } else {
          console.log(err.response);
        }
      });
  };

  const handleLogout = () => {
    dispatch(action.ChangeTabs(4));
    dispatch(action.removeUser());
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  };

  const shop = (
    <Menu>
      <Menu.Item>
        <Button type="text" onClick={() => handleTabs(9)}>
          Address Book
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="text" onClick={() => handleTabs(5)}>
          Wishlist
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="text" onClick={() => handleTabs(2)}>
          Cart
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="text" onClick={() => handleTabs(19)}>
          My Orders
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="text" onClick={() => handleTabs(15)}>
          Track Orders
        </Button>
      </Menu.Item>
    </Menu>
  );

  const extra = (
    <Menu>
      {Object.keys(pages).length !== 0
        ? pages?.map((item) => (
            <Menu.Item>
              <Button
                type="text"
                onClick={() => dispatch(action.ChangeTabs(14, item.content))}
              >
                {item.title}{" "}
              </Button>
            </Menu.Item>
          ))
        : null}
    </Menu>
  );

  const handleSearch = (value) => {
    dispatch(action.SearchItem(value.search));
  };

  useEffect(() => {
    getPages();
  }, []);

  return (
    <>
      <header id="header">
        <div className="header-middle">
          <div className="container">
            <div className="row">
              <div className="col-sm-4">
                <div className="logo pull-left">
                  <Button onClick={() => handleTabs(6)} type="text">
                    <img src="images/logo.png" alt="" />
                  </Button>
                </div>
              </div>
              <div className="col-sm-8">
                <div className="shop-menu pull-right">
                  <ul style={{ float: "right" }}>
                    {user ? (
                      <li>
                        <Button onClick={() => handleTabs(1)} type="text">
                          <i className="fa fa-user"></i> &nbsp; {user}
                        </Button>
                      </li>
                    ) : null}
                    <li>
                      <Button type="text" onClick={() => handleTabs(5)}>
                        <i className="fa fa-star"></i> &nbsp; Wishlist
                      </Button>
                    </li>
                    <li>
                      <Button type="text" onClick={() => handleTabs(2)}>
                        <i className="fa fa-shopping-cart"></i> &nbsp; Cart
                      </Button>
                    </li>
                    {user ? (
                      <li>
                        <Button type="text" onClick={() => handleLogout()}>
                          <i className="fa fa-lock"></i> &nbsp; Logout
                        </Button>
                      </li>
                    ) : (
                      <li>
                        <Button type="text" onClick={() => handleTabs(4)}>
                          <i className="fa fa-lock"></i> &nbsp; Login
                        </Button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="header-bottom">
          <div className="container">
            <div className="row">
              <div className="col-sm-9">
                <div className="navbar-header"></div>
                <div className="mainmenu pull-left">
                  <ul className="nav">
                    <li>
                      <Button type="text" onClick={() => handleTabs(6)}>
                        Home
                      </Button>
                    </li>
                    <li>
                      <Button type="text" onClick={() => handleTabs(8)}>
                        Shop
                      </Button>
                    </li>
                    {user ? (
                      <li className="dropdown">
                        <Dropdown overlay={shop}>
                          <Button
                            type="text"
                            className="ant-dropdown-link"
                            onClick={(e) => e.preventDefault()}
                          >
                            Account <DownOutlined />
                          </Button>
                        </Dropdown>
                      </li>
                    ) : null}
                    <li>
                      <Button type="text" onClick={() => handleTabs(12)}>
                        Contact
                      </Button>
                    </li>
                    {/* <li>
                      <Button type="text" onClick={() => handleTabs(6)}>
                        Extra
                      </Button>
                    </li> */}
                    <li className="dropdown">
                      <Dropdown overlay={extra}>
                        <Button
                          type="text"
                          className="ant-dropdown-link"
                          onClick={(e) => e.preventDefault()}
                        >
                          Extra <DownOutlined />
                        </Button>
                      </Dropdown>
                    </li>
                  </ul>
                </div>
              </div>
              {tab === 8 ? (
                <div className="col-sm-3">
                  <div className="search_box pull-right">
                    {/* <input type="text" placeholder="Search" /> */}
                    <Form onFinish={handleSearch}>
                      <Form.Item name="search">
                        <Input placeholder="Search"></Input>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
