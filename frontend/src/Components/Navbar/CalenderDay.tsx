import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

const CalenderDay = () => {
  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        className="text-foreground hover:text-foreground/80 hover:bg-accent"
      >
        <CalendarDays className="h-4" style={{ strokeWidth: 1.5 }} />
      </Button>
    </div>
  );
};

export default CalenderDay;
