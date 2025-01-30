//@ts-nocheck
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react"; // Import the close icon
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Sidebar, { useSidebar } from "./Sidebar";
import axios from "axios";
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Ensure this import is correct

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useGetData } from "@/lib/HTTP/GET";
// import AlertDialogbox from "./Delete";

// Supplier type
type Invoice = {
  id: string;
  invoice_number: string;
  invoice_date: string;
  amount: string;
  dispatch_details: string;
  invoice_file: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export default function TableDemo() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { searchTerm, toggle, isMinimized, setSearchTerm } = useSidebar();
  const navigate = useNavigate();
  // Pagination functions
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

  // Fetch Invoice
  const { data: Invo } = useGetData({
    endpoint: `/api/invoices?search=${searchTerm}&page=${currentPage}&total=${totalPages}`,
    params: {
      queryKey: ["invoices", searchTerm, currentPage],
      retry: 1,

      onSuccess: (data) => {
        setInvoices(data.Invoices);
        setPagination(data?.data?.Pagination);
        setLoading(false);
      },
      onError: (error) => {
        toast.error("Failed to fetch invoices");
      },
    },
  });

  const handleViewInvoice = async (fileName) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`/api/show_invoice/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Invoice Not Found. Generate invoice again");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen  w-full ">
      <Sidebar className="md:sticky md:top-0 md:h-screen" />
      <div className="flex-1 p-2 md:p-6 w-full bg-accent/60 md:ml-4 mr-8 rounded-lg shadow-lg">
        <div className="p-2  ">
          <div className="flex justify-between items-center ">
            <h3 className="text-lg  font-semibold mx-auto">Invoice List</h3>
          </div>
        </div>
        <div className="flex justify-between items-center py-1 space-x-3   ">
          {/* <div className="ml-4 mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Filter onClick={toggle} className="  h-5  " />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div> */}
          <div className="flex-1 space-x-2">
            {isMinimized ? (
              <Input
                placeholder="Search Invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            ) : null}
          </div>

          {/* <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate("/suppliers/add")}
            >
              Add Invoice
            </Button>
          </div> */}
        </div>

        <div className="p-4 rounded-md bg-card ">
          {/* Table Start */}
          <Table>
            <TableCaption>A list of your Invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="text-foreground"
                  onClick={() => handleSort("invoice_number")}
                >
                  Invoice Number
                </TableHead>
                <TableHead
                  className="text-foreground"
                  onClick={() => handleSort("products")}
                >
                  Products
                </TableHead>
                <TableHead
                  className="text-foreground"
                  onClick={() => handleSort("invoice_date")}
                >
                  Invoice Date
                </TableHead>
                <TableHead
                  className="text-foreground"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                </TableHead>
                <TableHead
                  className="text-foreground"
                  onClick={() => handleSort("dispatch_details")}
                >
                  Dispatch Details
                </TableHead>
                <TableHead className="text-foreground text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableFooter></TableFooter>
            <TableBody>
              {Invo?.data?.Invoices?.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell>
                    {typeof invoice.product_names === "string" ||
                    Array.isArray(invoice.product_names)
                      ? Array.isArray(invoice.product_names)
                        ? invoice.product_names.join(", ")
                        : invoice.product_names.charAt(0).toUpperCase() +
                          invoice.product_names.slice(1)
                      : "N/A"}
                  </TableCell>

                  <TableCell>
                    {new Date(invoice.invoice_date).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>₹{invoice.amount}</TableCell>
                  <TableCell>{invoice.dispatch_details ?? "N/A"}</TableCell>
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // window.open(
                            //   `/api/show_invoice/${invoice.invoice_file}`,
                            //   "_blank"
                            // );
                            handleViewInvoice(invoice.invoice_file);
                          }}
                          className="w-full text-sm"
                        >
                          View Invoice
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigate(`/invoices/edit/${invoice.id}`);
                          }}
                          className="w-full text-sm"
                        >
                          Edit
                        </Button>
                        {/* <AlertDialogbox url={invoice.id} /> */}
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
                disabled={currentPage === 1}
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
