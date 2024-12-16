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
      client: "",
    },
  });

  // Fetch Client
  useEffect(() => {
    axios
      .get("/api/clients", {
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
        setClients(response.data.data.Client);
        setPagination(response.data.data.pagination);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, [currentPage, itemsPerPage, searchTerm]);

  // Sorting function
  const handleSort = (key: keyof Client) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedClients = [...clients].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key as keyof Client];
    const bValue = b[sortConfig.key as keyof Client];

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

  // Delete Client
  const handleDelete = (clientId: string) => {
    axios
      .delete(`/api/clients/${clientId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        setClients(clients.filter((client) => client.id !== clientId));
        // window.location.reload();
      })
      .catch(() => {
        setError("Failed to delete client");
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
        <h3 className="text-lg font-semibold">Clients List</h3>
      </div>
      <div className="flex justify-between items-center space-x-2 w-full">
        {/* Search Bar Starts */}
        <div className="flex-1 space-x-2">
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Search Bar Ends */}
        <div className="flex space-x-2">
          {/* Add(Page) Starts */}
          <Button variant="outline" onClick={() => navigate("/clients/add")}>
            Add Client
          </Button>
          {/* Add(Page) Ends */}
        </div>
      </div>

      <div className="panel p-4 rounded-md bg-gray-50">
        {/* Table Start */}
        <Table>
          <TableCaption>A list of your recent clients.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("client")}>
                Clients
              </TableHead>
              <TableHead onClick={() => handleSort("street_address")}>
                Street Address
              </TableHead>
              <TableHead onClick={() => handleSort("area")}>Area</TableHead>
              <TableHead onClick={() => handleSort("city")}>City</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableFooter></TableFooter>
          <TableBody>
            {sortedClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.client}</TableCell>
                <TableCell>{client.street_address}</TableCell>
                <TableCell>{client.area}</TableCell>
                <TableCell>{client.city}</TableCell>
                <TableCell className="flex justify-items  space-x-2">
                  <AlertDialogbox url={client.id} />

                  {/* <button
                    onClick={() => handleDelete(client.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button> */}
                  <button
                    onClick={() => navigate(`/clients/edit/${client.id}`)}
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
