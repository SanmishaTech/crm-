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
  Loader2,
  X,
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
  department_name: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

// Form Validation Schema
const formSchema = z.object({
  department_name: z.string().min(1, "Department name is required").max(50),
});

export default function TableDemo() {
  const [open, setOpen] = useState(false); // Manage the dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);
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
      department_name: "",
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
  } = useFetchData("departments", null, options, params);

  const departments = departmentData?.data?.Departments || [];
  const pagination = departmentData?.data?.Pagination || null;

  const handleInvalidateQuery = () => {
    queryClient.invalidateQueries(["departments"]);
  };

  useEffect(() => {
    if (isDepartmentError) {
      // Error logging can be added here if needed in a non-console way
    }
  }, [isDepartmentError]);

  // component end

  // Open the edit dialog and populate form with department data
  const handleEdit = (department: Department) => {
    setEditDepartment(department);
    form.setValue("department_name", department.department_name); // Populate form with existing data
    handleEditDialogOpen();
  };

  const handleEditDialogOpen = () => {
    setOpen(true);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex h-full">
      <div className="p-6 w-full h-full bg-accent/60 mr-5 ml-5 rounded-lg shadow-lg  ">
        {(deleteOpen || deleteId !== null) && (
          <AlertDialogbox
            url={deleteId}
            open={deleteOpen}
            onOpenChange={(nextOpen) => {
              setDeleteOpen(nextOpen);
              if (!nextOpen) setDeleteId(null);
            }}
          />
        )}
        <div className="flex justify-center items-center p-3 space-x-2">
          <h3 className="text-lg font-semibold">Departments List</h3>
        </div>

        <div className="flex justify-between items-center py-1 space-x-2 w-full ">
          {/* Search Bar Starts */}
          <div className="flex-1 space-x-2 ">
            <div className="relative">
              <Input
                className="pr-12"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isDepartmentLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {searchTerm && (
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Search Bar Ends */}
          <div className="flex space-x-2">
            {/* Add(Dialog) Starts */}
            <DepartmentDialog
              setOpen={setOpen}
              open={open}
              editDepartment={editDepartment}
              setEditDepartment={setEditDepartment}
              setError={setError}
              form={form}
              handleInvalidateQuery={handleInvalidateQuery}
            />
            {/* Add(Dialog) Ends */}
          </div>
        </div>

        <div className="panel p-4 rounded-md bg-card">
          {/* Table Start */}
          <Table>
            <TableCaption>A list of your departments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="text-foreground"
                >
                  Departments
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
                    <TableCell>{department.department_name}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48"
                        >
                          <DropdownMenuLabel>
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={() => {
                              setTimeout(() => handleEdit(department), 0);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setTimeout(() => {
                                setDeleteId(department.id);
                                setDeleteOpen(true);
                              }, 0);
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
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
