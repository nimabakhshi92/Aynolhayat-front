import { FiSearch } from "react-icons/fi";

import classes from "./profile-and-search.module.css";
import { useDispatch } from "react-redux";
import { logout } from "../../../features/user/userSlice";
export default function ProfileAndSearch() {
  const dispatch = useDispatch();
  return (
    <div>
      {/* <FiSearch className={classes.search_icon} /> */}
      {/* <div className={classes.profile_icon} onClick={() => dispatch(logout())}>
        M
      </div> */}
      <p className="cursor-pointer" onClick={() => dispatch(logout())}>
        خروج
      </p>
    </div>
  );
}
