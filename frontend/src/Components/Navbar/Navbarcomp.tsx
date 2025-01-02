import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/darktheme/CustomTheme";
import { cn } from "@/lib/utils";

import {
  EllipsisVertical,
  CalendarDays,
  Search,
  Bell,
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
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import userAvatar from "@/images/Profile.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleThemeToggle = () => {
    setIsAnimating(true);
    setTheme(theme === "light" ? "dark" : "light");
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <nav className="border-b bg-background py-4 px-6 top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Title */}
        <div className="flex items-center space-x-5">
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
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
            </svg>
            <span className="text-lg font-semibold">CRM</span>
          </Link>

          {/* Navigation Links */}
          <div className="space-x-3">
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
                  <NavigationMenuTrigger className="px-4 py-2 cursor-pointer text-foreground hover:bg-accent">
                    Clients
                    <ChevronDown
                      className="relative top-[1px] ml-1 h-4"
                      aria-hidden="true"
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="flex flex-col items-center justify-center bg-popover border rounded-md shadow-md">
                    <Button
                      className="w-full text-sm text-foreground hover:text-foreground/80 hover:bg-accent"
                      variant="ghost"
                      onClick={() => navigate("/clients")}
                    >
                      Clients
                    </Button>
                    <Separator className="w-full justify-center bg-border" />
                    <Button
                      variant="ghost"
                      className="w-full text-foreground hover:text-foreground/80 hover:bg-accent"
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
                  <NavigationMenuTrigger className="px-4 py-2 cursor-pointer text-foreground hover:bg-accent">
                    Products
                    <ChevronDown
                      className="relative top-[1px] ml-1 h-4"
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
            <NavigationMenu className="relative inline-block">
              <NavigationMenuList className="list-none p-0 m-0">
                <NavigationMenuItem className="group">
                  <NavigationMenuTrigger className="px-4 py-2 cursor-pointer text-foreground hover:bg-accent">
                    Users
                    <ChevronDown
                      className="relative top-[1px] ml-1 h-4"
                      aria-hidden="true"
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="flex flex-col items-center justify-center bg-popover border rounded-md shadow-md">
                    <Button
                      onClick={() => navigate("/employees")}
                      variant="ghost"
                      className="w-full text-foreground hover:text-foreground/80 hover:bg-accent"
                    >
                      Employees
                    </Button>
                    <Separator className="w-full justify-center bg-border" />
                    <Button
                      onClick={() => navigate("/departments")}
                      variant="ghost"
                      className="w-full text-foreground hover:text-foreground/80 hover:bg-accent"
                    >
                      Department
                    </Button>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:text-foreground/80 hover:bg-accent">
                  <Bell className="h-4" style={{ strokeWidth: 1.5 }} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground">
                <p>Signals</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="ghost" size="icon" className="text-foreground hover:text-foreground/80 hover:bg-accent">
            <CalendarDays className="h-4" style={{ strokeWidth: 1.5 }} />
          </Button>

          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(true)}
                    className="text-foreground hover:text-foreground/80 hover:bg-accent"
                  >
                    <Search className="h-4" style={{ strokeWidth: 1.5 }} />
                  </Button>
                  <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Search Modules..." className="bg-background text-foreground" />
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
                                      {Icon && (
                                        <Icon className="ml-3 size-5 flex-none" />
                                      )}
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
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-popover-foreground">
                  <p>Search</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* <div className="relative flex items-center">
            <button
              onClick={handleThemeToggle}
              className={cn(
                "w-[3.53rem] h-7 rounded-full p-0.5 transition-colors duration-200 relative",
                theme === "light" ? "bg-slate-200" : "bg-slate-700"
              )}
            >
              <span className={cn(
                "absolute text-[10px] top-1.5 font-medium",
                theme === "light" ? "right-1.5" : "left-1.5"
              )}>
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
          </div> */}

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
            <DropdownMenuContent align="end" className="bg-popover border-border">
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
    </nav>
  );
};

export default Navbar;
