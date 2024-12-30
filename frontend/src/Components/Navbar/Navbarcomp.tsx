import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

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

  return (
    // <nav className="  bg-white text-black py-4 px-6 shadow-md">
    <nav className=" text-black py-4 px-6   top-0 left-0 right-0 z-10 ">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Title */}
        <div className="flex items-center space-x-5">
          <Link
            to="/dashboard"
            className="text-black hover:text-gray-600 flex items-center"
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
            {" "}
            <Button
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              className="text-black px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black transition duration-200"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => navigate("/leads")}
              variant="ghost"
              className="text-black px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black transition duration-200"
            >
              Leads
            </Button>
            <NavigationMenu className="relative inline-block">
              <NavigationMenuList className="list-none p-0 m-0">
                <NavigationMenuItem className="group">
                  <NavigationMenuTrigger className="px-4 py-2 cursor-pointer  hover:bg-gray-200">
                    Clients
                    <ChevronDown
                      className="relative top-[1px] ml-1 h-4  "
                      aria-hidden="true"
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="flex  flex-col items-center justify-center">
                    {/* <h1 className="text-sm font-semibold cursor-default mt-2 ">
                      Products
                    </h1>
                    <Separator className="my-2 w-full justify-center" /> */}

                    <Button
                      className="w-full text-sm "
                      variant={"ghost"}
                      onClick={() => navigate("/clients")}
                    >
                      Clients
                    </Button>
                    <Separator className=" w-full justify-center" />

                    <Button
                      variant={"ghost"}
                      onClick={() => navigate("/contacts")}
                    >
                      Contacts
                    </Button>
                    <Separator className=" w-full justify-center" />
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu className="relative inline-block">
              <NavigationMenuList className="list-none p-0 m-0">
                <NavigationMenuItem className="group">
                  <NavigationMenuTrigger className="px-4 py-2 cursor-pointer   hover:bg-gray-200">
                    Products
                    <ChevronDown
                      className="relative top-[1px] ml-1 h-4  "
                      aria-hidden="true"
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="flex flex-col items-start justify-center w-full">
                    <Button
                      className="w-full text-sm text-left"
                      variant={"ghost"}
                      onClick={() => navigate("/suppliers")}
                    >
                      Suppliers
                    </Button>
                    <Separator className="w-full justify-center" />

                    <Button
                      variant={"ghost"}
                      className="w-full text-left"
                      onClick={() => navigate("/productCategories")}
                    >
                      Product Categories
                    </Button>
                    <Separator className="w-full justify-center" />

                    <Button
                      className="w-full text-sm text-left"
                      variant={"ghost"}
                      onClick={() => navigate("/products")}
                    >
                      Products
                    </Button>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Button
              className="text-sm"
              variant={"ghost"}
              onClick={() => navigate("/invoices")}
            >
              Invoices
            </Button>
            <NavigationMenu className="relative inline-block">
              <NavigationMenuList className="list-none p-0 m-0">
                <NavigationMenuItem className="group">
                  <NavigationMenuTrigger className="px-4 py-2 cursor-pointer hover:bg-gray-200">
                    {" "}
                    Users
                    <ChevronDown
                      className="relative top-[1px] ml-1 h-4  "
                      aria-hidden="true"
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="flex flex-col items-center justify-center">
                    <Button
                      onClick={() => navigate("/employees")}
                      variant="ghost"
                      className="text-black px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black transition duration-200"
                    >
                      Employees
                    </Button>
                    <Separator className="w-full justify-center" />

                    <Button
                      onClick={() => navigate("/departments")}
                      variant="ghost"
                      className="text-black px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black transition duration-200"
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
                <Button variant="ghost" size="icon">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="cursor-pointer">
                        <Bell className="h-4" style={{ strokeWidth: 2 }} />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="h-[500px] w-[400px]">
                      <Tabs defaultValue="account" className="w-[400px]">
                        <TabsList>
                          <TabsTrigger value="account">Signals</TabsTrigger>
                        </TabsList>
                        <Separator className="my-2 w-[370px]" />

                        <TabsContent
                          className="w-[370px] p-4 bg-white border border-gray-300 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:translate-y-1"
                          value="account"
                        >
                          Your Signal/Notification Will Be Listed Here.
                        </TabsContent>
                      </Tabs>
                    </PopoverContent>
                  </Popover>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Signals</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="ghost" size="icon">
            <CalendarDays className="h-4" style={{ strokeWidth: 2 }} />
          </Button>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(true)}
                  >
                    <Search className="h-4" style={{ strokeWidth: 2 }} />
                  </Button>

                  <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Search Modules..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      {navItems.map((item) => {
                        if (item.children && item.children.length > 0) {
                          return (
                            <CommandGroup heading={item.title} key={item.title}>
                              {item.children?.map((child) => {
                                const Icon =
                                  Icons[child.icon || "arrowRight675"];
                                const isActive =
                                  location.pathname === child.href;

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
                                      {Icon && (
                                        <Icon
                                          className={`ml-3 size-5 flex-none`}
                                        />
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
                <TooltipContent>
                  <p>Search </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
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
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex items-center space-x-2">
                <CircleUserRound className="h-5" />
                <span>My Account</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center space-x-3">
                <Settings className="h-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-3">
                <Headset className="h-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center space-x-3"
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
