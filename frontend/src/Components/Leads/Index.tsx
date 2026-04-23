import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {
  PlusCircle,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useNavigate } from "react-router-dom";
import { useGetData } from "@/lib/HTTP/GET";
import AlertDialogbox from "./AlertBox";
import { useQueryClient } from "@tanstack/react-query";
import AlertQuotation from "./AlertQuotation";
import AlertInvoice from "./AlertInvoice";
import Report from "./Report";

// Lead type
type Lead = {
  id: string;
  lead_number: string;
  lead_status: string;
  created_at: string;
  lead_follow_up_date?: string;
  follow_up_type?: string;
  product_names?: string | string[];
  contact?: {
    contact_person: string;
  };
  assigned_user?: {
    name: string;
  };
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export default function TableDemo() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [openLeadStatus, setOpenLeadStatus] = useState(false);
  
  // Re-adding local state syncing as requested per patterns seen in Contacts
  const [suppliers, setSuppliers] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const leadStatusOptions = [
    { value: "Open", label: "Open" },
    { value: "In Progress", label: "In Progress" },
    { value: "Purchase Order", label: "Purchase Order Received" },
    { value: "Payment Received", label: "Payment Received" },
    { value: "Close", label: "Close" },
  ];

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Handle debouncing to optimize TanStack Query refetches
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { isLoading } = useGetData({
    endpoint: `/api/leads?searchTerm=${encodeURIComponent(
      debouncedSearch || ""
    )}&page=${currentPage}&leadStatus=${leadStatus}`,
    params: {
      queryKey: ["lead", debouncedSearch, currentPage, leadStatus],
      retry: 1,
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["lead"] });
        if (data?.data?.Lead) {
          setSuppliers(data.data.Lead);
          setPagination(data.data.pagination);
        } else {
          setSuppliers([]);
        }
      },
    },
  });

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

  return (
    <div className="flex w-full">
      <div className="p-2 md:p-6 w-full bg-accent/60 md:ml-4 mr-8 rounded-lg shadow-lg ">
        <div className="p-2  ">
          <div className="flex justify-between items-center ">
            <h3 className="text-xl font-bold mx-auto text-primary">Leads Management</h3>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 py-4 px-2 bg-background/50 rounded-t-lg border-b border-border/50">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by contact, lead number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Popover open={openLeadStatus} onOpenChange={setOpenLeadStatus}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-[220px] justify-between bg-background border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <span className="truncate">
                    {leadStatus
                      ? leadStatusOptions.find((s) => s.value === leadStatus)
                          ?.label
                      : "All Statuses"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0 shadow-xl border-border/50">
                <Command>
                  <CommandInput placeholder="Filter status..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No status found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setLeadStatus("");
                          setOpenLeadStatus(false);
                          setCurrentPage(1);
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            leadStatus === "" ? "opacity-100" : "opacity-0"
                          )}
                        />
                        All Statuses
                      </CommandItem>
                      {leadStatusOptions.map((status) => (
                        <CommandItem
                          key={status.value}
                          value={status.value}
                          onSelect={(currentValue) => {
                             // Handle lowercase normalized values from CommandItem
                            const matchedStatus = leadStatusOptions.find(opt => 
                              opt.value.toLowerCase() === currentValue.toLowerCase() || 
                              opt.label.toLowerCase() === currentValue.toLowerCase()
                            );
                            const finalVal = matchedStatus ? matchedStatus.value : currentValue;
                            
                            setLeadStatus(finalVal === leadStatus ? "" : finalVal);
                            setOpenLeadStatus(false);
                            setCurrentPage(1);
                          }}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              leadStatus === status.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {status.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            <Report leadId="all" />
            
            <Button 
              className="bg-primary hover:bg-primary/90 text-white shadow-sm"
              onClick={() => navigate("/leads/add")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </div>
        </div>

        <div className="panel p-4 rounded-b-lg bg-card shadow-sm relative">
          {isLoading && (
            <div className="absolute inset-x-0 top-0 h-1 bg-primary/20 animate-pulse" />
          )}
          <Table>
            <TableCaption>A list of your leads.</TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-foreground font-semibold">Contact</TableHead>
                <TableHead className="text-foreground font-semibold">Assigned To</TableHead>
                <TableHead className="text-foreground font-semibold">Lead Date</TableHead>
                <TableHead className="text-foreground font-semibold">Days Active</TableHead>
                <TableHead className="text-foreground font-semibold">Products</TableHead>
                <TableHead className="text-foreground font-semibold">Next Follow Up</TableHead>
                <TableHead className="text-foreground font-semibold">Type</TableHead>
                <TableHead className="text-foreground font-semibold">Status</TableHead>
                <TableHead className="text-foreground font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.length > 0 ? (
                suppliers.map((lead: Lead) => (
                  <TableRow key={lead.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-primary">
                      {lead?.contact?.contact_person || "N/A"}
                    </TableCell>
                    <TableCell>
                      {lead?.assigned_user?.name || "Unassigned"}
                    </TableCell>
                    <TableCell>
                      {lead?.created_at ? new Date(lead.created_at).toLocaleDateString("en-GB") : "N/A"}
                    </TableCell>
                    <TableCell>
                      {lead?.created_at
                        ? Math.max(0, Math.floor((new Date().getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)))
                        : "0"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {Array.isArray(lead.product_names)
                        ? lead.product_names.join(", ")
                        : lead.product_names || "N/A"}
                    </TableCell>
                    <TableCell>
                      {lead.lead_follow_up_date
                        ? new Date(lead.lead_follow_up_date).toLocaleDateString("en-GB")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {lead.follow_up_type ? lead.follow_up_type.charAt(0).toUpperCase() + lead.follow_up_type.slice(1) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-semibold",
                        lead.lead_status === "Close" ? "bg-red-100 text-red-700" :
                        lead.lead_status === "Open" ? "bg-green-100 text-green-700" :
                        "bg-blue-100 text-blue-700"
                      )}>
                        {lead.lead_status === "Purchase Order" ? "PO Received" : lead.lead_status || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`/leads/edit/${lead.id}`)} className="cursor-pointer">
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/leads/followUps/${lead.id}`)} className="cursor-pointer">
                            Follow Up
                          </DropdownMenuItem>
                          {lead.lead_status === "Quotation" && (
                            <AlertQuotation leadId={lead.id} />
                          )}
                          {lead.lead_status === "Purchase Order" && (
                            <AlertInvoice leadId={lead.id} />
                          )}
                          <div className="border-t my-1" />
                          <AlertDialogbox url={lead.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    {isLoading ? "Loading leads..." : "No leads found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          <div className="mt-4 py-4 border-t">
            <Pagination>
              <PaginationContent className="flex items-center justify-between w-full">
                <div className="text-sm text-muted-foreground">
                  Showing {suppliers.length} of {pagination?.total || 0} leads
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium text-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex items-center space-x-2">
                    <PaginationPrevious
                      className={cn(
                        "cursor-pointer text-foreground hover:bg-accent",
                        currentPage === 1 && "pointer-events-none opacity-50"
                      )}
                      onClick={goToPreviousPage}
                    />
                    <PaginationNext
                      className={cn(
                        "cursor-pointer text-foreground hover:bg-accent",
                        currentPage === totalPages && "pointer-events-none opacity-50"
                      )}
                      onClick={goToNextPage}
                    />
                  </div>
                </div>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
