import { Button, Divider, Menu, message, Slider } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "../action";
import { listInstance } from "../services/api";

const { SubMenu } = Menu;

const Sidebar = ({ handleFilter, category, brands, onFilterReset }) => {
  const [openKeys, setOpenKeys] = useState([]);
  const rootSubmenuKeys = ["sub1", "sub2", "sub4"];
  const range = useSelector((state) => state.PriceRangeReducer);
  const dispatch = useDispatch();

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const handlePriceRange = () => {
    listInstance
      .get("price-range/")
      .then((response) => {
        // dispatch(actions.priceRange(response.data[0]));
        setMin(response.data[0].min);
        setMax(response.data[0].max);
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
        } else {
          console.log(err.response);
        }
      });
  };

  useEffect(() => {
    handlePriceRange();
  }, []);
  return (
    <div className="left-sidebar">
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        style={{ width: 300 }}
      >
        <Divider>
          <h2>Category</h2>
        </Divider>
        {category
          .filter((i) => i.parent_category_id == null)
          .map((item) =>
            item.childs > 0 ? (
              <SubMenu key={item.id} title={item.name.toUpperCase()}>
                {category
                  .filter((row) => row.parent_category_id === item.id)
                  .map((child) => (
                    <Menu.Item
                      key={child.id}
                      onClick={() => handleFilter(child.id)}
                    >
                      {child.name.toUpperCase()}
                    </Menu.Item>
                  ))}
              </SubMenu>
            ) : (
              <SubMenu key={item.id} title={item.name.toUpperCase()}>
                {" "}
              </SubMenu>
            )
          )}
        {/* </Menu> */}
        <Divider>
          <h2>Brands</h2>
        </Divider>
        {/* <Menu
                  mode="inline"
                  openKeys={openKeys}
                  onOpenChange={onOpenChange}
                  style={{ width: 300 }}
                  onSelect={(item) => handleCheck(item) }
                > */}
        {brands.map((brand) => (
          <Menu.Item key={brand.slug} onClick={() => handleFilter(brand.slug)}>
            <span>{brand.brand.toUpperCase()}</span>
            <span style={{ float: "right" }}>( {brand.count} )</span>
          </Menu.Item>
        ))}
      </Menu>
      <Divider>
        <h2>Price Range</h2>
      </Divider>
      <Slider
        range
        min={min}
        max={max}
        defaultValue={[min, max]}
        onAfterChange={handleFilter}
      />
      <span style={{ float: "left" }}>${min}</span>
      <span style={{ float: "right" }}>${max}</span>
      <br />
      <div>
        <Button
          type="primary"
          className="button clear-filter"
          onClick={onFilterReset}
        >
          Clear Filter
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
