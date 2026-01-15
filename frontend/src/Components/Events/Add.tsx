import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { usePostData } from "@/lib/HTTP/POST";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useGetData } from "@/lib/HTTP/GET";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ParticipantSchema = z.object({
  company_name: z.string().optional(),
  participant_name: z.string().optional(),
  contact_number: z.string().optional(),
  email_id: z.string().optional(),
});

const FormSchema = z.object({
  event_datetime: z.string().min(1, "Date / Time is required"),
  team_user_ids: z.array(z.number()).min(1, "Team is required"),
  participants: z.array(ParticipantSchema).optional(),
});

type EmployeeUser = { id: number; name: string; email?: string };
type Participant = z.infer<typeof ParticipantSchema>;
type ParticipantErrors = Partial<Record<keyof Participant, string>>;

export default function InputForm() {
  const [employees, setEmployees] = useState<EmployeeUser[]>([]);
  const [selectedTeamUserIds, setSelectedTeamUserIds] = useState<number[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([
    { company_name: "", participant_name: "", contact_number: "", email_id: "" },
  ]);
  const [participantErrors, setParticipantErrors] = useState<
    Record<number, ParticipantErrors>
  >({});

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      event_datetime: "",
      team_user_ids: [],
    },
  });

  useGetData({
    endpoint: `/api/all_employees`,
    params: {
      queryKey: ["employees"],
      retry: 1,
      onSuccess: (data: any) => {
        setEmployees(Array.isArray(data?.data) ? data.data : []);
      },
      onError: () => {
        toast.error("Failed to fetch employees.");
      },
    },
  });

  const allUserIds = useMemo(() => employees.map((u) => u.id), [employees]);

  const allUsersSelected = useMemo(() => {
    return allUserIds.length > 0 && selectedTeamUserIds.length === allUserIds.length;
  }, [allUserIds, selectedTeamUserIds.length]);

  const toggleTeamUser = (userId: number) => {
    setSelectedTeamUserIds((prev) => {
      const next = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];
      form.setValue("team_user_ids", next, { shouldValidate: true });
      return next;
    });
  };

  const toggleAllUsers = (checked?: boolean) => {
    const next = checked ? allUserIds : [];
    setSelectedTeamUserIds(next);
    form.setValue("team_user_ids", next, { shouldValidate: true });
  };

  const teamLabel = useMemo(() => {
    if (allUsersSelected) return "All";
    if (selectedTeamUserIds.length === 0) return "Select Team";
    return `Team (${selectedTeamUserIds.length})`;
  }, [allUsersSelected, selectedTeamUserIds.length]);

  const addParticipantRow = () => {
    setParticipants((prev) => [
      ...prev,
      { company_name: "", participant_name: "", contact_number: "", email_id: "" },
    ]);
  };

  const removeParticipantRow = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
    setParticipantErrors((prev) => {
      const next: Record<number, ParticipantErrors> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const currentIndex = Number(key);
        if (currentIndex < index) {
          next[currentIndex] = value;
        } else if (currentIndex > index) {
          next[currentIndex - 1] = value;
        }
      });
      return next;
    });
  };

  const updateParticipant = (
    index: number,
    key: keyof Participant,
    value: string
  ) => {
    setParticipants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
    setParticipantErrors((prev) => {
      const rowErrors = prev[index];
      if (!rowErrors?.[key]) {
        return prev;
      }
      const next = { ...prev };
      const updatedRowErrors = { ...rowErrors };
      delete updatedRowErrors[key];
      if (Object.keys(updatedRowErrors).length === 0) {
        delete next[index];
      } else {
        next[index] = updatedRowErrors;
      }
      return next;
    });
  };

  const formData = usePostData({
    endpoint: "/api/events",
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["leads"] });
        queryClient.invalidateQueries({ queryKey: ["events"] });
        navigate("/events");
      },
      onError: (error) => {
        const serverErrors = error.response?.data?.errors;

        if (serverErrors) {
          if (serverErrors.event_datetime?.length) {
            form.setError("event_datetime", {
              type: "manual",
              message: serverErrors.event_datetime[0],
            });
          }

          if (serverErrors.team_user_ids) {
            const message = Array.isArray(serverErrors.team_user_ids)
              ? serverErrors.team_user_ids[0]
              : String(serverErrors.team_user_ids);
            form.setError("team_user_ids", {
              type: "manual",
              message,
            });
          }

          const participantFieldErrors: Record<number, ParticipantErrors> = {};
          Object.entries(serverErrors).forEach(([key, messages]) => {
            if (!key.startsWith("participants.")) {
              return;
            }

            const [, indexValue, field] = key.split(".");
            const rowIndex = Number(indexValue);

            if (!Number.isNaN(rowIndex) && field) {
              const message = Array.isArray(messages) ? messages[0] : String(messages);
              participantFieldErrors[rowIndex] = {
                ...(participantFieldErrors[rowIndex] ?? {}),
                [field as keyof Participant]: message,
              };
            }
          });

          if (Object.keys(participantFieldErrors).length > 0) {
            setParticipantErrors(participantFieldErrors);
          }

          if (serverErrors.error?.length) {
            toast.error(serverErrors.error[0]);
            return;
          }

          if (
            !serverErrors.event_datetime &&
            !serverErrors.team_user_ids &&
            Object.keys(participantFieldErrors).length === 0
          ) {
            toast.error(error.response?.data?.message ?? "Failed to submit the form.");
          }
          return;
        }

        toast.error("Failed to submit the form. Please try again.");
      },
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    form.clearErrors();
    setParticipantErrors({});
    const payload = {
      event_datetime: data.event_datetime,
      team_user_ids: data.team_user_ids,
      participants,
    };

    formData.mutate(payload);
  };

  return (
    <div className="mx-auto p-6 bg-background border border-border shadow-lg rounded-lg">
      <div className="flex items-center justify-between w-full">
        <div className="mb-7">
          <Button
            onClick={() => navigate("/events")}
            variant="ghost"
            className="mr-4"
            type="button"
          >
            <ChevronLeft />
            Back
          </Button>
        </div>
        <div className="flex-1 mr-9 text-center">
          <div className="-ml-4">
            <h2 className="text-2xl font-semibold">Event Form</h2>
            <p className="text-xs mb-9">Add an Event.</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-accent/40">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">Event Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="event_datetime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Date / Time <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="team_user_ids"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        Team <span className="text-destructive">*</span>
                      </FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <FormControl>
                            <Button type="button" variant="outline" className="w-full justify-between">
                              {teamLabel}
                            </Button>
                          </FormControl>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-72 max-h-64 overflow-y-auto">
                          <DropdownMenuLabel>Select User(s)</DropdownMenuLabel>
                          <DropdownMenuCheckboxItem
                            checked={allUsersSelected}
                            onCheckedChange={toggleAllUsers}
                          >
                            All
                          </DropdownMenuCheckboxItem>
                          {employees.map((u) => (
                            <DropdownMenuCheckboxItem
                              key={u.id}
                              checked={selectedTeamUserIds.includes(u.id)}
                              onCheckedChange={() => toggleTeamUser(u.id)}
                            >
                              {u.name}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/40">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold flex justify-between items-center">
                Participants
                <Button type="button" variant="outline" onClick={addParticipantRow}>
                  Add Participant
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="panel p-4 rounded-md bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Participant Name</TableHead>
                      <TableHead>Contact Number</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((p, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="space-y-1">
                            <Input
                              value={p.company_name || ""}
                              onChange={(e) =>
                                updateParticipant(index, "company_name", e.target.value)
                              }
                            />
                            {participantErrors[index]?.company_name ? (
                              <p className="text-sm font-medium text-destructive">
                                {participantErrors[index]?.company_name}
                              </p>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Input
                              value={p.participant_name || ""}
                              onChange={(e) =>
                                updateParticipant(index, "participant_name", e.target.value)
                              }
                            />
                            {participantErrors[index]?.participant_name ? (
                              <p className="text-sm font-medium text-destructive">
                                {participantErrors[index]?.participant_name}
                              </p>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Input
                              value={p.contact_number || ""}
                              onChange={(e) =>
                                updateParticipant(index, "contact_number", e.target.value)
                              }
                            />
                            {participantErrors[index]?.contact_number ? (
                              <p className="text-sm font-medium text-destructive">
                                {participantErrors[index]?.contact_number}
                              </p>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Input
                              value={p.email_id || ""}
                              onChange={(e) =>
                                updateParticipant(index, "email_id", e.target.value)
                              }
                            />
                            {participantErrors[index]?.email_id ? (
                              <p className="text-sm font-medium text-destructive">
                                {participantErrors[index]?.email_id}
                              </p>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {participants.length > 1 ? (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => removeParticipantRow(index)}
                            >
                              Remove
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => navigate("/events")} type="button">
              Cancel
            </Button>
            <Button type="submit" className="hover:pointer">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
