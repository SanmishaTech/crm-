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
import { usePostData } from "@/lib/HTTP/DELETE";
import PaginationComponent from "../Departments/PaginationComponent";
import AlertDialogbox from "./Delete";

// Products type
type Product = {
  id: string;
  product: string;
  product_category_id: string;
  supplier_id: string;
  model: string;
  manufacturer: string;
  opening_qty: string;
  closing_qty: string;
  last_traded_price: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export default function TableDemo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const navigate = useNavigate();

  // Fetch Products
  const fetchProducts = () => {
    axios
      .get("/api/products", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
        },
      })
      .then((response) => {
        setProducts(response.data.data.Products);
        setPagination(response.data.data.Pagination);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage, searchTerm]);

  // Sorting function
  const handleSort = (key: keyof Product) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key as keyof Product];
    const bValue = b[sortConfig.key as keyof Product];

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
    <div className="p-6  mx-auto  rounded-lg shadow-lg">
      <div className="flex justify-between items-center p-2 space-x-2">
        <h3 className="text-lg font-semibold">Products List</h3>
      </div>
      <div className="flex justify-between items-center space-x-2 w-full">
        {/* Search Bar Starts */}
        <div className="flex-1 space-x-2">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Search Bar Ends */}
        <div className="flex space-x-2">
          {/* Add(Page) Starts */}
          <Button variant="outline" onClick={() => navigate("/products/add")}>
            Add Products
          </Button>
          {/* Add(Page) Ends */}
        </div>
      </div>

      <div className="panel p-4 rounded-md bg-gray-50">
        {/* Table Start */}
        <Table>
          <TableCaption>A list of your products.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("product")}>
                Product
              </TableHead>
              <TableHead onClick={() => handleSort("model")}>Model</TableHead>
              <TableHead onClick={() => handleSort("Manufacturer")}>
                Manufacturer
              </TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableFooter></TableFooter>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.product}</TableCell>
                <TableCell>{product.model}</TableCell>
                <TableCell>{product.manufacturer}</TableCell>
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
                          navigate(`/products/edit/${product.id}`);
                        }}
                        className="w-full text-sm"
                      >
                        Edit
                      </Button>
                      {/* <DropdownMenuSeparator /> */}
                      <AlertDialogbox
                        fetchProducts={fetchProducts}
                        url={product.id}
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
        {/* Pagination Start */}
        <PaginationComponent
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pagination={pagination}
        />
        {/* Pagination End */}
      </div>
    </div>
  );
}
