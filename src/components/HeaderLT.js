import { Stack } from "@mui/material";
import Button from "./ui/buttons/primary-button";
import { useNavigate } from "react-router-dom";
import { BiExit, BiLogIn, BiLogOut } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { removeUserFromLocalStorage } from "../utils/localStorage";
import { logout } from "../features/user/userSlice";
import { ReactComponent as Logo } from "../assets/images/logo.svg";
import LogoPng from "../assets/images/logo.png";

export const HeaderLT = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  return (
    <header
      className="p-3 px-12 bg-white h-15 fixed w-full top-0 right-0"
      style={{
        zIndex: 98,
        backgroundColor: "#ffffff",
        // backdropFilter: "blur(15px)",

        // background:
        //   "radial-gradient(circle, rgba(65,222,59,0.7) 0%, rgba(0,171,0,0.7) 50%, rgba(52,217,47,0.7) 100%)",
        // color: "white",
        // backdropFilter: "blur(5px)",
        // backdropFilter: 'drop-shadow(4px 4px 10px green)'        // boxShadow: "10px",
      }}
    >
      <Stack
        justifyContent="space-between"
        alignItems="flex-start"
        flexDirection="row"
      >
        <img
          src={LogoPng}
          style={{
            width: "96px",
            height: "64px",
            position: "relative",
            top: "-17px",
          }}
        />
        {/* <Logo
          style={{
            width: "64px",
            height: "64px",
            position: "relative",
            top: "-10px",
          }}
        /> */}
        {/* <h1> عین الحیاه</h1> */}
        {/* <div className="w-9 h-9 flex justify-center items-center rounded-[50%] bg-[green]">
          N
              </div> */}
        <Button
          onClickHandler={() => {
            dispatch(logout());

            navigate("/login");
          }}
          variant="secondary"
          style={{
            border: "1px solid #aaa",
            padding: "2px 4px",
            borderRadius: "6px",
            // color: "gray",
            // width: "100px",
          }}
        >
          {user && user?.id !== 2 ? (
            <span className="flex items-center gap-2">
              <span>خروج</span>
              <BiLogOut />
            </span>
          ) : (
            <>
              <span className="flex items-center gap-2">
                <span>ورود | ثبت نام</span>
                <BiLogIn />
              </span>
            </>
          )}
        </Button>
        {/* <span
          style={{
            border: "1px solid #aaa",
            padding: "2px",
            borderRadius: "6px",
          }}
        >
          ورود / ثبت نام
        </span> */}
      </Stack>
    </header>
  );
};