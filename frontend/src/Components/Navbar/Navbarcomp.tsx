import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

import {
  EllipsisVertical,
  CalendarDays,
  Search,
  Bell,
  Settings,
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
  const [isExploreOpen] = useState(false);
  const [open, setOpen] = useState(false);

  // Handle navigation to dashboard
  const handleDashboardNavigate = () => {
    navigate("/dashboard");
  };

  const handleSuppliersNavigate = () => {
    navigate("/suppliers");
  };

  // Handle navigation to leads page
  const handleContactsNavigate = () => {
    navigate("/contacts");
  };

  const handleClientsNavigate = () => {
    navigate("/clients");
  };
  const handleLeadsNavigate = () => {
    navigate("/leads");
  };
  const handleDepartmentNavigate = () => {
    navigate("/departments");
  };

  return (
    // <nav className="  bg-white text-black py-4 px-6 shadow-md">
    <nav className="bg-white text-black py-4 px-6   top-0 left-0 right-0 z-50">
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
            <Button
              onClick={handleDashboardNavigate}
              variant="ghost"
              className="text-black px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black transition duration-200"
            >
              Dashboard
            </Button>
            <Button
              onClick={handleDepartmentNavigate}
              variant="ghost"
              className="text-black px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black transition duration-200"
            >
              Department
            </Button>
            <Button
              onClick={handleSuppliersNavigate}
              variant="ghost"
              className="text-black px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black transition duration-200"
            >
              Suppliers
            </Button>

            <Button
              onClick={handleContactsNavigate}
              variant="ghost"
              className="text-black px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black transition duration-200"
            >
              Contacts
            </Button>
            <Button
              onClick={handleClientsNavigate}
              variant="ghost"
              className="text-black px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black transition duration-200"
            >
              Clients
            </Button>
            <Button
              onClick={handleLeadsNavigate}
              variant="ghost"
              className="text-black px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black transition duration-200"
            >
              Leads
            </Button>
            <NavigationMenu className="relative inline-block">
              <NavigationMenuList className="list-none p-0 m-0">
                <NavigationMenuItem className="group">
                  <NavigationMenuTrigger className="px-4 py-2 cursor-pointer hover:bg-gray-200"></NavigationMenuTrigger>
                  <NavigationMenuContent className="flex flex-col items-center justify-center">
                    <h1 className="text-sm font-semibold cursor-default mt-2 ">
                      Masters
                    </h1>
                    <Separator className="my-2 w-full justify-center" />
                    <Button
                      className="w-full text-sm"
                      variant={"ghost"}
                      onClick={() => navigate("/products")}
                    >
                      Products
                    </Button>
                    <Button
                      variant={"ghost"}
                      onClick={() => navigate("/productCategories")}
                    >
                      Product Categories
                    </Button>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 hover:underline transition duration-200 "
                >
                  <EllipsisVertical className="h-4 w-4 " />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Masters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/products");
                  }}
                >
                  Products
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/productCategories");
                  }}
                >
                  Product Categories
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>

        {/* User Profile / Avatar */}
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
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      {navItems.map((item) => {
                        if (item.children && item.children.length > 0) {
                          return (
                            <CommandGroup heading={item.title} key={item.title}>
                              {item.children.map((child) => {
                                const Icon =
                                  Icons[child.icon || "arrowRight675"]; // Assuming Icons is a predefined object
                                return (
                                  <div
                                    className="flex items-center gap-2 w-full"
                                    key={child.title}
                                  >
                                    <CommandItem
                                      className="w-full flex items-center gap-2 overflow-hidden rounded-md py-1 text-sm font-medium hover:bg-secondary hover:text-iconActive"
                                      onSelect={() => {
                                        // Navigate logic goes here
                                        setOpen(false); // Close the dialog after selection
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
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  // Token is only cleared on logout
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/"); // Redirect to login page after logout
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isExploreOpen && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white shadow-lg">
          <div className="w-[90%] mx-auto py-8">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Sales</h3>
                <ul className="space-y-2">
                  <li>Leads</li>
                  <li>Accounts</li>
                  <li>Contacts</li>
                  <li>Deals</li>
                </ul>
              </div>

              {/* Marketing Section */}
              <div>
                <h3 className="font-semibold mb-4">Marketing</h3>
                <ul className="space-y-2">
                  <li>Campaigns</li>
                  <li>Forms</li>
                  <li>Email Templates</li>
                </ul>
              </div>

              {/* Support Section */}
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li>Tickets</li>
                  <li>Call Center</li>
                  <li>Knowledge Base</li>
                </ul>
              </div>

              {/* Analytics Section */}
              <div>
                <h3 className="font-semibold mb-4">Analytics</h3>
                <ul className="space-y-2">
                  <li>Reports</li>
                  <li>Dashboards</li>
                  <li>Analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
