import { useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import bismilah from "../assets/images/bismilah.png";
import MainBG from "../assets/images/MainBG.png";
import TopHeader from "../assets/images/TopHeader.jpg";
import { DatetimeVisualizer } from "../components/general/DatetimeVisualizer";
import Header from "../components/header";
import { HeaderLT } from "../components/HeaderLT";
import { SidebarLT } from "../components/SidebarLT";
import { isSuperAdmin } from "../utils/acl";

export const SharedLayout = () => {
  return (
    <main
      style={{
        backgroundColor: "var(--blue-100)",
      }}
      className="pb-2"
    >
      <Header />
      <section className="section-center ">
        <section className="pb-12  m-auto max-w-screen-2xl">
          <Outlet></Outlet>
        </section>
      </section>
    </main>
  );
};

export const SharedLayoutLT = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { user } = useSelector((store) => store.user);
  const a = document.body;
  a.style.fontSize = isSuperAdmin(user) ? "190%" : "160%";
  return (
    <main
      style={{
        backgroundColor: "var(--blue-100)",
        // fontSize: isSuperAdmin(user) ? getFont(user,100) + "%" : "100%",
      }}
      className="pb-2 min-h-[100vh] "
    >
      {!isSmallScreen && (
        <img
          src={TopHeader}
          className="block fixed top-0 w-full h-12"
          style={{
            zIndex: 98,
          }}
        />
      )}
      {!isSmallScreen && (
        <div
          className="block fixed top-0 w-full h-12 px-12 flex items-center justify-between"
          style={{
            zIndex: 99,
            color: "white",
          }}
        >
          <DatetimeVisualizer />
          <img src={bismilah} />
          <span className="flex items-center gap-8">
            <span>تماس با ما</span>
            <span>درباره ما</span>
          </span>
        </div>
      )}
      <HeaderLT />
      <SidebarLT />

      <img
        src={MainBG}
        className="block fixed w-full h-full top-0 bottom-0  right-0 left-0"
      />

      <section className="sm:px-4 sm:mt-32 mt-15 ">
        <section className="sm:pb-12  m-auto  ">
          {/* max-w-screen-2xl */}
          <Outlet></Outlet>
        </section>
      </section>
    </main>
  );
};
