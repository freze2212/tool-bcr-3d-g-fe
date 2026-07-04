import React, { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import VideoBackground from "./VideoBackground";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const Cookies = require("js-cookie");
  const cookieToken = Cookies.get("access_token");
  const lsToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const token = cookieToken || lsToken;
  const location = useLocation();

  const userInfoString = localStorage.getItem("user_info");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const role = userInfo?.role;

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (location.pathname.startsWith("/admin") && role === "USER") {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <VideoBackground />
      {children}
    </>
  );
};

export default PrivateRoute;
