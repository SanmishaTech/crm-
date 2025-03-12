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
import { toast } from "sonner";
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
import { useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import DepartmentDialog from "./DepartmentDialog";
import PaginationComponent from "./PaginationComponent";
import AddProductCategory from "../ProductCategories/AddProductCategory";
import useFetchData from "@/lib/HTTP/useFetchData";
import AlertDialogbox from "./Delete";

// Department type
type Department = {
  id: string;
  expense_head: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

// Form Validation Schema
const formSchema = z.object({
  expense_head: z.string().min(1, "Expense Head is required").max(50),
});

export default function TableDemo() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [open, setOpen] = useState(false); // Manage the dialog state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [editDepartment, setEditDepartment] = useState<Department | null>(null); // To hold department to edit
  const queryClient = useQueryClient();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expense_head: "",
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
    data: departmentData,
    isLoading: isDepartmentLoading,
    error: isDepartmentError,
    isSuccess: isDepartmentSuccess,
  } = useFetchData("expense_heads", null, options, params);

  const handleInvalidateQuery = () => {
    // Invalidate the 'departments' query to trigger a refetch
    queryClient.invalidateQueries(["expense_heads", null, params]);
  };

  useEffect(() => {
    if (isDepartmentSuccess) {
      setDepartments(departmentData.data.ExpenseHead);
      setPagination(departmentData.data.Pagination);
      setLoading(false);
    }
    if (isDepartmentError) {
      console.log("Error", isDepartmentError.message);
    }

    handleInvalidateQuery();
  }, [departmentData, params]);

  // component end

  // Open the edit dialog and populate form with department data
  const handleEdit = (department: Department) => {
    setEditDepartment(department);
    form.setValue("expense_head", department.expense_head); // Populate form with existing data
    handleEditDialogOpen();
  };

  const handleEditDialogOpen = () => {
    setOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex h-full">
      <div className="p-6 w-full h-full bg-accent/60 mr-5 ml-5 rounded-lg shadow-lg  ">
        <div className="flex justify-center items-center p-3 space-x-2">
          <h3 className="text-lg font-semibold">Expense Head List</h3>
        </div>

        <div className="flex justify-between items-center py-1 space-x-2 w-full ">
          {/* Search Bar Starts */}
          <div className="flex-1 space-x-2 ">
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Search Bar Ends */}
          <div className="flex space-x-2">
            {/* Add(Dialog) Starts */}
            <DepartmentDialog
              loading={loading}
              setLoading={setLoading}
              setOpen={setOpen}
              open={open}
              editDepartment={editDepartment}
              setEditDepartment={setEditDepartment}
              setError={setError}
              form={form}
              handleInvalidateQuery={handleInvalidateQuery}
              // fetchDepartments={fetchDepartments}
            />
            {/* Add(Dialog) Ends */}
          </div>
        </div>

        <div className="panel p-4 rounded-md bg-card">
          {/* Table Start */}
          <Table>
            <TableCaption>A list of your expense heads.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="text-foreground"
                    onClick={() => handleSort("expense_head")}
                >
                  Expense Head
                </TableHead>
                <TableHead className="text-foreground text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableFooter></TableFooter>
            <TableBody>
              {departments &&
                departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>{department.expense_head}</TableCell>
                    <TableCell className="text-right">
                      {/* <button
                      onClick={() => handleEdit(department)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <AlertDialogbox
                      handleInvalidateQuery={handleInvalidateQuery}
                      url={department.id}
                    /> */}
                      {/*  */}
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
                          <DropdownMenuLabel className="hover:cursor-default text-foreground">
                            Actions
                          </DropdownMenuLabel>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(department)}
                            className="w-full text-sm"
                          >
                            Edit
                          </Button>
                          {/* <DropdownMenuSeparator /> */}
                          <AlertDialogbox
                            handleInvalidateQuery={handleInvalidateQuery}
                            url={department.id}
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
          <PaginationComponent
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pagination={pagination}
          />
          {/* Pagination End */}
        </div>
      </div>
    </div>
  );
}
