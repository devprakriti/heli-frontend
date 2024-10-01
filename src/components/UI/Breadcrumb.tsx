import { useLocation, useNavigate } from "react-router-dom";
import { HamburgerSvg } from "../../icons/AllSvgs";
import { useSideBar } from "../../contexts/SidebarContext";

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { open, setOpen } = useSideBar();

  const paths = pathname === "/" ? ["dashboard"] : pathname.split("/").slice(1);

  return (
    <section className="flex gap-4 items-center h-[50px] text-[15px] font-medium text-grayText bg-white shadow-b">
      <button
        onClick={() => setOpen(!open)}
        className="bg-transparent hover:bg-gray-50 h-full w-[50px] flex items-center justify-center"
      >
        <HamburgerSvg className="h-6 w-6" />
      </button>
      <ol className="flex items-center gap-1">
        {paths.map((path, i) => (
          <li className="group flex items-center gap-1" key={path}>
            <button
              className="hover:text-blackText group-last:text-blackText"
              onClick={() => navigate(-(paths.length - i - 1))}
            >
              {path[0].toUpperCase() + path.slice(1)}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
