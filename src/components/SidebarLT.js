import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { BiCylinder, BiHeart, BiSearch } from "react-icons/bi";
import { NavLink } from "react-router-dom";

const navItemsDefault = [
  {
    icon: <BiCylinder />,
    name: "allNarrations",
    displayText: "همه احادیث",
    to: "/",
    isActive: true,
  },
  {
    icon: <BiHeart />,
    name: "saved",
    displayText: "مورد علاقه ها",
    to: "saved",
    isActive: false,
  },
  {
    icon: <BiSearch />,
    name: "search",
    displayText: "جست و جو",
    to: "search",
    isActive: false,
  },
];

const NavIcon = ({ iconName, isActive, ...props }) => {
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
      <BiHeart
        color={isActive ? "green" : "#999"}
        style={{ width: "24px", height: "24px" }}
        {...props}
      />
    );
};

export const SidebarLT = () => {
  const [navItems, setNavItems] = useState(navItemsDefault);
  const [open, setOpen] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setOpen(false);
    }, 3000);
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
      className="bg-white  h-full fixed top-16 right-0 "
      style={{
        transition: "all 0.3s linear",
        // display: open ? "block" : "none",
        // boxShadow: "10px",
        width: open ? "150px" : "48px",
        zIndex: 99,
        boxShadow: open ? "-10px 10px 30px gray" : "-5px 5px 10px gray",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Stack
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="column"
        className="w-full py-2 "
        gap="16px"
      >
        {navItems.map((item, index) => {
          return (
            <NavLink
              key={index}
              to={item.to}
              onClick={() => changeLink(item.name)}
              className="block w-full"
            >
              <Stack
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
                className={`w-full h-10 px-3 ${
                  item.isActive
                    ? "bg-[#0bab6425] pl-2"
                    : "bg-[white] hover:bg-[#0bab6410] hover:scale-105"
                }   `}
                style={{ borderLeft: item.isActive && "4px solid #0bab64" }}
                // style={{
                //   backgroundColor: item.isActive ? "#0bab6425" : "white",
                // }}
              >
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
