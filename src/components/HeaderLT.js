import { Stack, useMediaQuery } from "@mui/material";
import Button from "./ui/buttons/primary-button";
import { useNavigate } from "react-router-dom";
import { BiExit, BiLogIn, BiLogOut, BiMenu } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { removeUserFromLocalStorage } from "../utils/localStorage";
import { logout } from "../features/user/userSlice";
// import { ReactComponent as LogoSvg } from "../assets/images/Logo1.svg";
import LogoPng from "../assets/images/LogoRevised.png";
import { MdAccountCircle } from "react-icons/md";
import {
  setSelectedNode,
  setTreeIsOpen,
  toggleTreeIsOpen,
} from "../features/summaryTree/summaryTreeSlice";
import { useEffect } from "react";
import { downloadNarrations } from "../api/hooks/allHooks";

export const HeaderLT = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const { dataLoaded } = useSelector((state) => state.summaryTree);

  const dispatch = useDispatch();
  var isNotInit = localStorage.getItem("isNotInit2");
  useEffect(() => {
    if (dataLoaded) {
      dispatch(setTreeIsOpen(isNotInit !== "true"));
      // dispatch(setTreeIsOpen(true));

      if (isNotInit !== "true" && isSmallScreen) {
        setTimeout(() => {
          localStorage.setItem("isNotInit2", "true");
          dispatch(setTreeIsOpen(false));
        }, 4000);
      }
    }
  }, [dataLoaded]);
  return (
    <header
      className="p-3 sm:pt-6 sm:px-12 px-4 bg-white sm:h-20 pt-2 fixed w-full sm:top-12 top-0 right-0"
      style={{
        zIndex: 98,
        backgroundColor: "#ffffff",
      }}
    >
      <Stack
        justifyContent="space-between"
        alignItems={!isSmallScreen ? "flex-start" : "center"}
        flexDirection="row"
        className="sm:w-full"
      >
        {isSmallScreen && (
          <BiMenu
            style={{
              width: "30px",
              height: "30px",
            }}
            className="cursor-pointer"
            color="var(--neutral-color-600)"
            onClick={() => dispatch(toggleTreeIsOpen())}
          />
        )}
        <img
          src={LogoPng}
          className="sm:w-24 w-16 sm:h-16 h-10 relative sm:-top-4 top-0"
          style={{}}
        />
        {!isSmallScreen && (
          <>
            <span>
              حدیث روز: از امام حسن (علیه السلام) پرسیدند: شرف چیست؟ فرمود:
              احسان به قبیله و اَقران و تحمل جرم و گناه آنان. تحف العقول (ص223)
            </span>
            <Button
              onClickHandler={() => {
                dispatch(logout());

                navigate("/login");
              }}
              variant="primary"
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
          </>
        )}
        {isSmallScreen && (
          // <MdAccountCircle
          //   style={{
          //     width: "30px",
          //     height: "30px",
          //   }}
          //   color="var(--neutral-color-600)"
          // />
          <Button
            onClickHandler={() => {
              dispatch(logout());

              navigate("/login");
            }}
            variant="primary"
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
                  <span>ورود</span>
                  <BiLogIn />
                </span>
              </>
            )}
          </Button>
        )}
      </Stack>
    </header>
  );
};
