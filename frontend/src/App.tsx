import { useState, useEffect } from "react";

import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "@/Packages/Login/Login";
import Dashboard from "./Pages/Dashboard";
import { Toaster, toast } from "sonner";
import { useLocation } from "react-router-dom";
import Edit from "./Components/Suppliers/Edit";
import EditContacts from "./Components/Contacts/Edit";
import EditClients from "./Components/Clients/Edit";
// import EditProducts from "./Components/Products/Edit";
import EditLeads from "./Components/Leads/Edit";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/darktheme/CustomTheme";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronUp } from "lucide-react";

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  Table,
  User,
} from "lucide-react";
import LeadsEdit from "@/Components/Leads/Edit";

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
// import Navbar from "@/Navbar/NewNavbar";
import Navbar from "@/Components/Navbar/Navbarcomp";

import { navItems } from "@/Config/data";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

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
  useEffect(() => {
    const handleScroll = () => {
      // Show the button if scrolled past half of the page
      const halfPage = window.innerHeight / 2;
      setIsVisible(window.scrollY > halfPage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="overflow-x-hidden  ">
      <Toaster
        position="top-right"
        theme={theme === "dark" ? "dark" : "light"}
        closeButton
        className={theme === "dark" ? "toaster-red" : "toaster-light"}
      />

      {isLoggedIn && <Navbar />}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search Modules..." />
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
        <Route path="/suppliers/edit/:id" element={<Dashboard />} />
        <Route path="/contacts" element={<Dashboard />} />
        <Route path="/contacts/add" element={<Dashboard />} />
        <Route path="/contacts/edit/:id" element={<Dashboard />} />
        <Route path="/clients" element={<Dashboard />} />
        <Route path="/clients/add" element={<Dashboard />} />
        <Route path="/clients/edit/:id" element={<Dashboard />} />
        <Route path="/leads" element={<Dashboard />} />
        <Route path="/leads/add" element={<Dashboard />} />
        <Route path="/leads/edit/:id" element={<LeadsEdit />} />
        <Route path="/leads/followUps/:id" element={<Dashboard />} />
        <Route path="/leads/generateQuotation/:id" element={<Dashboard />} />
        <Route path="/leads/generateInvoice/:id" element={<Dashboard />} />
        <Route path="/inventory" element={<Dashboard />} />
        <Route path="/inventory/add" element={<Dashboard />} />

        <Route path="/departments" element={<Dashboard />} />
        <Route path="/departments/add" element={<Dashboard />} />
        <Route path="/productCategories" element={<Dashboard />} />
        <Route path="/productCategories/add" element={<Dashboard />} />
        <Route path="/products" element={<Dashboard />} />
        <Route path="/products/add" element={<Dashboard />} />
        <Route path="/products/edit/:id" element={<Dashboard />} />
        <Route path="/invoices" element={<Dashboard />} />
        <Route path="/invoices/edit/:id" element={<Dashboard />} />
        <Route path="/employees" element={<Dashboard />} />
        <Route path="/employees/add" element={<Dashboard />} />
        <Route path="/employees/edit/:id" element={<Dashboard />} />
      </Routes>
      {isVisible && (
        <Button
          type="button"
          variant="ghost"
          onClick={(event) => {
            event.preventDefault(); // Prevent unintended form submission
            scrollToTop();
          }}
          className="fixed bottom-[24px] bg-accent/80 right-[12rem] transition"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ChevronUp />
              </TooltipTrigger>
              <TooltipContent>
                <p>Scroll to top</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      )}
    </div>
  );
}

export default App;
