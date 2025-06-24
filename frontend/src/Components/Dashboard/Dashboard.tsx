import { useState, useEffect } from "react";
import { Badge } from "@/Components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import axios from "axios";
import { useGetData } from "@/lib/HTTP/GET";
import { DoneDealsPieChart } from "./DoneDealsPieChart";
import { OpenDealsPieChart } from "./OpenDealsPieChart";
import { UntouchedDealsPieChart } from "./UntouchedDealsPieChart";

// Define interfaces for our data structures
interface Lead {
  id: number;
  contact?: {
    contact_person: string;
  };
  follow_up_remark: string;
  lead_status: string;
  follow_up_type: string;
  lead_follow_up_date: string;
}

interface Note {
  id: number;
  note_title: string;
  note_content: string;
}

interface NotepadData {
  data?: {
    Notepad?: Note[];
  };
}

export default function ResponsiveLabDashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [openTasks, setOpenTasks] = useState<Lead[]>([]);

  const { data: Sup } = useGetData<NotepadData>({
    endpoint: `/api/notepads`,
    params: {
      queryKey: ["notepad"],
      retry: 1,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/all_leads`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const leadsData = response.data.data.Lead as Lead[];
        setLeads(leadsData);
        const openLeads = leadsData.filter((lead) => lead.lead_status === "Open");
        setOpenTasks(openLeads);
      } catch (error) {
        console.error("Error fetching dashboard leads data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen ">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold ">Welcome </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DoneDealsPieChart />
          <OpenDealsPieChart />
          <UntouchedDealsPieChart />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4 ">
          <Card className="col-span-full lg:col-span-3 overflow-x-auto bg-accent/40">
            <CardHeader>
              <CardTitle>My Meetings</CardTitle>
              <CardDescription>Meetings with Clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.slice(0, 5).map((test) => (
                  <div key={test.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {test.contact?.contact_person}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(test.follow_up_remark || '').length > 15
                          ? test.follow_up_remark.substring(0, 15) + "..."
                          : test.follow_up_remark}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      <Badge
                        variant={
                          test.follow_up_type === "High"
                            ? "destructive"
                            : test.follow_up_type === "Medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {test.follow_up_type}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {test.lead_follow_up_date
                          ? `${new Date(test.lead_follow_up_date)
                              .getDate()
                              .toString()
                              .padStart(2, "0")}/${(
                              new Date(test.lead_follow_up_date).getMonth() + 1
                            )
                              .toString()
                              .padStart(2, "0")}/${new Date(
                              test.lead_follow_up_date
                            ).getFullYear()}`
                          : "DD/MM/YYYY"}
                      </p>
                    </div>
                  </div>
                ))}
                {leads.length >= 5 && (
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => navigate("/leads")}
                      className="text-xs hover:text-blue-500"
                    >
                      See More...
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-full lg:col-span-4 overflow-x-auto bg-accent/40">
            <CardHeader>
              <CardTitle>My Open Leads</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto ">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Task ID</TableHead>
                    <TableHead>Contact Name</TableHead>
                    <TableHead>Follow-Up Remark</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.id}</TableCell>
                      <TableCell>{task.contact?.contact_person}</TableCell>
                      <TableCell>
                        {(task.follow_up_remark || '').length > 15
                          ? task.follow_up_remark.substring(0, 15) + "..."
                          : task.follow_up_remark}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            task.lead_status === "Open"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {task.lead_status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
          <Card className="col-span-full bg-accent/40">
            <CardHeader>
              <CardTitle>My Notes</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] overflow-y-auto">
              <div className="space-y-2">
                {Sup?.data?.Notepad?.slice(0, 6).map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-lg bg-background/50 hover:bg-accent/50 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-foreground">
                          {note?.note_title?.length > 15
                            ? note.note_title.substring(0, 15) + "..."
                            : note?.note_title || "Untitled"}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {note?.note_content?.length > 150
                            ? note.note_content.substring(0, 150) + "..."
                            : note?.note_content || "No content"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {Sup?.data?.Notepad && Sup.data.Notepad.length > 6 && (
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => navigate("/notepad")}
                      className="text-xs hover:text-blue-500"
                    >
                      See More...
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

