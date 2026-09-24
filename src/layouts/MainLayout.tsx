import { Outlet } from "react-router";

import Navbar from "../components/layout/Navbar";

function MainLayout() {
  return (
    <>
      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;