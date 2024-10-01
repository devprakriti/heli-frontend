import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { LogOutSvg, CollapseSvg, ExpandSvg } from "../../icons/AllSvgs";
import AlertDialog from "../UI/AlertDialog";
import Tooltip from "../UI/Tooltip";
import SideNavLinks from "./SideNavLinks";
import { removeAuthDetails } from "../../utils/cookie";
import { useAuth } from "../../contexts/AuthContext";
import { useSideBar } from "../../contexts/SidebarContext";

export default function SideNav() {
  const navigate = useNavigate();
  const { updateToast } = useToast();
  const { setAuth } = useAuth();
  const { open } = useSideBar();

  const alertDescription =
    "Logging out will end your current session and you will need to enter your credentials again to access your account.";

  return (
    <aside className="bg-lightGray z-30 flex flex-col gap-4 shadow-r">
      <SideNavLinks isExpanded={open} />
      <AlertDialog
        clickHandler={() => {
          setAuth({
            token: "",
            userInfo: {},
            permissions: null,
          });
          removeAuthDetails();
          updateToast("Logged Out Successfully", "success");
          navigate("/auth");
        }}
        description={alertDescription}
        btnText="Yes, log me out"
        triggerClassName="flex items-center gap-4 py-5 px-6 mb-6 font-medium text-white hover:text-dangerDark hover:bg-darkGray"
      >
        {open ? (
          <LogOutSvg className="h-7" />
        ) : (
          <Tooltip content="Log Out" side="right" sideOffset={20} asChild>
            <span>
              <LogOutSvg className="h-7" />
            </span>
          </Tooltip>
        )}
        {open ? <span>Log Out</span> : null}
      </AlertDialog>
    </aside>
  );
}
