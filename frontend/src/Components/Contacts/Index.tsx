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
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useGetData } from "@/lib/HTTP/GET";
import { useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  File,
  PlusCircle,
  Search,
  Pencil,
  Trash,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import AlertDialogbox from "./AlertBox";

// Contact type
type Contact = {
  id: string;
  client_id: string;
  contact_person: string;
  department: string;
  designation: string;
  email: string;
  mobile_1?: string;
  client_name?: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

// Form Validation Schema
const formSchema = z.object({
  contact_person: z.string().min(2).max(50),
  client_id: z.any().optional(),
  department: z.string().min(2).max(50),
  designation: z.string().min(2).max(50),
  email: z.string().min(2).max(50),
});

export default function TableDemo() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const [client, setClient] = useState<string>(""); // Filter state for client
  const [clientList, setClientList] = useState<string[]>([]); // List of unique client names

  const queryClient = useQueryClient();
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const totalPages = pagination?.last_page || 1;

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

  // Fetch Contacts with search and filter parameters
  const { data: Sup } = useGetData({
    endpoint: `/api/contacts?search=${searchTerm}&client=${client}&page=${currentPage}&total=${totalPages}`,
    params: {
      queryKey: ["contacts", searchTerm, client, currentPage],
      retry: 1,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        setContacts(data);
        setPagination(data?.data?.pagination);
        setLoading(false);
      },
      onError: (error) => {
        console.error("Failed to fetch contacts", error);
      },
    },
  });

  // Extract unique client names from the contacts data
  useEffect(() => {
    if (contacts && contacts.data && contacts.data.Contact) {
      const uniqueClients = Array.from(
        new Set(
          contacts.data.Contact.map((contact) => contact.client_name).filter(
            Boolean
          )
        )
      );
      setClientList(uniqueClients);
    }
  }, [contacts]);

  return (
    <div className="flex">
      <div className="p-6 w-full bg-accent/50 ml-4 mr-8 rounded-lg shadow-lg">
        <div className="p-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mx-auto">Contacts List</h3>
          </div>
        </div>
        <div className="flex justify-between items-center py-1 space-x-3 ">
          <div className="ml-4 mt-2"></div>
          <div className="flex-1 space-x-2">
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            {/* Filter Button with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-4">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Filter by Client
                </label>
                <select
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All Clients</option>
                  {clientList.map((clientName) => (
                    <option key={clientName} value={clientName}>
                      {clientName}
                    </option>
                  ))}
                </select>
                {/* Optionally, include an "Apply Filter" button if you want to add extra logic */}
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => {
                    // The filter state is already updated.
                    // Add additional logic here if needed.
                  }}
                >
                  Apply Filter
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add Contact Button */}
            <Button variant="outline" onClick={() => navigate("/contacts/add")}>
              Add Contact
            </Button>
          </div>
        </div>

        <div className="panel p-4 rounded-md bg-card">
          {/* Table Start */}
          <Table>
            <TableCaption>A list of your contacts.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground">
                  Contact person
                </TableHead>
                <TableHead className="text-foreground">Client</TableHead>
                <TableHead className="text-foreground">Department</TableHead>
                <TableHead className="text-foreground">Designation</TableHead>
                <TableHead className="text-foreground">Email</TableHead>
                <TableHead className="text-foreground">
                  Primary Mobile
                </TableHead>
                <TableHead className="text-foreground text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts?.data?.Contact?.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.contact_person || "N/A"}</TableCell>
                  <TableCell>
                    {contact?.client_name
                      ? contact.client_name.charAt(0).toUpperCase() +
                        contact.client_name.slice(1)
                      : "N/A"}
                  </TableCell>
                  <TableCell>{contact.department || "N/A"}</TableCell>
                  <TableCell>{contact.designation || "N/A"}</TableCell>
                  <TableCell>{contact.email || "N/A"}</TableCell>
                  <TableCell>{contact.mobile_1 || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center">
                        <DropdownMenuLabel className="text-center hover:cursor-default text-foreground">
                          Actions
                        </DropdownMenuLabel>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(`/contacts/edit/${contact.id}`)
                          }
                          className="w-full text-sm"
                        >
                          Edit
                        </Button>
                        <AlertDialogbox url={contact.id} />
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
              <PaginationPrevious
                className={`hover:pointer ${
                  currentPage === 1
                    ? "cursor-default opacity-50"
                    : "cursor-pointer"
                }`}
                onClick={goToPreviousPage}
              >
                Previous
              </PaginationPrevious>

              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <PaginationNext
                className={`hover:pointer ${
                  currentPage === totalPages
                    ? "cursor-default opacity-50"
                    : "cursor-pointer"
                }`}
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
