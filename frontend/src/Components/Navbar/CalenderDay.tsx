import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetData } from "@/lib/HTTP/GET";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface Lead {
  id: number;
  lead_follow_up_date: string;
  follow_up_type: string;
  follow_up_remark: string;
  lead_follow_up_remark: string;
}

interface LeadsApiResponse {
  data: {
    Lead: Lead[];
  };
}

const CalenderDay = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [leads, setLeads] = useState<Lead[]>([]);
  const queryClient = useQueryClient();

  // Fetch all leads
  useGetData({
    endpoint: "/api/all_leads",
    params: {
      queryKey: ["leads"],
      onSuccess: (data: LeadsApiResponse) => {
        queryClient.invalidateQueries({ queryKey: ["leads"] });
        if (data?.data?.Lead) {
          setLeads(data.data.Lead);
        }
      },
    },
  });

  // Check for upcoming follow-ups within a week
  useEffect(() => {
    const checkUpcomingFollowUps = () => {
      const today = new Date();
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(today.getDate() + 7);

      const upcomingLeads = leads.filter((lead) => {
        if (!lead.lead_follow_up_date) return false;
        const followUpDate = new Date(lead.lead_follow_up_date);
        return followUpDate >= today && followUpDate <= oneWeekFromNow;
      });

      // if (upcomingLeads.length > 0) {
      //   toast.info(`You have ${upcomingLeads.length} follow-ups in the next week!`);
      // }
    };

    checkUpcomingFollowUps();
  }, [leads]);

  // Function to check follow-up status for a date
  const getFollowUpStatus = (day: Date) => {
    const followUpsForDay = leads.filter((lead) => {
      if (!lead.lead_follow_up_date) return false;
      const followUpDate = new Date(lead.lead_follow_up_date);
      return (
        followUpDate.getDate() === day.getDate() &&
        followUpDate.getMonth() === day.getMonth() &&
        followUpDate.getFullYear() === day.getFullYear()
      );
    });

    if (followUpsForDay.length === 0) return null;

    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);

    if (day <= oneWeekFromNow) return "urgent";
    if (day <= oneMonthFromNow) return "upcoming";
    return "later";
  };

  // Custom modifiers for the calendar
  const modifiers = {
    urgent: (date: Date) => getFollowUpStatus(date) === "urgent",
    upcoming: (date: Date) => getFollowUpStatus(date) === "upcoming",
    later: (date: Date) => getFollowUpStatus(date) === "later",
  };

  // Custom styles for the modifiers
  const modifiersStyles = {
    urgent: {
      backgroundColor: "#ef4444", // Red
      color: "white",
      borderRadius: "50%",
      fontWeight: "bold",
      textDecoration: "underline",
    },
    upcoming: {
      backgroundColor: "#eab308", // Yellow
      color: "white",
      borderRadius: "50%",
      fontWeight: "bold",
      textDecoration: "underline",
    },
    later: {
      backgroundColor: "#22c55e", // Green
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
    <p className="text-center text-xs text-muted-foreground mt-1">
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
          {leads
            .filter((lead) => {
              if (!lead.lead_follow_up_date) return false;
              const followUpDate = new Date(lead.lead_follow_up_date);
              return (
                followUpDate.getDate() === date.getDate() &&
                followUpDate.getMonth() === date.getMonth() &&
                followUpDate.getFullYear() === date.getFullYear()
              );
            })
            .map((lead, index) => (
              <div className="flex flex justify-center" key={index}>
                <span style={{ fontWeight: "bold" }}>
                  {lead.follow_up_type}
                </span>
                <br />
                <span>({lead.follow_up_remark})</span>
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
          {leads.some((lead) => {
            if (!lead.lead_follow_up_date) return false;
            const followUpDate = new Date(lead.lead_follow_up_date);
            const today = new Date();
            const oneWeekFromNow = new Date();
            oneWeekFromNow.setDate(today.getDate() + 7);
            return followUpDate >= today && followUpDate <= oneWeekFromNow;
          }) && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-2 w-2 rounded-full"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-2"
        align="center"
        side="bottom"
        sideOffset={5}
      >
        <div className="flex justify-center space-x-3 mb-2">
          <Button
            variant="outline"
            size="icon"
            className="h-5 w-5"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-5 w-5"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-3 w-3" />
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
          className="border-none scale-70 origin-top"
          classNames={{
            months:
              "flex flex-col sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0",
            month: "space-y-2",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-xs font-medium",
            nav: "hidden",
            nav_button: "hidden",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-muted-foreground rounded-md w-6 font-normal text-[0.7rem]",
            row: "flex w-full mt-1",
            cell: "relative p-0 text-center text-xs focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
            day: "h-6 w-6 p-0 font-normal aria-selected:opacity-100",
            day_range_end: "day-range-end",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle:
              "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
          footer={footer}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalenderDay;
