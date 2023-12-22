import { Outlet } from "react-router-dom";
import Header from "../components/header";
import { HeaderLT } from "../components/HeaderLT";
import { SidebarLT } from "../components/SidebarLT";

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
  return (
    <main
      style={{
        backgroundColor: "var(--blue-100)",
      }}
      className="pb-2 min-h-[100vh]"
    >
      <HeaderLT />
      <SidebarLT />
      <section className="section-center  ">
        <section className="pb-12  m-auto max-w-screen-2xl ">
          <Outlet></Outlet>
        </section>
      </section>
    </main>
  );
};
