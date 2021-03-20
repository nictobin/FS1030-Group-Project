import { Redirect, Route } from "react-router-dom";

const ProtectedRoute = ({ component, ...rest }) => {
  const access_token = localStorage.getItem("access_token");
  const finalComponent = access_token
    ? component
    : () => <Redirect to={{ pathname: "/admin-login" }} />;

  return <Route {...rest} component={finalComponent} />;
};

export default ProtectedRoute;