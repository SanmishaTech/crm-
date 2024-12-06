import React, { useState, useCallback } from "react";
import crmlogo from "@/images/crm.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Settings, CalendarDays, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createPortal } from "react-dom";
import { Flip } from "gsap/Flip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";
gsap.registerPlugin(Flip);
gsap.registerPlugin(useGSAP);
const NewNavbar = () => {
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const container = useRef();
  const [t1, sett1] = useState();
  // const { contextSafe } = useGSAP({ scope: [container] }); // we can pass in a config
  useGSAP(() => {
    const timeline = gsap.timeline({ yoyo: true, duration: 0.1 });
    if (isExploreOpen) {
      timeline.to("#explore", {
        height: "25rem",
        duration: 0.6,
        opacity: 1,
        borderBottomLeftRadius: "0.5rem",
        borderBottomRightRadius: "0.5rem",
        borderTopLeftRadius: "0rem",
        borderToprightRadius: "0rem",
      });

      sett1(timeline);
    } else {
      if (!t1) return;
      t1.reverse();
    }
  }, [isExploreOpen]);

  // const handleExploreOpen = useCallback(() => {
  //   setIsExploreOpen((prevState) => !prevState);
  // }, []);

  const handleExploreOpen = useCallback(() => {
    // gsap.to(container.current, { backgroundColor: "#0000007" });
    setIsExploreOpen((prevState) => !prevState);
  }, []);

  return (
    <div
      ref={container}
      id="container"
      className={`w-full  min-h-[4rem]   items-center justify-center flex relative z-10 `}
    >
      <div className="flex items-center  gap-4 p-4 min-w-[90%] bg-white max-w-[95%] rounded-lg rounded-br-none rounded-bl-none  h-[4rem] relative mt-3 justify-between">
        <img src={crmlogo} alt="CRM Logo" className="w-10 h-10 mt-2" />
        <div className="flex items-center gap-4 mt-2 mr-2 ">
          <div className="flex items-center gap-4 mt-2  min-w-[60rem]">
            <div id="navitems" className="w-full flex items-center gap-2 pl-8 ">
              <Button
                variant="ghost"
                onClick={handleExploreOpen}
                className="hover:bg-white hover:text-[#00000099]"
              >
                Explore
                <ChevronDown className="ml-1 w-4 h-4 text-black text-medium" />
              </Button>

              <div className="flex  gap-5 text-sm">
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-900 hover:text-primary"
                >
                  Home
                </Link>
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-900 hover:text-primary"
                >
                  Lead
                </Link>
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-900 hover:text-primary"
                >
                  Contacts
                </Link>
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-900 hover:text-primary"
                >
                  Accounts
                </Link>
              </div>
            </div>

            <Input
              id="inputnav"
              className={`w-full min-w-[40rem] mt-1 justify-end relative z-[213123]`}
              placeholder="Search..."
              onFocus={(e) => {
                handleExploreOpen();
              }}
            />
          </div>
          <div className="flex gap-2 items-center ml-8 mt-2 justify-end">
            <Button variant="ghost" size="icon">
              <Search className="h-4" style={{ strokeWidth: 2 }} />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4" style={{ strokeWidth: 2 }} />
            </Button>
            <Button variant="ghost" size="icon">
              <CalendarDays className="h-4" style={{ strokeWidth: 2 }} />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4" style={{ strokeWidth: 2 }} />
            </Button>
            <Avatar className="ml-3 mr-2">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        {/* Explore Content */}
        {isExploreOpen && (
          <div id="overlay">
            {createPortal(
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-5"
                onClick={handleExploreOpen}
              />,
              document.body
            )}
            <div
              id="explore"
              className="absolute top-full left-0 right-0 z-60 bg-white shadow-lg h-[0rem] overflow-hidden"
            >
              <div className="w-[90%] mx-auto py-8 flex">
                <div className="ml-9">
                  <ScrollArea className="h-72 w-[15rem] rounded-md scroll-hidden flex justify-center items-center">
                    <div className="flex flex-col items-start gap-2 justify-center">
                      <Button
                        variant="outline"
                        className="flex  items-center gap-2 justify-center min-w-[12rem] gap-4 text-medium text-sm"
                      >
                        <Users className="w-6 h-6" />
                        <span className="text-sm text-medium text-gray-500">
                          Lead Master
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex  items-center gap-2 justify-center min-w-[12rem] gap-4 text-medium text-sm"
                      >
                        <Users className="w-6 h-6" />
                        <span className="text-sm text-medium text-gray-500">
                          Account Master
                        </span>
                      </Button>
                    </div>
                  </ScrollArea>
                </div>
                <div className="ml-8">
                  <ScrollArea className="h-72 w-full min-w-[51rem] rounded-md scroll-hidden flex justify-center items-center ">
                    <div className="flex flex-col items-center gap-2 justify-start  min-h-[19rem]  rounded-md ">
                      <Button className="w-[90%]">ASds</Button>
                      <Button className="w-[90%]">ASds</Button>
                      <Button className="w-[90%]">ASds</Button>
                      <Button className="w-[90%]">ASds</Button>

                      <Button className="w-[90%]">222</Button>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewNavbar;
