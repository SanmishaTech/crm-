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
    endpoint: `/api/leads?searchTerm=${encodeURIComponent(
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
        if (data?.data?.Lead) {
          setSuppliers(data.data.Lead);
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
    <div className="flex ">
      <Sidebar onFilterChange={handleFilterChange} />
      <div className="p-6 w-full  bg-accent/60 ml-4 mr-8 rounded-lg shadow-lg ">
        <div className="p-2  ">
          <div className="flex justify-between items-center ">
            <h3 className="text-lg  font-semibold mx-auto">Leads List</h3>
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
                placeholder="Search Leads..."
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
            <Button variant="outline" onClick={() => navigate("/leads/add")}>
              Add Leads
            </Button>
          </div>
        </div>

        <div className="panel p-4 rounded-md bg-card">
          {/* Table Start */}
          <Table>
            <TableCaption>A list of your leads.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground">Contact</TableHead>
                <TableHead className="text-foreground">Assigned To</TableHead>
                <TableHead className="text-foreground">Lead Date</TableHead>
                <TableHead className="text-foreground">Days Since Created</TableHead>

                {/* <TableHead onClick={() => handleSort("lead_source")}>
                  Lead Source
                </TableHead> */}
                <TableHead className="text-foreground">Products</TableHead>

                <TableHead className="text-foreground">
                  Next Follow Up Date
                </TableHead>
                <TableHead className="text-foreground">
                  Follow Up Type
                </TableHead>

                <TableHead className="text-foreground">Lead Status</TableHead>
                <TableHead className="text-foreground text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableFooter></TableFooter>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableBody>
                    {Sup?.data?.Lead &&
                      Array.isArray(Sup.data.Lead) &&
                      Sup.data.Lead.map((lead) => (
                        <TooltipProvider key={lead.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <TableRow>
                                <TableCell>
                                  {lead?.contact?.contact_person}
                                </TableCell>
                                <TableCell>
                                  {lead?.assigned_user?.name || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {new Date(lead?.created_at).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  ).replace(/\//g, "-")}
                                </TableCell>
                                <TableCell>
                                  {lead?.created_at
                                    ? Math.floor(
                                        (new Date(lead.created_at).getTime() -
                                          new Date().getTime()) /
                                          (1000 * 60 * 60 * 24)
                                      )
                                    : "-"}
                                </TableCell>
                                {/* <TableCell>{lead.lead_source}</TableCell> */}
                                <TableCell>
                                  {typeof lead.product_names === "string" ||
                                  Array.isArray(lead.product_names)
                                    ? Array.isArray(lead.product_names)
                                      ? lead.product_names.join(", ")
                                      : lead.product_names
                                          .charAt(0)
                                          .toUpperCase() +
                                        lead.product_names.slice(1)
                                    : "N/A"}
                                </TableCell>

                                <TableCell>
                                  {lead.lead_follow_up_date
                                    ? (() => {
                                        const date = new Date(
                                          lead.lead_follow_up_date
                                        );
                                        const day = String(
                                          date.getDate()
                                        ).padStart(2, "0");
                                        const month = String(
                                          date.getMonth() + 1
                                        ).padStart(2, "0");
                                        const year = String(
                                          date.getFullYear()
                                        ).padStart(4, "0");
                                        return `${day}/${month}/${year}`;
                                      })()
                                    : "N/A"}
                                </TableCell>

                                <TableCell
                                  style={{
                                    whiteSpace: "normal",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {lead.follow_up_type
                                    ? lead.follow_up_type
                                        .charAt(0)
                                        .toUpperCase() +
                                      lead.follow_up_type.slice(1)
                                    : "N/A"}
                                </TableCell>

                                <TableCell>
                                  {lead.lead_status
                                    ? lead.lead_status.charAt(0).toUpperCase() +
                                      lead.lead_status.slice(1)
                                    : "N/A"}
                                </TableCell>

                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                      >
                                        <span className="sr-only">
                                          Open menu
                                        </span>
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="center"
                                      className="w-full flex-col items-center flex justify-center"
                                    >
                                      <DropdownMenuLabel>
                                        Actions
                                      </DropdownMenuLabel>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          navigate(`/leads/edit/${lead.id}`);
                                        }}
                                        className="w-full text-sm"
                                      >
                                        Edit
                                      </Button>
                                      <AlertDialogbox url={lead.id} />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          navigate(
                                            `/leads/followUps/${lead.id}`
                                          );
                                        }}
                                        className="w-full text-sm"
                                      >
                                        Follow Up
                                      </Button>

                                      {(lead.lead_status === "Quotation" ||
                                        lead.lead_status === "Deal") && (
                                        <AlertQuotation leadId={lead.id} />
                                      )}

                                      {lead.lead_status === "Deal" && (
                                        <AlertInvoice leadId={lead.id} />
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>
                                <strong>Remarks:</strong>{" "}
                                {(lead.follow_up_remark || "N/A")
                                  .charAt(0)
                                  .toUpperCase() +
                                  (lead.follow_up_remark || "N/A").slice(1)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                  </TableBody>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
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
