import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, Search, Ellipsis, Bell, Settings } from "lucide-react";
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
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
            </svg>
            <span className="text-lg font-semibold">CRM</span>
          </Link>

          {/* Navigation Links */}
          <div className="space-x-4">
            <Link to="/dashboard" className="text-black hover:text-gray-600">
              Dashboard
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  Master
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Masters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/department"); // No token removal here
                  }}
                >
                  Department
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  Access
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Access Control</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/rolemaster"); // No token removal here
                  }}
                >
                  Role Master
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/assignaccess"); // No token removal here
                  }}
                >
                  Assign Access
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="#" className="text-black hover:text-gray-600">
              Leads
            </Link>
            <Link to="#" className="text-black hover:text-gray-600">
              Contacts
            </Link>
            <Link to="#" className="text-black hover:text-gray-600">
              Accounts
            </Link>
            <Link to="#" className="text-black hover:text-gray-600">
              Deals
            </Link>
            <Link to="#" className="text-black hover:text-gray-600">
              Tasks
            </Link>
            <Link to="#" className="text-black hover:text-gray-600">
              Accounts
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select Modules</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Meetings</DropdownMenuItem>
                <DropdownMenuItem>Invoices</DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    navigate("/dashboard"); // No token removal here
                  }}
                >
                  Products
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* User Profile / Avatar */}
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {" "}
                <Button variant="ghost" size="icon">
                  <Popover>
                    <PopoverTrigger>
                      {" "}
                      <Bell className="h-4 w-4" />
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
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <CalendarDays className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
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
    </nav>
  );
};

export default Navbar;
