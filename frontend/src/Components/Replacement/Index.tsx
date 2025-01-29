import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Sidebar, { useSidebar } from "./Sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MoreHorizontal, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
} from "@/components/ui/table";

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
import AlertDialogbox from "./Delete";
import { Skeleton } from "@/components/ui/skeleton";

type Replacement = {
  id: string;
  supplier: string;
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

const formSchema = z.object({
  supplier: z.string().min(2).max(50),
  street_address: z.string().min(2).max(50),
  area: z.string().min(2).max(50),
  city: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  pincode: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
  gstin: z.string().min(2).max(50),
});

export default function TableDemo() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { searchTerm, setSearchTerm, toggle, isMinimized } = useSidebar();
  const navigate = useNavigate();
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: "",
    },
  });

  const { data: Sup } = useGetData({
    endpoint: `/api/replacements?search=${searchTerm}&page=${currentPage}&total=${totalPages}`,
    params: {
      queryKey: ["replacements", searchTerm, currentPage],
      retry: 1,

      onSuccess: (data) => {
        setPagination(data?.data?.pagination);
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("Duplicate Replacements")) {
          toast.error(
            "Replacements name is Duplicated. Please use a unique name."
          );
        } else {
          toast.error("Failed to  data. Please try again.");
        }
      },
    },
  });

  if (loading) {
    return (
      <div className="flex">
        <Sidebar className="" />
        <div className="p-6 w-full bg-accent/60 ml-4 rounded-lg shadow-lg">
          <div className="p-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32 mx-auto" />
            </div>
          </div>
          <div className="flex justify-between items-center py-1 space-x-3 mr-4">
            <div className="ml-4 mt-2">
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="flex-1 space-x-2">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          <div className="panel p-4 rounded-md bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-32" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead className="text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className=" flex justify-center">
              <Skeleton className="h-5 w-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen  w-full ">
      <Sidebar className="md:sticky md:top-0 md:h-screen" />
      <div className="flex-1 p-2 md:p-6 w-full bg-accent/60 md:ml-4 mr-8 rounded-lg shadow-lg">
        <div className="p-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mx-auto text-foreground">
              Replacements & Repairs List
            </h3>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center py-1 space-y-2 md:space-y-0 md:space-x-3 ">
          {/* <div className="w-full md:w-auto flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Filter
                    onClick={toggle}
                    className="h-5 text-foreground hover:text-foreground/80"
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-popover-foreground">
                  <p>Filter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div> */}
          <div className="flex-1 space-x-2">
            {isMinimized ? (
              <Input
                className="bg-background text-foreground border-border"
                placeholder="Search Replacements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            ) : null}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate("/replacements/add")}
              className="text-foreground hover:text-foreground/80 hover:bg-accent"
            >
              Add Replacement
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-md bg-card">
          <Table>
            <TableCaption className="text-muted-foreground">
              A list of your replacements.
            </TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-accent/50">
                <TableHead className="text-foreground">Customer</TableHead>
                <TableHead className="text-foreground">Contact</TableHead>
                <TableHead className="text-foreground">Email</TableHead>
                <TableHead className="text-foreground">Instrument</TableHead>
                <TableHead className="text-foreground">Registered</TableHead>
                <TableHead className="text-right text-foreground">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableFooter className="bg-muted/50"></TableFooter>
            <TableBody>
              {Sup?.data?.Replaces?.map((replacement) => (
                <TableRow key={replacement.id} className="hover:bg-accent/50">
                  <TableCell className="text-foreground">
                    {replacement.customer_name}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {replacement.customer_mobile}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {replacement.customer_email}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {replacement.instrument}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {replacement.registered ? "Yes" : "No"}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-foreground hover:text-foreground/80 hover:bg-accent"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="center"
                        className="w-full flex-col items-center flex justify-center bg-popover border-border"
                      >
                        <DropdownMenuLabel className="hover:cursor-default text-foreground">
                          Actions
                        </DropdownMenuLabel>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigate(`/replacements/edit/${replacement.id}`);
                          }}
                          className="w-full text-sm text-foreground hover:text-foreground/80 hover:bg-accent"
                        >
                          Edit
                        </Button>
                        <AlertDialogbox url={replacement.id} />
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
        </div>
      </div>
    </div>
  );
}
