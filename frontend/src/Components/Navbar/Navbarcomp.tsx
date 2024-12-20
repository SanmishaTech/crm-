import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  EllipsisVertical,
  CalendarDays,
  Search,
  Bell,
  Settings,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import userAvatar from "@/images/Profile.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const [isExploreOpen] = useState(false);

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
    <nav className="bg-white text-black py-4 px-6 shadow-md">
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

            <DropdownMenu>
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
            </DropdownMenu>

            {/* <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
                  className="p-2" // Adding padding instead of fixed width
                >
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search Modules..." />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {frameworks.map((framework) => (
                        <CommandItem
                          key={framework.value}
                          value={framework.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);

                            if (currentValue === "meetings") {
                              navigate("/dashboard"); // Navigate to /dashboard when Astro is selected
                            } else if (currentValue === "products") {
                              navigate("/users"); // Navigate to /users when Remix is selected
                            } else {
                              navigate("#"); // Navigate to # for all other frameworks
                            }
                          }}
                        >
                          {framework.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === framework.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover> */}
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
            <Settings className="h-4" style={{ strokeWidth: 2 }} />
          </Button>
          <Button variant="ghost" size="icon">
            <CalendarDays className="h-4" style={{ strokeWidth: 2 }} />
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-4" style={{ strokeWidth: 2 }} />
          </Button>

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
