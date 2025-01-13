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
import { useQueryClient } from "@tanstack/react-query";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleOpenChange = (open: boolean) => {
    if (open) {
      const today = new Date();
      setDate(today);
      setMonth(today);
    } else {
      // Reset calendar state when dialog closes
      setDate(undefined);
      setMonth(new Date());
      setCalendarLeads([]); // Optionally reset the leads data
    }
    setOpen(open);
  };

  useGetData({
    endpoint: "/api/all_leads",
    params: {
      queryKey: ["calendar_leads"],
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({ queryKey: ["calendar_leads"] });
        try {
          const leads = response?.data?.Lead;
          if (leads && Array.isArray(leads)) {
            setCalendarLeads(leads);
          } else {
            console.error("Invalid leads data received:", response);
            setCalendarLeads([]);
          }
        } catch (err) {
          console.error("Error processing leads data:", err);
          setCalendarLeads([]);
        }
      },
      onError: (error: AxiosError) => {
        console.error("Error fetching leads:", error);
        setCalendarLeads([]);
      },
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
          `You have ${upcomingLeads.length} follow-ups in the next week!`,
          {
            duration: 1200,
          }
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

  const footer = (
    <div className="w-full flex justify-end mt-2">
      <div className="bg-background border p-4 rounded-lg shadow-md w-[320px] max-w-[350px] min-w-[300px]">
        <p className="text-center text-sm text-muted-foreground ">
          {date ? (
            getFollowUpStatus(date) ? (
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
                    : "Later"}
                  Follow-ups
                </span>
                <span className="block text-[11px] text-muted-foreground mt-1">
                  scheduled for this date:
                </span>
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
                    <div
                      className="flex justify-center font-bold text-[12px] m-0 p-0"
                      key={index}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        {lead.follow_up_type}
                      </span>
                      <span className="mx-1">({lead.follow_up_remark})</span>
                    </div>
                  ))}
              </>
            ) : (
              "No follow-ups scheduled for this date"
            )
          ) : (
            <>
              <span className="font-bold  text-red-500">Urgent</span> Follow-ups
              <br />
              <span className="font-bold  text-yellow-500">Upcoming</span>{" "}
              Follow-ups
              <br />
              <span className="font-bold text-green-500">Later</span> Follow-ups
            </>
          )}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <CalendarDays className="h-4 w-4" style={{ strokeWidth: 1.5 }} />
      </DialogTrigger>

      <DialogContent className="flex flex-col justify-center items-center  ">
        <DialogHeader>
          <DialogTitle className="text-center"> Follow-up Calendar</DialogTitle>
          <DialogDescription>View and manage your follow-ups</DialogDescription>
        </DialogHeader>

        <div className="">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={setDate}
            month={month}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            showOutsideDays={true}
            className="scale-5 origin-top sm:scale-3"
            disabled={{ before: new Date(1970, 0) }}
            onMonthChange={setMonth}
            showWeekNumber={false}
            classNames={{
              caption: "flex items-center px-6 relative h-9",
              caption_label: "text-lg flex-1 text-left mx-4 mt-3",
              nav_button:
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center absolute left-0",
              table: "w-full border-collapse",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-8 font-normal text-sm",
              row: "flex w-full mt-1",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
              day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
              day_range_end: "day-range-end",
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-white opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            footer={footer}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalenderDay;
