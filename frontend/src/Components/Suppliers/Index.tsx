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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: "",
    },
  });

  // Fetch Suppliers
  useEffect(() => {
    axios
      .get("/api/suppliers", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      })
      .then((response) => {
        setSuppliers(response.data.data.Suppliers);
        setPagination(response.data.data.pagination);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, [currentPage, itemsPerPage]);

  // Sorting function
  const handleSort = (key: keyof Supplier) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key as keyof Supplier];
    const bValue = b[sortConfig.key as keyof Supplier];

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

  // Delete Supplier
  const handleDelete = (supplierId: string) => {
    axios
      .delete(`/api/suppliers/${supplierId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        setSuppliers(
          suppliers.filter((supplier) => supplier.id !== supplierId)
        );
      })
      .catch(() => {
        setError("Failed to delete supplier");
      });
  };

  // onSubmit function
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    axios
      .post("/api/suppliers", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setSuppliers((prevSuppliers) => [...prevSuppliers, response.data]);
        form.reset();
        window.location.reload();
      })
      .catch(() => {
        setError("Failed to add supplier");
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
        <h3 className="text-lg font-semibold">Suppliers List</h3>
        {/* Add Supplier Dialog Start */}
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add (Dialog)</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Suppliers</DialogTitle>
                <DialogDescription>
                  Add your supplier details here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-40">Supplier:</FormLabel>{" "}
                        {/* Adjust width as needed */}
                        <FormControl className="flex-1">
                          <Input placeholder="Supplier" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="street_address"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-40">Street Address:</FormLabel>{" "}
                        <FormControl>
                          <Input placeholder="Street Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-40">Area:</FormLabel>{" "}
                        <FormControl>
                          <Input placeholder="Area" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          {/* Add Supplier Dialog End */}
          <Button variant="outline" onClick={() => navigate("/suppliers/add")}>
            Add (Page)
          </Button>
        </div>
      </div>

      <div className="panel p-4 rounded-md bg-gray-50">
        {/* Table Start */}
        <Table>
          <TableCaption>A list of your recent suppliers.</TableCaption>
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
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableFooter></TableFooter>
          <TableBody>
            {sortedSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.supplier}</TableCell>
                <TableCell>{supplier.street_address}</TableCell>
                <TableCell>{supplier.area}</TableCell>
                <TableCell>{supplier.city}</TableCell>
                <TableCell className="flex justify-items  space-x-2">
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-500 hover:text-red-700"
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
