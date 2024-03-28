import { Stack, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import {
  BiBookmark,
  BiCylinder,
  BiHeart,
  BiSave,
  BiSearch,
} from "react-icons/bi";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { getUserFromLocalStorage } from "../utils/localStorage";
import { isAdmin, isLoggedIn, isSuperAdmin } from "../utils/acl";
import { MdBookmarkAdd } from "react-icons/md";
import { PiFolderUser } from "react-icons/pi";

const NavIcon = ({ iconName, isActive, ...props }) => {
  const icons = {
    search: BiSearch,
    allNarrations: BiCylinder,
    save: BiSave,
    saved: BiBookmark,
    "my-narrations": PiFolderUser,
  };
  const SelectedIcon = icons[iconName];
  return (
    <SelectedIcon
      color={isActive ? "green" : "#999"}
      style={{ width: "24px", height: "24px" }}
      {...props}
    />
  );
  if (iconName === "search")
    return (
      <BiSearch
        color={isActive ? "green" : "#999"}
        style={{ width: "24px", height: "24px" }}
        {...props}
      />
    );
  if (iconName === "allNarrations")
    return (
      <BiCylinder
        color={isActive ? "green" : "#999"}
        style={{ width: "24px", height: "24px" }}
        {...props}
      />
    );
  if (iconName === "saved")
    return (
      <BiBookmark
        color={isActive ? "green" : "#999"}
        style={{ width: "24px", height: "24px" }}
        {...props}
      />
    );
  if (iconName === "save")
    return (
      <BiSave
        color={isActive ? "green" : "#999"}
        style={{ width: "24px", height: "24px" }}
        {...props}
      />
    );
};

export const SidebarLT = () => {
  const { pathname } = useLocation();
  const pageName = pathname.includes("search")
    ? "search"
    : pathname.includes("saved")
    ? "saved"
    : pathname.includes("save")
    ? "save"
    : pathname.includes("my-narrations")
    ? "my-narrations"
    : "";
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { user } = useSelector((store) => store.user);

  const navItemsDefault = [
    {
      icon: <BiCylinder />,
      name: "allNarrations",
      displayText: "همه احادیث",
      to: "/",
      isActive: pageName === "",
      show: true,
    },
    {
      icon: <PiFolderUser />,
      name: "my-narrations",
      displayText: "احادیث من",
      to: "my-narrations",
      isActive: pageName === "my-narrations",
      show: isAdmin(user) && !isSuperAdmin(user),
    },

    {
      icon: <BiBookmark />,
      name: "saved",
      displayText: "نشان شده ها",
      to: "saved",
      isActive: pageName === "saved",
      show: true,
    },
    {
      icon: <BiSearch />,
      name: "search",
      displayText: "جست و جو",
      to: "search",
      isActive: pageName === "search",
      show: false,
    },
    {
      icon: <BiSave />,
      name: "save",
      displayText: "ذخیره حدیث",
      to: "save narration",
      isActive: pageName === "save",
      show: isAdmin(user),
    },
  ];

  const [navItems, setNavItems] = useState(navItemsDefault);
  var isNotInit = localStorage.getItem("isNotInit");
  const [open, setOpen] = useState(isNotInit !== "true");
  useEffect(() => {
    if (isNotInit !== "true") {
      localStorage.setItem("isNotInit", "true");
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  }, []);

  const changeLink = (clickedNavLinkName) => {
    const newNavlinks = navItems?.map((item) => {
      if (item.name === clickedNavLinkName) return { ...item, isActive: true };
      else return { ...item, isActive: false };
    });
    setNavItems(newNavlinks);
  };

  return (
    <nav
      className={`bg-white fixed right-0 ${
        isSmallScreen ? "bottom-0" : "top-32 h-full"
      }`}
      style={{
        transition: "all 0.3s linear",
        // display: open ? "block" : "none",
        // boxShadow: "10px",
        width: isSmallScreen ? "100%" : open ? "150px" : "48px",
        zIndex: 99,
        boxShadow: open ? "-10px 10px 30px gray" : "-5px 5px 10px gray",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Stack
        justifyContent={isSmallScreen ? "center" : "flex-start"}
        alignItems="center"
        flexDirection={isSmallScreen ? "row-reverse" : "column"}
        className={`w-full ${!isSmallScreen ? "py-2" : "pt-[1px]"}`}
        gap="16px"
      >
        {navItems.map((item, index) => {
          if (item.show)
            return (
              <NavLink
                key={index}
                to={item.to}
                onClick={() => changeLink(item.name)}
                className="block w-full"
              >
                <Stack
                  justifyContent={isSmallScreen ? "center" : "space-between"}
                  alignItems="center"
                  flexDirection="row"
                  className={`w-full h-10 px-3 ${
                    item.isActive
                      ? "bg-[#0bab6425] pl-2"
                      : "bg-[white] hover:bg-[#0bab6410] hover:scale-105"
                  }  ${isSmallScreen && "justify-center"} `}
                  style={{
                    borderLeft:
                      !isSmallScreen && item.isActive && "4px solid #0bab64",
                    borderBottom:
                      isSmallScreen && item.isActive && "4px solid #0bab64",
                  }}
                  // style={{
                  //   backgroundColor: item.isActive ? "#0bab6425" : "white",
                  // }}
                >
                  {!isSmallScreen && (
                    <span
                      style={{
                        transition: "all 0.3s linear",
                        // display: open ? "inline-block" : "none",
                        // width: open ? "100px" : "0",
                        // height: open ? "32px" : "0",
                        marginRight: open ? "0" : "-120px",
                        overflow: "hidden",
                        display: "inline-block",
                      }}
                    >
                      {item.displayText}
                    </span>
                  )}
                  {/* <span> */}
                  <NavIcon
                    width="36px"
                    height="36px"
                    iconName={item.name}
                    isActive={item.isActive}
                  />
                  {/* </span> */}
                </Stack>
              </NavLink>
            );
        })}
      </Stack>
    </nav>
  );
};
