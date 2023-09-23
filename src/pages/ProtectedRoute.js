import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import apiUrls from "../api/urls";
import { refreshToken } from "../features/user/userSlice";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const newToken = () => {
    if (!user) return;
    const expiresTime = new Date(user.expires_at);
    if (expiresTime > new Date(new Date().getTime() - 10 * 60000)) return;
    dispatch(refreshToken(user));
  };

  useEffect(() => {
    const getNewAccessToken = setInterval(newToken, 25000);
    return () => clearInterval(getNewAccessToken);
  }, []);

  if (!user) return <Navigate to={"/login"} />;
  else {
    return children;
  }
};
