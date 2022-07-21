import { Result, Button } from "antd";
import { useDispatch } from "react-redux";
import action from "../../../action";

const Success = ({ ...filters }) => {
  const dispatch = useDispatch();
  const handleTabs = () => {
    dispatch(action.ChangeTabs(6));
  };
  return (
    <>
      <Result
        status="success"
        title="Order Placed Successfully"
        subTitle={"Order number: " + filters.tab.order_id}
        extra={[<Button onClick={handleTabs} type="primary">Continue Shopping</Button>]}
      />
    </>
  );
};

export default Success;
