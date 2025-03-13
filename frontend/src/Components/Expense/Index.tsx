//@ts-nocheck
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Filter } from "lucide-react";
import Sidebar, { useSidebar } from "./Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toast } from "sonner";
import {
  File,
  PlusCircle,
  Search,
  Pencil,
  Trash,
  MoreHorizontal,
  ListFilter,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useGetData } from "@/lib/HTTP/GET";
import AlertDialogbox from "./AlertBox";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import AlertQuotation from "./AlertQuotation";
import AlertInvoice from "./AlertInvoice";
import Report from "./Report";

// Supplier type
type Supplier = {
  id: string;
  contact_id: string;
  lead_source: string;
  lead_status: string;
  follow_up_type: string;
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
  follow_up_type: z.string().min(2).max(50),
});

export default function TableDemo() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const {
    searchTerm,
    setSearchTerm,
    leadStatus,
    setLeadStatus,
    productIds,
    setProductIds,
    toggle,
    isMinimized,
  } = useSidebar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact_id: "",
    },
  });
  const { id } = useParams();

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

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const { data: Sup } = useGetData({
  endpoint: `/api/expenses?searchTerm=${encodeURIComponent(
      searchTerm || ""
    )}&page=${currentPage}&total=${totalPages}&leadStatus=${leadStatus}${
      sortField
        ? `&sortField=${sortField}&sortOrder=${sortOrder}&productIds=${productIds}`
        : ""
    }`,
    params: {
      queryKey: [
        "lead",
        searchTerm,
        currentPage,
        leadStatus,
        productIds,
        sortField,
        sortOrder,
      ],
      retry: 1,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["lead"] });
        if (data?.data?.Expense) {
          setSuppliers(data.data.Expense);
          setPagination(data.data.pagination);
        } else {
          setSuppliers([]);
        }
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate supplier")) {
          toast.error("Supplier name is duplicated. Please use a unique name.");
        }
        setLoading(false);
      },
    },
  });
  

  const handleGenerateQuotation = async ({ leadId, data }) => {
    try {
      const response = await fetch(`/api/generate_quotation/${leadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data), // Now 'data' is defined
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        queryClient.invalidateQueries({ queryKey: ["lead"] });

        toast.success(
          `Quotation for ${leadId} generated and opened successfully!`
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.errors?.error || "Failed to generate Quotation.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while generating the quotation.");
    }
  };

  const handleFilterChange = (filters: any) => {
    if (filters.status !== undefined) {
      setLeadStatus(filters.status);
      setProductIds(filters.productIds);
    }
  };

  return (
    <div className="flex">
      <Sidebar onFilterChange={handleFilterChange} />
      <div className="p-6 w-full bg-accent/60 ml-4 mr-8 rounded-lg shadow-lg">
        <div className="p-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mx-auto">Expenses List</h3>
          </div>
        </div>
        <div className="flex justify-between items-center space-x-2 py-1 w-full">
          <div className="ml-1 mt-2">
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
                placeholder="Search Expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            ) : null}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" type="button">
              <Report />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate("/expense/add")}>
              Add Expenses
            </Button>
          </div>
        </div>

        <div className="panel p-4 rounded-md bg-card">
          <Table>
            <TableCaption>A list of your expenses.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground">Voucher Number</TableHead>
                <TableHead className="text-foreground">Voucher Date</TableHead>
                <TableHead className="text-foreground">Expense Head</TableHead>
                <TableHead className="text-foreground">Amount</TableHead>
                <TableHead className="text-foreground text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Sup?.data?.Expense &&
                Array.isArray(Sup.data.Expense) &&
                Sup.data.Expense.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.voucher_number}</TableCell>
                    <TableCell>
                      {expense.voucher_date
                        ? (() => {
                            const date = new Date(expense.voucher_date);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(2, "0");
                            const year = String(date.getFullYear());
                            return `${day}/${month}/${year}`;
                          })()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {expense.expense_details?.map((detail, index) => (
                        <div key={detail.id}>
                          {detail.expense_head_name}
                          {index < expense.expense_details.length - 1 ? ", " : ""}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{expense.voucher_amount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigate(`/expense/edit/${expense.id}`);
                            }}
                            className="w-full text-sm"
                          >
                            Edit
                          </Button>
                          <AlertDialogbox url={expense.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <Pagination>
            <PaginationContent className="flex items-center space-x-4">
              <PaginationPrevious
                className={`hover:pointer text-foreground hover:text-foreground/80 hover:bg-accent ${
                  currentPage === 1 ? "cursor-default opacity-50" : "cursor-pointer"
                }`}
                onClick={goToPreviousPage}
              >
                Previous
              </PaginationPrevious>

              <span className="text-sm text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <PaginationNext
                className={`hover:pointer text-foreground hover:text-foreground/80 hover:bg-accent ${
                  currentPage === totalPages ? "cursor-default opacity-50" : "cursor-pointer"
                }`}
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </PaginationNext>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
