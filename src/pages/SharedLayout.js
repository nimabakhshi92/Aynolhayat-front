import { Outlet } from "react-router-dom";
import Header from "../components/header";

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
