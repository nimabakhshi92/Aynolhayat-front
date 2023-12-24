import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import apiUrls from "../api/urls";
import { loginUser, refreshToken } from "../features/user/userSlice";
import { useEffect } from "react";
import { getUserFromLocalStorage } from "../utils/localStorage";

export const ProtectedRoute = ({ children }) => {
  // const { user } = useSelector((store) => store.user);
  const user = getUserFromLocalStorage();
  const commonUser = {};
  const dispatch = useDispatch();

  console.log(user);
  if (!user) {
    const values = {
      username: "nima@a.com",
      password: "nima",
    };
    dispatch(loginUser(values));
  }
  const newToken = () => {
    if (!user) return;
    const expiresTime = new Date(user.expires_at || user.expires_in);
    if (expiresTime > new Date(new Date().getTime() - 10 * 60000)) return;
    console.log(user);
    dispatch(refreshToken(user));
  };

  useEffect(() => {
    const getNewAccessToken = setInterval(newToken, 25000);
    return () => clearInterval(getNewAccessToken);
  }, []);

  if (!user && false) return <Navigate to={"/login"} />;
  else {
    return children;
  }
};
