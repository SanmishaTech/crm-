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
import AlertDialogbox from "./Delete";
import { useDeleteData } from "@/lib/HTTP/DELETE";

import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import ProductCategoryDialog from "./ProductCategoryDialog";
import PaginationComponent from "../Departments/PaginationComponent";
import AddDepartment from "../Departments/AddDepartment";
import { useQueryClient } from "@tanstack/react-query";
import { useGetData } from "@/lib/HTTP/GET";
import useFetchData from "@/lib/HTTP/useFetchData";
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
  const [loading, setLoading] = useState(false);
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
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_category: "",
    },
  });

  // component start

  const params = {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  };

  const options = {
    enabled: true,
    refetchOnWindowFocus: true,
    retry: 3,
  };

  const {
    data: ProductCategoriesDate,
    isLoading: isProductCategoriesLoading,
    error: isProductCategoriesError,
    isSuccess: isProductCategoriesSuccess,
  } = useFetchData("product_categories", null, options, params);

  const handleProductCategoryInvalidateQuery = () => {
    // Invalidate the 'departments' query to trigger a refetch
    queryClient.invalidateQueries(["product_categories", null, params]);
  };

  useEffect(() => {
    if (isProductCategoriesSuccess) {
      setProductCategories(ProductCategoriesDate.data.ProductCategories);
      setPagination(ProductCategoriesDate.data.Pagination);
    }
    if (isProductCategoriesError) {
      console.log("Error", isDepartmentError.message);
    }

    handleProductCategoryInvalidateQuery();
  }, [ProductCategoriesDate, params]);

  // //Fetch Product Categories
  // const { data: ProductCategoriesDate } = useGetData({
  //   endpoint: `/api/product_categories?search=${searchTerm}&page=${currentPage}`,
  //   params: {
  //     queryKey: ["product_categories"],
  //     retry: 1,

  //     onSuccess: (data) => {
  //       console.log("c product categories", data);
  //       const pCategories = data?.data?.ProductCategories; //this is imp cause we r not using async
  //       setProductCategories(pCategories);
  //       setPagination(data.data.Pagination);
  //     },
  //     onError: (error) => {
  //       if (error.message && error.message.includes("duplicate supplier")) {
  //         toast.error("Supplier name is duplicated. Please use a unique name.");
  //       } else {
  //         toast.error("Failed to fetch supplier data. Please try again.");
  //       }
  //     },
  //   },
  // });

  // useEffect(() => {
  //   queryClient.invalidateQueries("product_categories");
  // }, [ProductCategoriesDate, currentPage, itemsPerPage, searchTerm]); // Add searchTerm as a dependency

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
            loading={loading}
            handleProductCategoryInvalidateQuery={
              handleProductCategoryInvalidateQuery
            }
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
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableFooter></TableFooter>
          <TableBody>
            {sortedProductCategories.map((productCategory) => (
              <TableRow key={productCategory.id}>
                <TableCell>{productCategory.product_category}</TableCell>
                <TableCell className="text-right">
                  {/* <button
                    onClick={() => handleEdit(productCategory)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <AlertDialogbox url={productCategory.id} /> */}
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
                        onClick={() => handleEdit(productCategory)}
                        className="w-full text-sm"
                      >
                        Edit
                      </Button>
                      {/* <DropdownMenuSeparator /> */}
                      <AlertDialogbox url={productCategory.id} handleProductCategoryInvalidateQuery={handleProductCategoryInvalidateQuery} />
                    </DropdownMenuContent>
                  </DropdownMenu>
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
