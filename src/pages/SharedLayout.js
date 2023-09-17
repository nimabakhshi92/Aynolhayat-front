import { Outlet } from "react-router-dom";
import Header from "../components/header";

export const SharedLayout = () => {
  return (
    <main className="pb-2">
      <Header />
      <section className="pb-12 m-auto max-w-screen-2xl">
        <Outlet></Outlet>
      </section>
    </main>
  );
};
