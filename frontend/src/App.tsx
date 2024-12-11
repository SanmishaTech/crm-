import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "@/Packages/Login/Login";
import Dashboard from "./Pages/Dashboard";
import { Toaster, toast } from "sonner";
import { useLocation } from "react-router-dom";

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
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
  console.log("This is data", navItems);

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
        <Route path="/holiday" element={<Dashboard />} />
        <Route path="/services" element={<Dashboard />} />
        <Route path="/department" element={<Dashboard />} />
        <Route path="/productmaster" element={<Dashboard />} />
        <Route path="/companymaster" element={<Dashboard />} />
        <Route path="/productcategory" element={<Dashboard />} />
        <Route path="/parameter" element={<Dashboard />} />
        <Route path="/reason" element={<Dashboard />} />
        <Route path="/barcode" element={<Dashboard />} />
        <Route path="/prefix" element={<Dashboard />} />
        <Route path="/highlighter" element={<Dashboard />} />
        <Route path="/parametergroup" element={<Dashboard />} />
        <Route path="/specimen" element={<Dashboard />} />
        <Route path="/container" element={<Dashboard />} />
        <Route path="/testmaster" element={<Dashboard />} />
        <Route path="/testmaster/add" element={<Dashboard />} />
        <Route path="/testmaster/edit/:id" element={<Dashboard />} />
        <Route path="/testlinkmaster" element={<Dashboard />} />
        <Route path="/promocodemaster" element={<Dashboard />} />
        <Route path="/associatemaster" element={<Dashboard />} />
        <Route path="/associatemaster/add" element={<Dashboard />} />
        <Route path="/associatemaster/edit/:id" element={<Dashboard />} />
        <Route path="/corporate" element={<Dashboard />} />
        <Route path="/corporate/add" element={<Dashboard />} />
        <Route path="/corporate/edit/:id" element={<Dashboard />} />
        <Route path="/patientmaster" element={<Dashboard />} />
        <Route path="/patientmaster/add" element={<Dashboard />} />
        <Route path="/patientmaster/edit/:id" element={<Dashboard />} />
        <Route path="/tatmaster" element={<Dashboard />} />
        <Route path="/tatmaster/add" element={<Dashboard />} />
        <Route path="/tatmaster/edit/:id" element={<Dashboard />} />
        <Route path="/formula" element={<Dashboard />} />
        <Route path="/machinemaster" element={<Dashboard />} />
        <Route path="/machinelinkmaster" element={<Dashboard />} />
        <Route path="/containerLinkMaster" element={<Dashboard />} />
        <Route path="/discountmaster" element={<Dashboard />} />
        <Route path="/rolemaster" element={<Dashboard />} />
        <Route path="/assignaccess" element={<Dashboard />} />
        <Route path="/usermaster" element={<Dashboard />} />
        <Route path="/leads" element={<Dashboard />} />
        <Route path="/leads/add" element={<Dashboard />} />
        <Route path="/leads/edit/:id" element={<Dashboard />} />
        <Route path="/accounts" element={<Dashboard />} />
        <Route path="/accounts/add" element={<Dashboard />} />
        <Route path="/contacts" element={<Dashboard />} />
        <Route path="/contacts/add" element={<Dashboard />} />
        <Route path="/departmentPage" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
