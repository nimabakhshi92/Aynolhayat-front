import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import apiUrls from "../api/urls";
import { loginUser, refreshToken } from "../features/user/userSlice";
import { useEffect, useState } from "react";
import { getUserFromLocalStorage } from "../utils/localStorage";

export const ProtectedRoute = ({ children }) => {
  // const { user } = useSelector((store) => store.user);
  const commonUser = {};
  const dispatch = useDispatch();
  var { user } = useSelector((store) => store.user);
  // var user = getUserFromLocalStorage();
  const [flag, setFlag] = useState(true);
  useEffect(() => {
    // var user2 = getUserFromLocalStorage();
    const loogIn = async () => {
      if (!user) {
        const values = {
          username: "nima@a.com",
          password: "nima",
        };
        await dispatch(loginUser(values));
        // setFlag(!flag);
      }
    };
    loogIn();
  }, [flag]);

  const newToken = () => {
    if (!user) return;
    const expiresTime = new Date(user.expires_at || user.expires_in);
    if (expiresTime > new Date(new Date().getTime() - 10 * 60000)) return;
    dispatch(refreshToken(user));
  };

  useEffect(() => {
    const getNewAccessToken = setInterval(newToken, 25000);
    return () => clearInterval(getNewAccessToken);
  }, [user]);

  if (!user) return
  else {
    return children;
  }
};
