import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function CheckAuth({ children }) {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [navigateToLogin, setNavigateToLogin] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (
        !isAuthenticated &&
        !(
          location.pathname.includes("/login") ||
          location.pathname.includes("/register")
        )
      ) {
        setNavigateToLogin(true)
      }

      if (isAuthenticated && (user?.role !== "admin" && location.pathname.includes("admin"))) {
        console.log("setter 2")
        setNavigateToLogin(true)
      }
    }

  }, [user, isAuthenticated, isLoading, setNavigateToLogin])

  if (navigateToLogin) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
}

CheckAuth.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object,
  children: PropTypes.node,
  isIndex: PropTypes.bool
};

export default CheckAuth;
