import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { usePutData } from "@/lib/HTTP/PUT";

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

type LeadWithEvents = {
  events?: EventItem[];
};

export default function History({ leads }: { leads: LeadWithEvents | null }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<EventItem | null>(null);
  const [dialogParticipants, setDialogParticipants] = React.useState<Participant[]>([]);

  const updateEvent = usePutData({
    endpoint: selectedEvent ? `/api/events/${selectedEvent.id}` : "/api/events/0",
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["leads"] });
        queryClient.invalidateQueries({ queryKey: ["events"] });
        setOpen(false);
        setSelectedEvent(null);
      },
    },
  });

  React.useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["leads"] });
  }, [queryClient]);

  if (!leads) {
    return <div className="text-center py-4">Loading lead data...</div>;
  }

  const events = leads.events;

  if (!events || events.length === 0) {
    return <div className="text-center py-4">No event details available.</div>;
  }

  const sortedEvents = [...events].sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bTime - aTime;
  });

  const selectedParticipants = Array.isArray(selectedEvent?.participants)
    ? selectedEvent?.participants
    : [];

  React.useEffect(() => {
    if (!open || !selectedEvent) return;
    const next = Array.isArray(selectedEvent.participants) ? selectedEvent.participants : [];
    setDialogParticipants(next.map((p) => ({ ...p, attended: !!p.attended })));
  }, [open, selectedEvent]);

  return (
    <div className="overflow-hidden py-4 space-y-6">
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

          {selectedParticipants.length === 0 ? (
            <div className="text-sm text-muted-foreground">No participants found.</div>
          ) : (
            <Table className="min-w-full bg-background rounded-md border border-muted">
              <TableHeader className="bg-muted text-sm">
                <TableRow>
                  <TableCell className="px-4 py-2 text-left">#</TableCell>
                  <TableCell className="px-4 py-2 text-left">Attended</TableCell>
                  <TableCell className="px-4 py-2 text-left">Company</TableCell>
                  <TableCell className="px-4 py-2 text-left">Name</TableCell>
                  <TableCell className="px-4 py-2 text-left">Contact</TableCell>
                  <TableCell className="px-4 py-2 text-left">Email</TableCell>
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
                    <TableCell className="border-t px-4 py-2 text-sm">
                      {p.company_name || "-"}
                    </TableCell>
                    <TableCell className="border-t px-4 py-2 text-sm">
                      {p.participant_name || "-"}
                    </TableCell>
                    <TableCell className="border-t px-4 py-2 text-sm">
                      {p.contact_number || "-"}
                    </TableCell>
                    <TableCell className="border-t px-4 py-2 text-sm">
                      {p.email_id || "-"}
                    </TableCell>
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

      <div className="space-y-4">
        <Card className="bg-muted/70">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">
              Event Count: {events.length}
            </CardTitle>
            <CardDescription className="text-sm">
              Total number of events for this lead
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Total events: {events.length}</p>
          </CardContent>
          <CardFooter />
        </Card>
      </div>

      <div>
        <Table className="min-w-full bg-background rounded-md shadow-lg border border-muted">
          <TableHeader className="bg-muted text-sm">
            <TableRow>
              <TableCell className="px-4 py-2 text-left">#</TableCell>
              <TableCell className="px-4 py-2 text-left">Event Date/Time</TableCell>
              <TableCell className="px-4 py-2 text-left">Team</TableCell>
              <TableCell className="px-4 py-2 text-left">Participants</TableCell>
              <TableCell className="px-4 py-2 text-left">Created At</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedEvents.map((event, index) => {
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
                  className="cursor-pointer hover:bg-muted/10 transition-colors duration-150"
                  onClick={() => {
                    setSelectedEvent(event);
                    setOpen(true);
                  }}
                >
                  <TableCell className="border-t px-4 py-2 text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell className="border-t px-4 py-2 text-sm">
                    {event.event_datetime
                      ? `${new Date(event.event_datetime).toLocaleDateString()} (${new Date(
                          event.event_datetime
                        ).toLocaleTimeString()})`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="border-t px-4 py-2 text-sm">
                    {teamName}
                  </TableCell>
                  <TableCell className="border-t px-4 py-2 text-sm">
                    {participantsCount}
                  </TableCell>
                  <TableCell className="border-t px-4 py-2 text-sm">
                    {event.created_at
                      ? `${new Date(event.created_at).toLocaleDateString()} (${new Date(
                          event.created_at
                        ).toLocaleTimeString()})`
                      : "N/A"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
