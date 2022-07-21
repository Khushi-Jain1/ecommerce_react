import Account from "../account";
import Cart from "../cart";
import Checkout from "../checkout";
import Login from "../login";
import Wishlist from "../wishlist";
import Home from "../home";
import { useSelector } from "react-redux";
import ProductDetails from "../productDetails";
import Shop from "../shop";
import AddressBook from "../addressBook";
import AddAddressForm from "../addAddressForm";
import UpdateAddress from "../updateAddress";
import Contact from "../contact";
import MailchimpFormContainer from "../mailchimp";
import Extra from "../extra";
import TrackOrder from "../trackOrder";
import ChangePassword from "../changePassword";
import RecoverPassword from "../recoverPassword";
import ForgotPassword from "../forgotPassword";
import MyOrders from "../myOrders";

const tabs = {
  1: Account,
  2: Cart,
  3: Checkout,
  4: Login,
  5: Wishlist,
  6: Home,
  7: ProductDetails,
  8: Shop,
  9: AddressBook,
  10: AddAddressForm,
  11: UpdateAddress,
  12: Contact,
  13: MailchimpFormContainer,
  14: Extra,
  15: TrackOrder,
  16: ChangePassword,
  17: ForgotPassword,
  18: RecoverPassword,
  19: MyOrders,
};

const EContent = () => {
  // const loggedInStatus = useSelector((state) => state.setUserReducer)
  // const Component = loggedInStatus.loggedIn ? LoggedIn : Logout
  const Component = LoggedIn;
  return <Component />;
  // return <Home />
};

// const Logout = () => {
//     return <Login/>
// }

const LoggedIn = () => {
  const getTab = useSelector((state) => state.changeTabReducer);
  const Component = tabs[getTab.currentTab];
  return <Component tab={getTab.key} />;
};

export default EContent;
