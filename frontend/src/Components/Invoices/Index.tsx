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

// // Form Validation Schema
// const formSchema = z.object({
//   supplier: z.string().min(2).max(50),
//   street_address: z.string().min(2).max(50),
//   area: z.string().min(2).max(50),
//   city: z.string().min(2).max(50),
//   state: z.string().min(2).max(50),
//   pincode: z.string().min(2).max(50),
//   country: z.string().min(2).max(50),
//   gstin: z.string().min(2).max(50),
// });

export default function TableDemo() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { searchTerm, toggle, isMinimized } = useSidebar();
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
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     supplier: "",
  //   },
  // });

  // Fetch Suppliers
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
        if (error.message && error.message.includes("duplicate invice")) {
          toast.error("Supplier name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to fetch invoice data. Please try again.");
        }
      },
    },
  });

  const handleViewInvoice = async (fileName) => {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

    try {
      const response = await axios.get(`/api/show_invoice/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        responseType: "blob", // Make sure the response is a blob (for PDF files)
      });
      // Create a blob URL from the response
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a link element to trigger the opening of the PDF in a new tab
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank"; // Open in a new tab
      link.click(); // Programmatically click the link to open the PDF in the new tab

      // Cleanup by revoking the object URL after use
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // console.log("Error fetching the invoice:", error.response.data);
      toast.error("Invoice Not Found. Generate invoice again");
    }
  };

  return (
    <div className="flex ">
      <Sidebar className="" />
      <div className="p-6 w-full bg-accent/50 ml-4 rounded-lg shadow-lg ">
        <div className="p-2  ">
          <div className="flex justify-between items-center ">
            <h3 className="text-lg  font-semibold mx-auto">Invoice List</h3>
          </div>
        </div>
        <div className="flex justify-between items-center space-x-3 mr-4  ">
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

        <div className="p-4 rounded-md bg-gray-50 ">
          {/* Table Start */}
          <Table>
            <TableCaption>A list of your recent Invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("invoice_number")}>
                  Invoice Number
                </TableHead>
                <TableHead onClick={() => handleSort("invoice_date")}>
                  Invoice Date
                </TableHead>
                <TableHead onClick={() => handleSort("amount")}>
                  Amount
                </TableHead>
                <TableHead onClick={() => handleSort("dispatch_details")}>
                  Dispatch Details
                </TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableFooter></TableFooter>
            <TableBody>
              {Invo?.data?.Invoices?.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell>{invoice.invoice_date}</TableCell>
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
