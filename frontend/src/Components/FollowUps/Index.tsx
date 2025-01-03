//@ts-nocheck
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useDeleteData } from "@/lib/HTTP/DELETE";
import { useGetData } from "@/lib/HTTP/GET";
import AlertDialogbox from "./Delete";

// Supplier type
type Supplier = {
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

// Form Validation Schema
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
      supplier: "",
    },
  });

  //Fetch Suppliers
  const { data: Sup } = useGetData({
    endpoint: `/api/suppliers?search=${searchTerm}&page=${currentPage}`,
    params: {
      queryKey: ["supplier", searchTerm],
      retry: 1,

      onSuccess: (data) => {
        console.log("test-test", data);
        setSuppliers(data.Suppliers);
        setPagination(data.pagination);
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
        <h3 className="text-lg font-semibold">Suppliers List</h3>
      </div>
      <div className="flex justify-between items-center space-x-2 w-full">
        {/* Search Bar Starts */}
        <div className="flex-1 space-x-2">
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Search Bar Ends */}
        <div className="flex space-x-2">
          {/* Add(Page) Starts */}
          <Button variant="outline" onClick={() => navigate("/suppliers/add")}>
            Add Supplier
          </Button>
          {/* Add(Page) Ends */}
        </div>
      </div>

      <div className="panel p-4 rounded-md bg-gray-50">
        {/* Table Start */}
        <Table>
           <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("supplier")}>
                Suppliers
              </TableHead>
              <TableHead onClick={() => handleSort("street_address")}>
                Street Address
              </TableHead>
              <TableHead onClick={() => handleSort("area")}>Area</TableHead>
              <TableHead onClick={() => handleSort("city")}>City</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableFooter></TableFooter>
          <TableBody>
            {console.log("sup", Sup)}
            {Sup?.data?.Suppliers?.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.supplier}</TableCell>
                <TableCell>{supplier.street_address}</TableCell>
                <TableCell>{supplier.area}</TableCell>
                <TableCell>{supplier.city}</TableCell>
                <TableCell className="text-right">
                  {/* <button
                    onClick={() => navigate(`/suppliers/edit/${supplier.id}`)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <AlertDialogbox url={supplier.id} /> */}
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
                          navigate(`/suppliers/edit/${supplier.id}`);
                        }}
                        className="w-full text-sm"
                      >
                        Edit
                      </Button>
                      {/* <DropdownMenuSeparator /> */}
                      <AlertDialogbox
                        url={supplier.id}
                      />
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
