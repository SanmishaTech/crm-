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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

// Contact type
type Contact = {
  id: string;
  client_id: string;
  contact_person: string;
  department: string;
  designation: string;
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
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact_person: "",
    },
  });

  // Fetch Suppliers
  useEffect(() => {
    axios
      .get("/api/contacts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
        },
      })
      .then((response) => {
        setContacts(response.data.data.Contact);
        setPagination(response.data.data.pagination);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, [currentPage, itemsPerPage, searchTerm]);

  // Sorting function
  const handleSort = (key: keyof Contact) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key as keyof Contact];
    const bValue = b[sortConfig.key as keyof Contact];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Delete Contact
  const handleDelete = (contactId: string) => {
    axios
      .delete(`/api/contacts/${contactId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        setContacts(contacts.filter((contact) => contact.id !== contactId));
        // window.location.reload();
      })
      .catch(() => {
        setError("Failed to delete contact");
      });
  };

  // Pagination functions
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

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center p-2 space-x-2">
        <h3 className="text-lg font-semibold">Contacts List</h3>
      </div>
      <div className="flex justify-between items-center space-x-2 w-full">
        {/* Search Bar Starts */}
        <div className="flex-1 space-x-2">
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Search Bar Ends */}
        <div className="flex space-x-2">
          {/* Add(Page) Starts */}
          <Button variant="outline" onClick={() => navigate("/contacts/add")}>
            Add Contact
          </Button>
          {/* Add(Page) Ends */}
        </div>
      </div>

      <div className="panel p-4 rounded-md bg-gray-50">
        {/* Table Start */}
        <Table>
          <TableCaption>A list of your recent suppliers.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("contact_person")}>
                Contact person
              </TableHead>
              <TableHead onClick={() => handleSort("client")}>Client</TableHead>
              <TableHead onClick={() => handleSort("department")}>
                Department
              </TableHead>
              <TableHead onClick={() => handleSort("designation")}>
                Designation
              </TableHead>
              <TableHead onClick={() => handleSort("email")}>Email</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableFooter></TableFooter>
          <TableBody>
            {sortedContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.contact_person}</TableCell>
                <TableCell>{contact?.client?.client}</TableCell>
                <TableCell>{contact.department}</TableCell>
                <TableCell>{contact.designation}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell className="flex justify-items  space-x-2">
                  {/* <button
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button> */}
                  <AlertDialogbox url={contact.id} />

                  <button
                    onClick={() => navigate(`/contacts/edit/${contact.id}`)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
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
  );
}
