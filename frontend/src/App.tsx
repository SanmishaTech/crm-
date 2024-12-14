import { useState, useEffect } from "react";

import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "@/Packages/Login/Login";
import Dashboard from "./Pages/Dashboard";
import { Toaster, toast } from "sonner";
import { useLocation } from "react-router-dom";
import Edit from "./Components/Suppliers/Edit";

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  Table,
  User,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Icons } from "@/Dashboard/Icon";
import { Editor } from "@/Components/Editor/Editor";
import Navbar from "@/Components/Navbar/Navbarcomp"; // Import Navbar
import { navItems } from "@/Config/data";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in (this could be replaced with your actual login check logic)
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div>
      <Toaster position="top-right" />
      {/* Conditionally render Navbar based on isLoggedIn */}
      {isLoggedIn && <Navbar />}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {navItems.map((item) => {
            if (item.children && item.children.length > 0) {
              return (
                <CommandGroup heading={item.title} key={item.title}>
                  {item.children?.map((child) => {
                    const Icon = Icons[child.icon || "arrowRight675"];
                    const isActive = location.pathname === child.href;

                    return (
                      <div
                        className="flex items-center gap-2 w-full"
                        key={child.title}
                      >
                        <CommandItem
                          className="w-full flex items-center gap-2 overflow-hidden rounded-md py-1 text-sm font-medium hover:bg-secondary hover:text-iconActive"
                          onSelect={() => {
                            navigate(child.href);
                            setOpen(false);
                          }}
                        >
                          {Icon && <Icon className={`ml-3 size-5 flex-none`} />}
                          {child.title}
                        </CommandItem>
                      </div>
                    );
                  })}
                </CommandGroup>
              );
            }
            return null;
          })}
        </CommandList>
      </CommandDialog>

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registration" element={<Dashboard />} />
        <Route path="/registrationlist" element={<Dashboard />} />
        <Route path="/suppliers" element={<Dashboard />} />
        <Route path="/suppliers/add" element={<Dashboard />} />
        <Route path="/suppliers/edit/:id" element={<Edit />} />
        <Route path="/departments" element={<Dashboard />} />
        <Route path="/departments/add" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
