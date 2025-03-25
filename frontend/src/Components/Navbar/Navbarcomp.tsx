import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/darktheme/CustomTheme";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import CalenderDay from "./CalenderDay";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Seperator } from "@/components/ui/separator";

import {
  ChartNoAxesGantt,
  Search,
  Settings,
  Headset,
  LogOut,
  CircleUserRound,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
import userAvatar from "@/images/Profile.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="bg-transparent fixed top-0 left-0 right-0 z-10 mt-4    ">
      <div className="flex items-center border shadow-lg gap-4 p-4 min-w-[73%] max-w-[20rem] mx-auto rounded-xl h-[3rem] justify-between bg-background    ">
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

          {/* Mobile menu button */}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Existing navigation items */}
            <Button
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              className="text-foreground hover:text-foreground/80 hover:bg-accent"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => navigate("/leads")}
              variant="ghost"
              className="text-foreground hover:text-foreground/80 hover:bg-accent"
            >
              Leads
            </Button>

            <NavigationMenu className="relative inline-block">
              <NavigationMenuList className="list-none p-0 m-0">
                <NavigationMenuItem className="group">
                  <NavigationMenuTrigger className="px-2 py-2 cursor-pointer text-foreground hover:bg-accent">
                    Clients
                    <ChevronDown
                      className="relative top-[1px] ml- h-4"
                      aria-hidden="true"
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className=" flex flex-col  justify-end bg-popover  rounded-md shadow-md">
                    <Button
                      className=" flex justify-between w-full text-sm  hover:text-foreground/80 hover:bg-accent py-3"
                      variant="ghost"
                      onClick={() => navigate("/clients")}
                    >
                      Clients
                    </Button>
                    <Separator className="w-full justify-center bg-border" />
                    <Button
                      variant="ghost"
                      className=" text-sm hover:text-foreground/80 hover:bg-accent"
                      onClick={() => navigate("/contacts")}
                    >
                      Contacts
                    </Button>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu className="relative inline-block">
              <NavigationMenuList className="list-none p-0 m-0">
                <NavigationMenuItem className="group">
                  <NavigationMenuTrigger className="px-2 py-2 cursor-pointer text-foreground hover:bg-accent">
                    Products
                    <ChevronDown
                      className="relative top-[1px]  h-4"
                      aria-hidden="true"
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="flex flex-col items-start justify-center w-full bg-popover border rounded-md shadow-md">
                    <Button
                      className="w-full text-sm text-foreground hover:text-foreground/80 hover:bg-accent"
                      variant="ghost"
                      onClick={() => navigate("/suppliers")}
                    >
                      Suppliers
                    </Button>
                    <Separator className="w-full justify-center bg-border" />
                    <Button
                      variant="ghost"
                      className="w-full text-foreground hover:text-foreground/80 hover:bg-accent"
                      onClick={() => navigate("/productCategories")}
                    >
                      Product Categories
                    </Button>
                    <Separator className="w-full justify-center bg-border" />
                    <Button
                      className="w-full text-sm text-foreground hover:text-foreground/80 hover:bg-accent"
                      variant="ghost"
                      onClick={() => navigate("/products")}
                    >
                      Products
                    </Button>
                    <Separator className="w-full justify-center bg-border" />

                    <Button
                      onClick={() => navigate("/purchase")}
                      variant="ghost"
                      className="w-full text-sm text-foreground hover:text-foreground/80 hover:bg-accent"
                    >
                      Purchase
                    </Button>
                    <Separator className="w-full justify-center bg-border" />

                    <Button
                      onClick={() => navigate("/replacements")}
                      variant="ghost"
                      className="w-full text-sm text-foreground hover:text-foreground/80 hover:bg-accent"
                    >
                      Replacements & Repair
                    </Button>
                    <Separator className="w-full justify-center bg-border" />
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu className="relative inline-block">
              <NavigationMenuList className="list-none p-0 m-0">
                <NavigationMenuItem className="group">
                  <NavigationMenuTrigger className="px-2 py-2 cursor-pointer text-foreground hover:bg-accent">
                    Users
                    <ChevronDown
                      className="relative top-[1px]  h-4"
                      aria-hidden="true"
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="flex flex-col items-center justify-center bg-popover border rounded-md shadow-md">
                    <Button
                      onClick={() => navigate("/departments")}
                      variant="ghost"
                      className="w-full text-foreground hover:text-foreground/80 hover:bg-accent"
                    >
                      Department
                    </Button>
                    <Separator className="w-full justify-center bg-border" />
                    <Button
                      onClick={() => navigate("/employees")}
                      variant="ghost"
                      className="w-full text-foreground hover:text-foreground/80 hover:bg-accent"
                    >
                      Employees
                    </Button>
                    <Separator className="w-full justify-center bg-border" />

                    <Button
                      onClick={() => navigate("/challans")}
                      variant="ghost"
                      className="w-full text-foreground hover:text-foreground/80 hover:bg-accent"
                    >
                      Challan
                    </Button>
                    <Separator className="w-full justify-center bg-border" />

                    <Button
                      onClick={() => navigate("/expense_heads")}
                      variant="ghost"
                      className="w-full text-foreground hover:text-foreground/80 hover:bg-accent"
                    >
                      Expense Head
                    </Button>
                    <Separator className="w-full justify-center bg-border" />

                    <Button
                      onClick={() => navigate("/expense")}
                      variant="ghost"
                      className="w-full text-foreground hover:text-foreground/80 hover:bg-accent"
                    >
                      Expense
                    </Button>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button
              className="text-sm text-foreground hover:text-foreground/80 hover:bg-accent"
              variant="ghost"
              onClick={() => navigate("/invoices")}
            >
              Invoices
            </Button>
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
                    // onClick={() => setOpen(true)}
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
              className="ml-2 lg:hidden p-0 hover:bg-transparent hover:opacity-100 focus:outline-none focus:ring-0"
              onClick={() => setIsSheetOpen(!isSheetOpen)}
            >
              <ChartNoAxesGantt className="h-5" />
            </Button>
            <CalenderDay />
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
                    "absolute text-[10px] top-1.5 font-medium",
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
                  className="overflow-hidden rounded-full border-border"
                >
                  <img
                    src={userAvatar}
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-popover border-border"
              >
                <DropdownMenuLabel className="flex items-center space-x-2 text-foreground">
                  <CircleUserRound className="h-5" />
                  <span>My Account</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="flex items-center space-x-3 text-foreground hover:text-foreground/80 hover:bg-accent">
                  <Settings className="h-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-3 text-foreground hover:text-foreground/80 hover:bg-accent">
                  <Headset className="h-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  className="flex items-center space-x-3 text-foreground hover:text-foreground/80 hover:bg-accent"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/");
                  }}
                >
                  <LogOut className="h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden bg-background ${
          mobileMenuOpen ? "block" : "hidden"
        } pt-2  pb-3 px-2`}
      >
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Select the Module</SheetTitle>
              <SheetDescription>Choose the module</SheetDescription>
            </SheetHeader>

            <div className="space-y-0 ">
              <Button
                onClick={() => {
                  navigate("/dashboard");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Dashboard
              </Button>
              <Button
                onClick={() => {
                  navigate("/leads");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Leads
              </Button>

              <Button
                onClick={() => {
                  navigate("/clients");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Clients
              </Button>

              <Button
                onClick={() => {
                  navigate("/contacts");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Contacts
              </Button>

              <Button
                onClick={() => {
                  navigate("/suppliers");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Suppliers
              </Button>
              <Button
                onClick={() => {
                  navigate("/productCategories");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Product Categories
              </Button>
              <Button
                onClick={() => {
                  navigate("/products");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Products
              </Button>
              <Button
                onClick={() => {
                  navigate("/replacements");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Replacements & Repair
              </Button>
              <Button
                onClick={() => {
                  navigate("/purchase");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Purchase
              </Button>

              <Button
                onClick={() => {
                  navigate("/employees");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Employees
              </Button>
              <Button
                onClick={() => {
                  navigate("/challans");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Challans
              </Button>
              <Button
                onClick={() => {
                  navigate("/expense_heads");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Expense Head
              </Button>
              <Button
                onClick={() => {
                  navigate("/expense");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Expense
              </Button>
              <Button
                onClick={() => {
                  navigate("/departments");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Departments
              </Button>

              <Button
                onClick={() => {
                  navigate("/invoices");
                  setMobileMenuOpen(false);
                  setIsSheetOpen(false);
                }}
                variant="ghost"
                className="w-full text-left justify-start"
              >
                Invoices
              </Button>
            </div>
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
                    const isActive = location.pathname === child.href;
                    return (
                      <div
                        className="flex items-center gap-2 w-full"
                        key={child.title}
                      >
                        <CommandItem
                          className="w-full flex items-center gap-2 text-foreground hover:text-foreground/80 hover:bg-accent"
                          onSelect={() => {
                            navigate(child.href);
                            setOpen(false);
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
