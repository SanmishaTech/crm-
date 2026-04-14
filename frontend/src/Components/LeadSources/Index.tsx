import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import LeadSourceDialog from "./LeadSourceDialog";
import PaginationComponent from "../Departments/PaginationComponent";
import useFetchData from "@/lib/HTTP/useFetchData";
import AlertDialogbox from "./Delete";

// LeadSource type
type LeadSource = {
  id: string;
  source_title: string;
  source_name: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

// Form Validation Schema
const formSchema = z.object({
  source_title: z.string().min(1, "Source Title is required").max(100),
  source_name: z.string().min(1, "Source Name is required").max(100),
});

export default function LeadSourcesIndex() {
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [open, setOpen] = useState(false); // Manage the dialog state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [editLeadSource, setEditLeadSource] = useState<LeadSource | null>(null);
  const queryClient = useQueryClient();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source_title: "",
      source_name: "",
    },
  });

  const params = {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  };

  const options = {
    enabled: true,
    refetchOnWindowFocus: true,
    retry: 3,
  };

  const {
    data: leadSourceData,
    isLoading: isLeadSourceLoading,
    error: isLeadSourceError,
    isSuccess: isLeadSourceSuccess,
  } = useFetchData("lead_sources", null, options, params);

  const handleInvalidateQuery = () => {
    queryClient.invalidateQueries(["lead_sources", null, params]);
  };

  useEffect(() => {
    if (isLeadSourceSuccess) {
      setLeadSources(leadSourceData.data.LeadSources);
      setPagination(leadSourceData.data.Pagination);
      setLoading(false);
    }
    if (isLeadSourceError) {
      console.log("Error", isLeadSourceError.message);
    }

    handleInvalidateQuery();
  }, [leadSourceData, params]);

  const handleEdit = (leadSource: LeadSource) => {
    setEditLeadSource(leadSource);
    form.setValue("source_title", leadSource.source_title);
    form.setValue("source_name", leadSource.source_name);
    handleEditDialogOpen();
  };

  const handleEditDialogOpen = () => {
    setOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex h-full">
      <div className="p-6 w-full h-full bg-accent/60 mr-5 ml-5 rounded-lg shadow-lg  ">
        <div className="flex justify-center items-center p-3 space-x-2">
          <h3 className="text-lg font-semibold">Lead Sources Master</h3>
        </div>

        <div className="flex justify-between items-center py-1 space-x-2 w-full ">
          <div className="flex-1 space-x-2 ">
            <Input
              placeholder="Search lead sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <LeadSourceDialog
              loading={loading}
              setLoading={setLoading}
              setOpen={setOpen}
              open={open}
              editLeadSource={editLeadSource}
              setEditLeadSource={setEditLeadSource}
              setError={setError}
              form={form}
              handleInvalidateQuery={handleInvalidateQuery}
            />
          </div>
        </div>

        <div className="panel p-4 rounded-md bg-card">
          <Table>
            <TableCaption>A list of your lead sources.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground">Source Title</TableHead>
                <TableHead className="text-foreground">Source Name</TableHead>
                <TableHead className="text-foreground text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadSources &&
                leadSources.map((ls) => (
                  <TableRow key={ls.id}>
                    <TableCell>{ls.source_title}</TableCell>
                    <TableCell>{ls.source_name}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
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
                            onClick={() => handleEdit(ls)}
                            className="w-full text-sm"
                          >
                            Edit
                          </Button>
                          <AlertDialogbox
                            handleInvalidateQuery={handleInvalidateQuery}
                            url={ls.id}
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <PaginationComponent
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
}
