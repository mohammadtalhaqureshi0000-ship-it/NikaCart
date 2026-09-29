import React from "react";
import { Outlet } from "react-router-dom";

import AutoLogout from "./AutoLogout";

const RootLayout = () => {
  return (
    <>
      <AutoLogout />
      <Outlet />
    </>
  );
};

export default RootLayout;
