import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useGetData } from "@/lib/HTTP/GET";
import { usePutData } from "@/lib/HTTP/PUT";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import AlertDialogbox from "./Delete";


type Participant = {
  company_name?: string | null;
  participant_name?: string | null;
  contact_number?: string | null;
  email_id?: string | null;
  attended?: boolean | null;
};

type EventItem = {
  id: number;
  event_datetime?: string | null;
  team_user_ids?: number[] | null;
  participants?: Participant[] | null;
  created_at?: string;
};

export default function EventsIndex() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [events, setEvents] = React.useState<EventItem[]>([]);

  const [open, setOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<EventItem | null>(null);
  const [dialogParticipants, setDialogParticipants] = React.useState<Participant[]>([]);
  const [filterDate, setFilterDate] = React.useState("");


  useGetData({
    endpoint: `/api/events${filterDate ? `?event_date=${filterDate}` : ""}`,
    params: {
      queryKey: ["events", filterDate],
      retry: 1,
      onSuccess: (data: any) => {
        const resource = data?.data?.Events;
        const list = Array.isArray(resource)
          ? resource
          : Array.isArray(resource?.data)
            ? resource.data
            : [];
        setEvents(list);
      },
      onError: () => {
        toast.error("Failed to fetch events.");
      },
    },
  });

  const updateEvent = usePutData({
    endpoint: selectedEvent ? `/api/events/${selectedEvent.id}` : "/api/events/0",
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        queryClient.invalidateQueries({ queryKey: ["leads"] });
        setOpen(false);
        setSelectedEvent(null);
      },
    },
  });

  React.useEffect(() => {
    if (!open || !selectedEvent) return;
    const next = Array.isArray(selectedEvent.participants)
      ? selectedEvent.participants
      : [];
    setDialogParticipants(next.map((p) => ({ ...p, attended: !!p.attended })));
  }, [open, selectedEvent]);

  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }, [events]);

  const toLocalDateValue = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const filteredEvents = React.useMemo(() => {
    if (!filterDate) return sortedEvents;
    return sortedEvents.filter((event) => {
      const eventDate = toLocalDateValue(event.event_datetime);
      return eventDate === filterDate;
    });
  }, [sortedEvents, filterDate]);


  return (
    <div className="flex">
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setSelectedEvent(null);
            setDialogParticipants([]);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Participants</DialogTitle>
            <DialogDescription>
              {selectedEvent?.event_datetime
                ? `${new Date(selectedEvent.event_datetime).toLocaleDateString()} (${new Date(
                    selectedEvent.event_datetime
                  ).toLocaleTimeString()})`
                : ""}
            </DialogDescription>
          </DialogHeader>

          {dialogParticipants.length === 0 ? (
            <div className="text-sm text-muted-foreground">No participants found.</div>
          ) : (
            <Table className="min-w-full bg-background rounded-md border border-muted">
              <TableHeader className="bg-muted text-sm">
                <TableRow>
                  <TableHead className="px-4 py-2 text-left">#</TableHead>
                  <TableHead className="px-4 py-2 text-left">Attended</TableHead>
                  <TableHead className="px-4 py-2 text-left">Company</TableHead>
                  <TableHead className="px-4 py-2 text-left">Name</TableHead>
                  <TableHead className="px-4 py-2 text-left">Contact</TableHead>
                  <TableHead className="px-4 py-2 text-left">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dialogParticipants.map((p, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="border-t px-4 py-2 text-sm">{idx + 1}</TableCell>
                    <TableCell className="border-t px-4 py-2 text-sm">
                      <Checkbox
                        checked={!!p.attended}
                        onCheckedChange={(checked) => {
                          const attended = checked === true;
                          setDialogParticipants((prev) => {
                            const next = [...prev];
                            next[idx] = { ...next[idx], attended };
                            return next;
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell className="border-t px-4 py-2 text-sm">{p.company_name || "-"}</TableCell>
                    <TableCell className="border-t px-4 py-2 text-sm">{p.participant_name || "-"}</TableCell>
                    <TableCell className="border-t px-4 py-2 text-sm">{p.contact_number || "-"}</TableCell>
                    <TableCell className="border-t px-4 py-2 text-sm">{p.email_id || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                if (!selectedEvent) return;
                updateEvent.mutate({ participants: dialogParticipants });
              }}
              disabled={!selectedEvent || updateEvent.isPending}
            >
              {updateEvent.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="p-6 w-full bg-accent/60 ml-4 mr-8 rounded-lg shadow-lg">
        <div className="p-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mx-auto">Events List</h3>
          </div>
        </div>

        <div className="flex justify-between items-center py-1 space-x-3">
          <div className="flex-1 space-x-2" />
          <div className="flex space-x-2">
            <Input
              type="date"
              value={filterDate}
              onChange={(event) => setFilterDate(event.target.value)}
              className="w-40"
            />
            <Button variant="outline" onClick={() => navigate("/events/add")}>Add Event</Button>
          </div>
        </div>

        <div className="panel p-4 rounded-md bg-card">
          <Table>
            <TableCaption>A list of your events.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground">#</TableHead>
                <TableHead className="text-foreground">Event Date/Time</TableHead>
                <TableHead className="text-foreground">Team</TableHead>
                <TableHead className="text-foreground">Participants</TableHead>
                <TableHead className="text-foreground">Created At</TableHead>
                <TableHead className="text-foreground text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredEvents.map((event, index) => {
                const participantsCount = Array.isArray(event.participants)
                  ? event.participants.length
                  : 0;

                const teamUserIds = Array.isArray(event.team_user_ids)
                  ? event.team_user_ids
                  : null;

                const teamName = teamUserIds && teamUserIds.length > 0
                  ? `Users (${teamUserIds.length})`
                  : "N/A";

                return (
                  <TableRow
                    key={event.id}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => {
                      setSelectedEvent(event);
                      setOpen(true);
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {event.event_datetime
                        ? `${new Date(event.event_datetime).toLocaleDateString()} (${new Date(
                            event.event_datetime
                          ).toLocaleTimeString()})`
                        : "N/A"}
                    </TableCell>
                    <TableCell>{teamName}</TableCell>
                    <TableCell>{participantsCount}</TableCell>
                    <TableCell>
                      {event.created_at
                        ? `${new Date(event.created_at).toLocaleDateString()} (${new Date(
                            event.created_at
                          ).toLocaleTimeString()})`
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                            }}
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="center"
                          className="w-full flex-col items-center flex justify-center"
                        >
                          <DropdownMenuLabel className="hover:cursor-default text-foreground">
                            Actions
                          </DropdownMenuLabel>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/events/edit/${event.id}`);
                            }}
                            className="w-full text-sm"
                          >
                            Edit
                          </Button>
                          <AlertDialogbox url={event.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
