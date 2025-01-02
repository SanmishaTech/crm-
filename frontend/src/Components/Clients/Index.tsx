//@ts-nocheck
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useGetData } from "@/lib/HTTP/GET";
import Sidebar, { useSidebar } from "./Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import {
  File,
  PlusCircle,
  Search,
  Pencil,
  Trash,
  MoreHorizontal,
  ListFilter,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { usePostData } from "@/lib/HTTP/DELETE";
import AlertDialogbox from "./AlertBox";

// Client type
type Client = {
  id: string;
  client: string;
  street_address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstin: string;
  contact_no: string;
  email: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

// Form Validation Schema
const formSchema = z.object({
  client: z.string().min(2).max(50),
  street_address: z.string().min(2).max(50),
  area: z.string().min(2).max(50),
  city: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  pincode: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
  gstin: z.string().min(2).max(50),
});

export default function TableDemo() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const { searchTerm, setSearchTerm, toggle, isMinimized } = useSidebar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Pagination functions
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const totalPages = pagination?.last_page || 1;
  const [currentPage, setCurrentPage] = useState(1);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: "",
    },
  });

  const { data: ClientsData } = useGetData({
    endpoint: `/api/clients?search=${searchTerm}&page=${currentPage}&total=${totalPages}`,
    params: {
      queryKey: ["clients", searchTerm, currentPage],
      retry: 1,

      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["clients"] });

        setClients(data?.data?.Client);
        setPagination(data?.data?.pagination);
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate client")) {
          toast.error("Client name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to fetch client data. Please try again.");
        }
      },
    },
  });

  // // Fetch Client
  // useEffect(() => {
  //   axios
  //     .get("/api/clients", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + localStorage.getItem("token"),
  //       },
  //       params: {
  //         page: currentPage,
  //         limit: itemsPerPage,
  //         search: searchTerm,
  //       },
  //     })
  //     .then((response) => {
  //       setClients(response.data.data.Client);
  //       setPagination(response.data.data.pagination);
  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       setError("Failed to load data");
  //       setLoading(false);
  //     });
  // }, [currentPage, itemsPerPage, searchTerm]);

  // Sorting function

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex ">
      <Sidebar className="" />
      <div className="p-6 w-full  bg-accent/60 ml-4 rounded-lg shadow-lg ">
        <div className="p-2  ">
          <div className="flex justify-between items-center ">
            <h3 className="text-lg  font-semibold mx-auto">Clients List</h3>
          </div>
        </div>
        <div className="flex justify-between items-center py-1 space-x-3 mr-4  ">
          <div className="ml-4 mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Filter onClick={toggle} className=" h-5  " />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-1 space-x-2">
            {isMinimized ? (
              <Input
                placeholder="Search Clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            ) : null}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate("/clients/add")}>
              Add Client
            </Button>
          </div>
        </div>

        <div className="panel p-4 rounded-md bg-card">
          {/* Table Start */}
          <Table>
            <TableCaption>A list of your clients.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("client")}>
                  Clients
                </TableHead>
                <TableHead onClick={() => handleSort("contact_no")}>
                  Contact Number
                </TableHead>
                <TableHead onClick={() => handleSort("area")}>Email</TableHead>
                <TableHead onClick={() => handleSort("city")}>City</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableFooter></TableFooter>
            <TableBody>
              {ClientsData?.data?.Client?.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.client || "N/A"}</TableCell>
                  <TableCell>{client.contact_no || "N/A"}</TableCell>
                  <TableCell>{client.email || "N/A"}</TableCell>
                  <TableCell>{client.city || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    {/* <button
                    onClick={() => navigate(`/clients/edit/${client.id}`)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <AlertDialogbox url={client.id} /> */}

                    {/* <button
                    onClick={() => handleDelete(client.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button> */}
                    {/*  */}
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
                          onClick={() => {
                            navigate(`/clients/edit/${client.id}`);
                          }}
                          className="w-full text-sm"
                        >
                          Edit
                        </Button>
                        {/* <DropdownMenuSeparator /> */}
                        <AlertDialogbox url={client.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Table End */}
          {/* Pagination Start */}
          <Pagination>
            <PaginationContent className="flex items-center space-x-4">
              {/* Previous Button */}
              <PaginationPrevious
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationPrevious>

              {/* Page Number */}
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>

              {/* Next Button */}
              <PaginationNext
                className="hover:pointer"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </PaginationNext>
            </PaginationContent>
          </Pagination>
          {/* Pagination End */}
        </div>
      </div>
    </div>
  );
}
