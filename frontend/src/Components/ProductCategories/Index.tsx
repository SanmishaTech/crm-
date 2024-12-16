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

import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import ProductCategoryDialog from "./ProductCategoryDialog";
import PaginationComponent from "../Departments/PaginationComponent";
import AddDepartment from "../Departments/AddDepartment";
// Supplier type
type ProductCategory = {
  id: string;
  product_category: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

// Form Validation Schema
const formSchema = z.object({
  product_category: z
    .string()
    .min(1, "Product category name is required")
    .max(50),
});

export default function TableDemo() {
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    []
  );
  const [open, setOpen] = useState(false); // Manage the dialog state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [editProductCategory, setEditProductCategory] =
    useState<ProductCategory | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_category: "",
    },
  });

  // Fetch Product Categoriess
  const fetchProductCategories = () => {
    axios
      .get("/api/product_categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm, // Include search term in the query params
        },
      })
      .then((response) => {
        setProductCategories(response.data.data.ProductCategories);
        setPagination(response.data.data.Pagination);
        setLoading(false); // Stop loading
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false); // Stop loading even if there's an error
      });
  };

  useEffect(() => {
    fetchProductCategories();
  }, [currentPage, itemsPerPage, searchTerm]); // Add searchTerm as a dependency

  // Sorting function
  const handleSort = (key: keyof ProductCategory) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProductCategories = [...productCategories].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key as keyof ProductCategory];
    const bValue = b[sortConfig.key as keyof ProductCategory];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  if (error) {
    return <div>{error}</div>;
  }

  // Delete Supplier
  const handleDelete = (productCategoryId: string) => {
    axios
      .delete(`/api/product_categories/${productCategoryId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        setProductCategories(
          productCategories.filter(
            (productCategory) => productCategory.id !== productCategoryId
          )
        );
        fetchProductCategories();
        // window.location.reload();
      })
      .catch(() => {
        setError("Failed to delete Product Category");
      });
  };

  // Open the edit dialog and populate form with Product Category data
  const handleEdit = (productCategory: ProductCategory) => {
    setEditProductCategory(productCategory);
    form.setValue("product_category", productCategory.product_category); // Populate form with existing data
    handleEditDialogOpen();
  };

  const handleEditDialogOpen = () => {
    setOpen(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center p-2 space-x-2">
        <h3 className="text-lg font-semibold">Product Categories List</h3>
      </div>
      <div className="flex justify-between items-center space-x-2 w-full">
        {/* Search Bar Starts */}
        <div className="flex-1 space-x-2">
          <Input
            placeholder="Search Product Categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Search Bar Ends */}
        <div className="flex space-x-2">
          {/* Add(Dialog) Starts */}
          <ProductCategoryDialog
            setOpen={setOpen}
            open={open}
            editProductCategory={editProductCategory}
            setEditProductCategory={setEditProductCategory}
            setError={setError}
            form={form}
            fetchProductCategories={fetchProductCategories}
            loading={loading}
            setLoading={setLoading}
          />
          {/* Add(Dialog) Ends */}
        </div>
      </div>

      <div className="panel p-4 rounded-md bg-gray-50">
        {/* Table Start */}
        <Table>
          <TableCaption>A list of your recent Product Categories.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("productCategory")}>
                Product Categories
              </TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableFooter></TableFooter>
          <TableBody>
            {sortedProductCategories.map((productCategory) => (
              <TableRow key={productCategory.id}>
                <TableCell>{productCategory.product_category}</TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => handleDelete(productCategory.id)}
                    className="text-red-500 hover:text-red-700 pr-1"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(productCategory)}
                    className="text-blue-500 hover:text-blue-700"
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
