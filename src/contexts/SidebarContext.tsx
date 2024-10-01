import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define the context type
interface SidebarContextType {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

// Create a context with a default value that matches the type
const SidebarContext = createContext<SidebarContextType>({
  open: true,
  setOpen: () => {},
});

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Hook to use the Sidebar context
export const useSideBar = () => useContext(SidebarContext);
