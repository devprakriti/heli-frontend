import { Outlet } from "react-router-dom";

import SideNav from "../components/SideNav/SideNav";

const BaseLayout = () => (
  <div className="flex flex-col h-screen overflow-hidden">
    <div className="sticky w-full top-0 z-20 flex items-center justify-between px-[10px] h-[60px] py-[10px] bg-blue">
      Spin & Win
    </div>
    <div className="flex h-full">
      <SideNav />
      <Outlet />
    </div>
  </div>
);

export default BaseLayout;
