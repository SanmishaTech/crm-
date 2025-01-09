import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetData } from "@/lib/HTTP/GET";
import { toast } from "sonner";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AxiosError } from "axios";

interface Lead {
  id: number;
  lead_follow_up_date: string;
  follow_up_type: string;
  follow_up_remark: string;
  lead_follow_up_remark: string;
}

const CalenderDay = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [calendarLeads, setCalendarLeads] = useState<Lead[]>([]);

  useGetData({
    endpoint: "/api/all_leads",
    params: {
      queryKey: ["calendar_leads"],
      onSuccess: (response: any) => {
        try {
          const leads = response?.data?.Lead;
          if (leads && Array.isArray(leads)) {
            setCalendarLeads(leads);
          } else {
            console.error('Invalid leads data received:', response);
            setCalendarLeads([]);
          }
        } catch (err) {
          console.error('Error processing leads data:', err);
          setCalendarLeads([]);
        }
      },
      onError: (error: AxiosError) => {
        console.error('Error fetching leads:', error);
        setCalendarLeads([]);
      }
    },
  });

  useEffect(() => {
    const checkUpcomingFollowUps = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(today.getDate() + 7);
      oneWeekFromNow.setHours(23, 59, 59, 999);

      const upcomingLeads = calendarLeads.filter((lead) => {
        if (!lead?.lead_follow_up_date) return false;
        const followUpDate = new Date(lead.lead_follow_up_date);
        return followUpDate >= today && followUpDate <= oneWeekFromNow;
      });

      if (upcomingLeads.length > 0) {
        toast.info(
          `You have ${upcomingLeads.length} follow-ups in the next week!`
        );
      }
    };

    checkUpcomingFollowUps();
  }, [calendarLeads]);

  const getFollowUpStatus = (day: Date) => {
    if (!day) return null;
    
    const followUpsForDay = calendarLeads.filter((lead) => {
      if (!lead?.lead_follow_up_date) return false;
      
      const followUpDate = new Date(lead.lead_follow_up_date);
      followUpDate.setHours(0, 0, 0, 0);
      
      const compareDate = new Date(day);
      compareDate.setHours(0, 0, 0, 0);
      
      return followUpDate.getTime() === compareDate.getTime();
    });

    if (followUpsForDay.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);
    oneWeekFromNow.setHours(23, 59, 59, 999);
    
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);
    oneMonthFromNow.setHours(23, 59, 59, 999);

    const compareDay = new Date(day);
    compareDay.setHours(0, 0, 0, 0);

    if (compareDay.getTime() <= oneWeekFromNow.getTime()) return "urgent";
    if (compareDay.getTime() <= oneMonthFromNow.getTime()) return "upcoming";
    return "later";
  };

  const modifiers = {
    urgent: (date: Date) => getFollowUpStatus(date) === "urgent",
    upcoming: (date: Date) => getFollowUpStatus(date) === "upcoming",
    later: (date: Date) => getFollowUpStatus(date) === "later",
  };

  const modifiersStyles = {
    urgent: {
      backgroundColor: "#ef4444",
      color: "white",
      borderRadius: "50%",
      fontWeight: "bold",
      textDecoration: "underline",
    },
    upcoming: {
      backgroundColor: "#eab308",
      color: "white",
      borderRadius: "50%",
      fontWeight: "bold",
      textDecoration: "underline",
    },
    later: {
      backgroundColor: "#22c55e",
      color: "white",
      borderRadius: "50%",
      fontWeight: "bold",
      textDecoration: "underline",
    },
  };

  const handlePreviousMonth = () => {
    const previousMonth = new Date(month);
    previousMonth.setMonth(month.getMonth() - 1);
    setMonth(previousMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(month);
    nextMonth.setMonth(month.getMonth() + 1);
    setMonth(nextMonth);
  };

  const footer = date ? (
    <p className="text-center text-[10px] text-muted-foreground m-0 p-0">
      {getFollowUpStatus(date) ? (
        <>
          <span
            className={`font-bold ${
              getFollowUpStatus(date) === "urgent"
                ? "text-red-500"
                : getFollowUpStatus(date) === "upcoming"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {getFollowUpStatus(date) === "urgent"
              ? "Urgent"
              : getFollowUpStatus(date) === "upcoming"
              ? "Upcoming"
              : "Later"}{" "}
            Follow-ups
          </span>{" "}
          scheduled for this date:
          {calendarLeads
            .filter((lead) => {
              if (!lead?.lead_follow_up_date) return false;
              const followUpDate = new Date(lead.lead_follow_up_date);
              const compareDate = new Date(date);
              return (
                followUpDate.getDate() === compareDate.getDate() &&
                followUpDate.getMonth() === compareDate.getMonth() &&
                followUpDate.getFullYear() === compareDate.getFullYear()
              );
            })
            .map((lead, index) => (
              <div className="flex flex justify-center text-[10px] m-0 p-0" key={index}>
                <span style={{ fontWeight: "bold" }}>
                  {lead.follow_up_type}
                </span>
                <span className="mx-1">({lead.follow_up_remark})</span>
              </div>
            ))}
        </>
      ) : (
        "No follow-ups"
      )}
    </p>
  ) : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:text-foreground/80 hover:bg-accent relative"
        >
          <CalendarDays className="h-4" style={{ strokeWidth: 1.5 }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="center"
        side="bottom"
        sideOffset={5}
      >
        <div className="flex justify-center space-x-3 mb-1">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          month={month}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          showOutsideDays={false}
          className="border-none scale-80 origin-top p-3 m-0 pb-0"
          classNames={{
            months: "flex flex-col items-center justify-center text-center sm:flex-row sm:space-x-1 sm:space-y-1",
            month: "flex flex-col items-center",
            caption: "flex justify-center relative items-center",
            caption_label: "text-sm font-medium",
            nav: "hidden",
            nav_button: "hidden",
            table: "w-full border-collapse space-y-0.5",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-8 font-normal text-sm",
            row: "flex w-full mt-1",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
            day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
          footer={footer}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalenderDay;
