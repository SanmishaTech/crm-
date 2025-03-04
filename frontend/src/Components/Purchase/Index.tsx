//@ts-nocheck
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Filter } from "lucide-react";
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
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import AlertQuotation from "./AlertQuotation";
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
  } = useState();
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
    endpoint: `/api/purchase?searchTerm=${encodeURIComponent(
      searchTerm || ""
    )}&page=${currentPage}&total=${totalPages}`,
    params: {
      queryKey: [
        "purchase",
        searchTerm,
        currentPage,
        leadStatus,
        productIds,
        sortField,
        sortOrder,
      ],
      retry: 1,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["purchase"] });
        if (data?.data?.Purchases) {
          setPagination(data.data.pagination);
        } else {
          // setSuppliers([]);
        }
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate purchase")) {
          toast.error("purchase name is duplicated. Please use a unique name.");
        }
        setLoading(false);
      },
    },
  });
  const { data: Products } = useGetData({
    endpoint: `/api/products`,
    params: {
      queryKey: ["products"],
      retry: 1,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["products"] });

        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate lead")) {
          toast.error("Lead name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to fetch Lead data. Please try again.");
        }
      },
    },
  });

  const handleFilterChange = (filters: any) => {
    if (filters.status !== undefined) {
      setLeadStatus(filters.status);
      setProductIds(filters.productIds);
    }
  };

  return (
    <div className="flex min-h-screen ">
      <div className="p-6 w-full bg-accent/60 ml-4 mr-8 rounded-lg shadow-lg">
        <div className="p-2">
          <div className="flex justify-between items-center ">
            <h3 className="text-lg  font-semibold mx-auto">Purchase List</h3>
          </div>
        </div>
        <div className="flex justify-between items-center space-x-2 py-1 w-full">
          <div className="flex-1 space-x-2">
            <Input
              placeholder="Purchase Leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" type="button">
            <Report />
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate("/purchase/add")}>
              Add Purchase
            </Button>
          </div>
        </div>

        <div className="panel p-4 rounded-md bg-card">
          {/* Table Start */}
          <Table>
            <TableCaption>A list of your leads.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="text-foreground"
                  onClick={() => handleSort("contact_id")}
                >
                  Contact
                </TableHead>

                <TableHead
                  className="text-foreground"
                  onClick={() => handleSort("follow_up_type")}
                >
                  Products
                </TableHead>

                <TableHead
                  className="text-foreground"
                  onClick={() => handleSort("follow_up_type")}
                >
                  Payment Reference No.
                </TableHead>
                <TableHead
                  className="text-foreground"
                  onClick={() => handleSort("follow_up_type")}
                >
                  Payment Status
                </TableHead>
                {/* <TableHead onClick={() => handleSort("follow_up_type")}>
                 Follow Up Type
                </TableHead> */}

                <TableHead
                  className="text-foreground"
                  onClick={() => handleSort("lead_status")}
                >
                  Invoice Number
                </TableHead>
                <TableHead className="text-foreground text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableFooter></TableFooter>

            <TableBody>
              {Sup?.data?.Purchases &&
                Array.isArray(Sup.data?.Purchases) &&
                Sup.data?.Purchases.map((lead) => (
                  <TooltipProvider key={lead.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableRow>
                          <TableCell>{lead?.supplier}</TableCell>
                          {/* <TableCell>{lead.lead_source}</TableCell> */}
                          <TableCell>
                            {typeof lead.product_names === "string" ||
                            Array.isArray(lead.product_names)
                              ? Array.isArray(lead.product_names)
                                ? lead.product_names.join(", ")
                                : lead.product_names.charAt(0).toUpperCase() +
                                  lead.product_names.slice(1)
                              : "N/A"}
                          </TableCell>

                          <TableCell>{lead.payment_ref_no || "NA"} </TableCell>

                          <TableCell
                            style={{
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                            }}
                          >
                            {lead.payment_status
                              ? lead.payment_status.charAt(0).toUpperCase() +
                                lead.payment_status.slice(1)
                              : "N/A"}
                          </TableCell>

                          <TableCell>
                            {lead.invoice_no
                              ? lead.invoice_no.charAt(0).toUpperCase() +
                                lead.invoice_no.slice(1)
                              : "N/A"}
                          </TableCell>

                          {/* <TableCell>
                                  {lead.products
                                    ? lead.products
                                        .map((product) => product.product_id)
                                        .join(", ")
                                    : "N/A"}
                                </TableCell> */}

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
                                    navigate(`/purchase/view/${lead.id}`);
                                  }}
                                  className="w-full text-sm"
                                >
                                  View Purchase Details
                                </Button>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                ))}
            </TableBody>
          </Table>
          {/* Table End */}
          {/* Pagination Start */}
          <Pagination>
            <PaginationContent className="flex items-center space-x-4">
              <PaginationPrevious
                className={`hover:pointer text-foreground hover:text-foreground/80 hover:bg-accent ${
                  currentPage === 1
                    ? "cursor-default opacity-50"
                    : "cursor-pointer"
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
