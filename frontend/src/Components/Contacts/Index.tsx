import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Filter, MoreHorizontal } from "lucide-react";
import Sidebar, { useSidebar } from "./Sidebar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useGetData } from "@/lib/HTTP/GET";
import {
  DropdownMenu,
  DropdownMenuContent,
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

type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

type ContactsData = {
  Contact: Contact[];
  pagination: PaginationData;
};

export default function TableDemo() {
  const [contacts, setContacts] = useState<ApiResponse<ContactsData> | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const totalPages = pagination?.last_page || 1;
  const {
    searchTerm,
    setSearchTerm,
    clientId,
    setClientId,
    toggle,
    isMinimized,
  } = useSidebar();

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

  // Fetch Contacts with search parameters
  useGetData({
    endpoint: `/api/contacts?search=${searchTerm}&page=${currentPage.toString()}&total=${totalPages.toString()}${
      clientId ? `&client_id=${clientId}` : ""
    }`,
    params: {
      queryKey: ["contacts", searchTerm, currentPage.toString(), clientId],
      retry: 1,
      onSuccess: (response: unknown) => {
        const data = response as ApiResponse<ContactsData>;
        setContacts(data);
        setPagination(data.data.pagination);
      },
      onError: (error) => {
        console.error("Failed to fetch contacts", error);
      },
    },
  });

  const handleFilterChange = (filters: { clientId: string }) => {
    setClientId(filters.clientId);
  };

  return (
    <div className="flex">
      <Sidebar onFilterChange={handleFilterChange} />
      <div className="p-6 w-full bg-accent/50 ml-4 mr-8 rounded-lg shadow-lg">
        <div className="p-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mx-auto">Contacts List</h3>
          </div>
        </div>
        <div className="flex justify-between items-center py-1 space-x-3">
          <div className="ml-1 mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Filter onClick={toggle} className="h-5" />
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
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background text-foreground border-border"
              />
            ) : null}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate("/contacts/add")}
              className="bg-background text-foreground border-border"
            >
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
              {contacts?.data?.Contact?.map((contact: Contact) => (
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
