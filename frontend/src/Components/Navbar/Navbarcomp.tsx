import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/darktheme/CustomTheme";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import CalenderDay from "./CalenderDay";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  ChartNoAxesGantt,
  Search,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Notebook,
  Users,
  Target,
  UserCheck,
  Package,
  Layers,
  ShoppingCart,
  Archive,
  RefreshCcw,
  Building2,
  UserCog,
  ShieldCheck,
  Key,
  FileText,
  Receipt,
  Wallet,
  CreditCard,
  Calendar,
  LayoutDashboard,
  Warehouse,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";

import { Icons } from "@/Dashboard/Icon";
import { navItems } from "@/Config/data";

import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const roleName = localStorage.getItem("role") || "";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleNavigation = () => {
    navigate("/notepad"); // Navigate to the desired route
  };

  const handleLogout = () => {
    // Clear both localStorage and sessionStorage on logout
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  // Function to check if the current user role has access to a specific module
  const hasAccess = (module: string) => {
    const role = (localStorage.getItem("role") || "").trim().toLowerCase();
    const adminOnlyModules = ["roles", "permissions", "departments", "employees", "leadSources"];

    if (adminOnlyModules.includes(module)) {
      return role === "admin";
    }

    return true;
  };

  useEffect(() => {
    // Set a sessionStorage flag when page loads
    sessionStorage.setItem('isActive', 'true');

    const handleBeforeUnload = () => {
      // Only clear if this is a new page load (tab was actually closed)
      if (!sessionStorage.getItem('isActive')) {
        localStorage.clear();
      }
      sessionStorage.removeItem('isActive');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <nav className="bg-transparent fixed top-0 left-0 right-0 z-10 mt-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center border shadow-xl gap-2 lg:gap-4 p-2 sm:p-4 w-full max-w-7xl mx-auto rounded-2xl h-[3rem] justify-between bg-background/90 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Link
            to="/dashboard"
            className="text-foreground hover:text-muted-foreground flex items-center transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 h-5 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
            </svg>
            <span className="text-lg font-semibold">CRM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1 2xl:space-x-2">
            {hasAccess("dashboard") && (
              <Button
                onClick={() => navigate("/dashboard")}
                variant="ghost"
                className="text-foreground hover:text-foreground/80 hover:bg-accent flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-3 py-2 cursor-pointer text-foreground hover:bg-accent flex items-center gap-1"
                >
                  Leads
                  <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-1">
                {hasAccess("leadSources") && (
                  <DropdownMenuItem
                    onClick={() => navigate("/leadSources")}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>Lead Sources</span>
                  </DropdownMenuItem>
                )}
                {hasAccess("leads") && (
                  <DropdownMenuItem
                    onClick={() => navigate("/leads")}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Leads</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {hasAccess("events") && (
              <Button
                onClick={() => navigate("/events")}
                variant="ghost"
                className="text-foreground hover:text-foreground/80 hover:bg-accent flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Events
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-3 py-2 cursor-pointer text-foreground hover:bg-accent flex items-center gap-1"
                >
                  Clients
                  <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-1">
                {hasAccess("clients") && (
                  <DropdownMenuItem
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                    onClick={() => navigate("/clients")}
                  >
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span>Clients</span>
                  </DropdownMenuItem>
                )}
                {hasAccess("contacts") && (
                  <DropdownMenuItem
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                    onClick={() => navigate("/contacts")}
                  >
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Contacts</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-3 py-2 cursor-pointer text-foreground hover:bg-accent flex items-center gap-1"
                >
                  Products
                  <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-1">
                {hasAccess("productCategories") && (
                  <DropdownMenuItem
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                    onClick={() => navigate("/productCategories")}
                  >
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span>Product Categories</span>
                  </DropdownMenuItem>
                )}
                {hasAccess("suppliers") && (
                  <DropdownMenuItem
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                    onClick={() => navigate("/suppliers")}
                  >
                    <Warehouse className="h-4 w-4 text-muted-foreground" />
                    <span>Suppliers</span>
                  </DropdownMenuItem>
                )}
                {hasAccess("products") && (
                  <DropdownMenuItem
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                    onClick={() => navigate("/products")}
                  >
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>Products</span>
                  </DropdownMenuItem>
                )}
                {hasAccess("purchase") && (
                  <DropdownMenuItem
                    onClick={() => navigate("/purchase")}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <span>Purchase</span>
                  </DropdownMenuItem>
                )}
                {hasAccess("inventory") && (
                  <DropdownMenuItem
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                    onClick={() => navigate("/inventory")}
                  >
                    <Archive className="h-4 w-4 text-muted-foreground" />
                    <span>Inventory</span>
                  </DropdownMenuItem>
                )}
                {hasAccess("replacements") && (
                  <DropdownMenuItem
                    onClick={() => navigate("/replacements")}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                    <span>Replacements & Repair</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-3 py-2 cursor-pointer text-foreground hover:bg-accent flex items-center gap-1"
                >
                  Administration
                  <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-1">
                {hasAccess("departments") && (
                  <DropdownMenuItem
                    onClick={() => navigate("/departments")}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>Departments</span>
                  </DropdownMenuItem>
                )}
                {hasAccess("employees") && (
                  <DropdownMenuItem
                    onClick={() => navigate("/employees")}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <UserCog className="h-4 w-4 text-muted-foreground" />
                    <span>Employees</span>
                  </DropdownMenuItem>
                )}
                {hasAccess("roles") && (
                  <DropdownMenuItem
                    onClick={() => navigate("/roles")}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <span>Roles</span>
                  </DropdownMenuItem>
                )}
                {hasAccess("permissions") && (
                  <DropdownMenuItem
                    onClick={() => navigate("/permissions")}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <span>Permissions</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-3 py-2 cursor-pointer text-foreground hover:bg-accent flex items-center gap-1"
                >
                  Operations
                  <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-1">
                {hasAccess("challans") && (
                  <DropdownMenuItem
                    onClick={() => navigate("/challans")}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Challan</span>
                  </DropdownMenuItem>
                )}
                {hasAccess("invoices") && (
                  <DropdownMenuItem
                    onClick={() => navigate("/invoices")}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    <span>Invoices</span>
                  </DropdownMenuItem>
                )}
                {hasAccess("expense_heads") && (
                  <DropdownMenuItem
                    onClick={() => navigate("/expense_heads")}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span>Expense Head</span>
                  </DropdownMenuItem>
                )}
                {hasAccess("expense") && (
                  <DropdownMenuItem
                    onClick={() => navigate("/expense")}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>Expense</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    className="text-foreground hover:text-foreground/80 hover:bg-accent"
                  >
                    <Search className="h-4" style={{ strokeWidth: 1.5 }} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search Modules</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="ghost"
              size="icon"
              className="ml-2 xl:hidden p-0 hover:bg-transparent hover:opacity-100 focus:outline-none focus:ring-0"
              onClick={() => setIsSheetOpen(!isSheetOpen)}
            >
              <ChartNoAxesGantt className="h-5" />
            </Button>

            <CalenderDay />
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Notebook
                      className="h-4 relative top-[2px] cursor-pointer"
                      onClick={handleNavigation}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative flex items-center">
              <button
                onClick={handleThemeToggle}
                className={cn(
                  "w-[3.53rem] h-7 rounded-full p-0.5 transition-colors duration-200 relative",
                  theme === "light" ? "bg-slate-200" : "bg-slate-700"
                )}
              >
                <span
                  className={cn(
                    "absolute text-[10px] top-1.5 font-medium hidden sm:block",
                    theme === "light" ? "right-1.5" : "left-1.5"
                  )}
                >
                  {theme === "light" ? "Light" : "Dark"}
                </span>
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full transition-transform duration-200 transform",
                    theme === "light"
                      ? "translate-x-0 bg-white"
                      : "translate-x-7 bg-slate-900"
                  )}
                >
                  {theme === "light" ? (
                    <Sun className="h-3 w-3 text-yellow-800" />
                  ) : (
                    <Moon className="h-3 w-3 text-slate-200" />
                  )}
                </div>
              </button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 overflow-hidden rounded-full border-border bg-primary/10 text-primary font-semibold hover:bg-primary/20 flex items-center justify-center"
                >
                  {getInitials(userName)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-popover border-border w-56"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none capitalize">{userName} {roleName && `- ${roleName}`}</p>
                    <p className="text-xs leading-none text-muted-foreground pt-1">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  className="flex items-center space-x-3 text-foreground hover:text-foreground/80 hover:bg-accent cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className={`xl:hidden bg-background ${isSheetOpen ? "block" : "hidden"} pt-2 pb-3 px-2`}>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Select the Module</SheetTitle>
              <SheetDescription>Choose the module</SheetDescription>
            </SheetHeader>

            <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
              <div className="space-y-0">
                {hasAccess("dashboard") && (
                  <Button
                    onClick={() => {
                      navigate("/dashboard");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Dashboard
                  </Button>
                )}
                {hasAccess("leadSources") && (
                  <Button
                    onClick={() => {
                      navigate("/leadSources");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Lead Sources
                  </Button>
                )}
                {hasAccess("leads") && (
                  <Button
                    onClick={() => {
                      navigate("/leads");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Leads
                  </Button>
                )}
                {hasAccess("events") && (
                  <Button
                    onClick={() => {
                      navigate("/events");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Events
                  </Button>
                )}
                {hasAccess("clients") && (
                  <Button
                    onClick={() => {
                      navigate("/clients");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Clients
                  </Button>
                )}
                {hasAccess("contacts") && (
                  <Button
                    onClick={() => {
                      navigate("/contacts");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Contacts
                  </Button>
                )}
                {hasAccess("productCategories") && (
                  <Button
                    onClick={() => {
                      navigate("/productCategories");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Product Categories
                  </Button>
                )}
                {hasAccess("suppliers") && (
                  <Button
                    onClick={() => {
                      navigate("/suppliers");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Suppliers
                  </Button>
                )}
                {hasAccess("products") && (
                  <Button
                    onClick={() => {
                      navigate("/products");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Products
                  </Button>
                )}
                {hasAccess("purchase") && (
                  <Button
                    onClick={() => {
                      navigate("/purchase");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Purchase
                  </Button>
                )}
                {hasAccess("inventory") && (
                  <Button
                    onClick={() => {
                      navigate("/inventory");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Inventory
                  </Button>
                )}
                {hasAccess("replacements") && (
                  <Button
                    onClick={() => {
                      navigate("/replacements");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Replacements & Repair
                  </Button>
                )}
                {hasAccess("departments") && (
                  <Button
                    onClick={() => {
                      navigate("/departments");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Departments
                  </Button>
                )}
                {hasAccess("employees") && (
                  <Button
                    onClick={() => {
                      navigate("/employees");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Employees
                  </Button>
                )}
                {hasAccess("challans") && (
                  <Button
                    onClick={() => {
                      navigate("/challans");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Challans
                  </Button>
                )}
                {hasAccess("invoices") && (
                  <Button
                    onClick={() => {
                      navigate("/invoices");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Invoices
                  </Button>
                )}
                {hasAccess("expense_heads") && (
                  <Button
                    onClick={() => {
                      navigate("/expense_heads");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Expense Head
                  </Button>
                )}
                {hasAccess("expense") && (
                  <Button
                    onClick={() => {
                      navigate("/expense");
                      setIsSheetOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-left justify-start"
                  >
                    Expense
                  </Button>
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput
          placeholder="Search Modules..."
          className="bg-background text-foreground"
        />
        <CommandList className="bg-background text-foreground">
          <CommandEmpty>No results found.</CommandEmpty>
          {navItems.map((item) => {
            if (item.children && item.children.length > 0) {
              return (
                <CommandGroup heading={item.title} key={item.title}>
                  {item.children?.map((child) => {
                    const Icon = Icons[child.icon || "arrowRight675"];
                    return (
                      <div
                        className="flex items-center gap-2 w-full"
                        key={child.title}
                      >
                        <CommandItem
                          className="w-full flex items-center gap-2 text-foreground hover:text-foreground/80 hover:bg-accent"
                          onSelect={() => {
                            if (child.href) navigate(child.href);
                            setIsSearchOpen(false);
                          }}
                        >
                          {Icon && <Icon className="ml-3 size-5 flex-none" />}
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
    </nav>
  );
};

export default Navbar;
