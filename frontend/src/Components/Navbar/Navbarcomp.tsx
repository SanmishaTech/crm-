import { Link, useNavigate } from "react-router-dom";
import React from "react";
import {
  Check,
  ChevronsUpDown,
  CalendarDays,
  Search,
  Ellipsis,
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
//combobox
import { cn } from "@/lib/utils ";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const frameworks = [
  {
    value: "tasks",
    label: "Tasks",
  },
  {
    value: "accounts",
    label: "Accounts",
  },
  {
    value: "meetings",
    label: "Meetings",
  },
  {
    value: "invoices",
    label: "Invoices",
  },
  {
    value: "products",
    label: "Products",
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  // Handle navigation to dashboard
  const handleNavigate = () => {
    navigate("/dashboard");
  };

  // Handle navigation to leads page
  const handleLeadsNavigate = () => {
    navigate("/leads");
  };

  const handleAccountsNavigate = () => {
    navigate("/accounts");
  };

  const handleContactsNavigate = () => {
    navigate("/contacts");
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
          <div className="space-x-3">
            <Button
              onClick={handleNavigate}
              variant="ghost"
              className="text-black px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black transition duration-200"
            >
              Dashboard
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 hover:underline transition duration-200"
                >
                  Master
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Masters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/department");
                  }}
                >
                  Department
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">Access</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Access Control</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/rolemaster");
                  }}
                >
                  Role Master
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/assignaccess");
                  }}
                >
                  Assign Access
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/usermaster");
                  }}
                >
                  User Master
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={handleLeadsNavigate}
              variant="ghost"
              className="text-black  px-2 py-2  hover:bg-gray-100 hover:underline transition duration-200"
            >
              Leads
            </Button>

            <Button
              onClick={handleContactsNavigate}
              variant="ghost"
              className="text-black  px-2 py-2  hover:bg-gray-100 hover:underline transition duration-200"
            >
              Contacts
            </Button>
            <Button
              onClick={handleAccountsNavigate}
              variant="ghost"
              className="text-black  px-2 py-2  hover:bg-gray-100 hover:underline transition duration-200"
            >
              Accounts
            </Button>
            <Button
              variant="ghost"
              className="text-black  px-2 py-2  hover:bg-gray-100 hover:underline transition duration-200"
            >
              Deals
            </Button>

            <Popover open={open} onOpenChange={setOpen}>
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
            </Popover>
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
                      <Bell className="h-4" style={{ strokeWidth: 2 }} />
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
    </nav>
  );
};

export default Navbar;
