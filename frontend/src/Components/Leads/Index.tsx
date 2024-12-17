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
import { useDeleteData } from "@/lib/HTTP/DELETE";
import { useGetData } from "@/lib/HTTP/GET";
import AlertDialogbox from "./AlertBox";

// Supplier type
type Supplier = {
  id: string;
  contact_id: string;
  lead_source: string;
  lead_status: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

// Form Validation Schema
const formSchema = z.object({
  contact_id: z.string().min(2).max(50),
  lead_source: z.string().min(2).max(50),
  lead_status: z.string().min(2).max(50),
});

export default function TableDemo() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact_id: "",
    },
  });

  const { data: Sup } = useGetData({
    endpoint: `/api/leads`,
    params: {
      queryKey: ["lead"],
      retry: 1,
      onSuccess: (data) => {
        setSuppliers(data.data.Lead);
        setPagination(data.data.pagination);
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate supplier")) {
          toast.error("Supplier name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to fetch supplier data. Please try again.");
        }
      },
    },
  });

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
        <h3 className="text-lg font-semibold">Leads List</h3>
      </div>
      <div className="flex justify-between items-center space-x-2 w-full">
        {/* Search Bar Starts */}
        <div className="flex-1 space-x-2">
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Search Bar Ends */}
        <div className="flex space-x-2">
          {/* Add(Page) Starts */}
          <Button variant="outline" onClick={() => navigate("/leads/add")}>
            Add Leads
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
              <TableHead onClick={() => handleSort("contact_id")}>
                Contact
              </TableHead>
              <TableHead onClick={() => handleSort("lead_source")}>
                Lead Source
              </TableHead>
              <TableHead onClick={() => handleSort("lead_status")}>
                Lead Status
              </TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableFooter></TableFooter>
          <TableBody>
            {Sup?.Lead?.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead?.contact?.contact_person}</TableCell>
                <TableCell>{lead.lead_source}</TableCell>
                <TableCell>{lead.lead_status}</TableCell>
                <TableCell className="flex justify-items space-x-2">
                  <AlertDialogbox url={lead.id} />

                  {/* <button
                    onClick={() => navigate(`/leads/edit/${lead.id}`)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button> */}
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
