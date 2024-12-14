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
import DepartmentDialog from "./DepartmentDialog";
import PaginationComponent from "./PaginationComponent";

// Supplier type
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
  department_name: z.string().min(2, "Department name is required").max(50),
});

export default function TableDemo() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [open, setOpen] = useState(false); // Manage the dialog state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [editDepartment, setEditDepartment] = useState<Department | null>(null); // To hold department to edit

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

  // Fetch Departments
  const fetchDepartments = () => {
    axios
      .get("/api/departments", {
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
        setDepartments(response.data.data.Departments);
        setPagination(response.data.data.Pagination);
        setLoading(false); // Stop loading
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false); // Stop loading even if there's an error
      });
  };

  useEffect(() => {
    fetchDepartments();
  }, [currentPage, itemsPerPage, searchTerm]); // Add searchTerm as a dependency

  // Sorting function
  const handleSort = (key: keyof Department) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedDepartments = [...departments].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key as keyof Department];
    const bValue = b[sortConfig.key as keyof Department];

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
  const handleDelete = (departmentId: string) => {
    axios
      .delete(`/api/departments/${departmentId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        setDepartments(
          departments.filter((department) => department.id !== departmentId)
        );
        fetchDepartments();
        // window.location.reload();
      })
      .catch(() => {
        setError("Failed to delete department");
      });
  };

  // Open the edit dialog and populate form with department data
  const handleEdit = (department: Department) => {
    setEditDepartment(department);
    form.setValue("department_name", department.department_name); // Populate form with existing data
    handleEditDialogOpen();
  };

  const handleEditDialogOpen = () => {
    setOpen(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center p-2 space-x-2">
        <h3 className="text-lg font-semibold">Departments List</h3>
      </div>
      <div className="flex justify-between items-center space-x-2 w-full">
        {/* Search Bar Starts */}
        <div className="flex-1 space-x-2">
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
            setOpen={setOpen}
            open={open}
            editDepartment={editDepartment}
            setEditDepartment={setEditDepartment}
            setError={setError}
            form={form}
            fetchDepartments={fetchDepartments}
          />
          {/* Add(Dialog) Ends */}
          {/* Add(Page) Starts */}
          <Button variant="outline" onClick={() => navigate("/suppliers/add")}>
            Add (Page)
          </Button>
          {/* Add(Page) Ends */}
        </div>
      </div>

      <div className="panel p-4 rounded-md bg-gray-50">
        {/* Table Start */}
        <Table>
          <TableCaption>A list of your recent departments.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("department")}>
                Departments
              </TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableFooter></TableFooter>
          <TableBody>
            {sortedDepartments.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.department_name}</TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => handleDelete(department.id)}
                    className="text-red-500 hover:text-red-700 pr-1"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(department)}
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
          pagination={pagination}        />
        {/* Pagination End */}
      </div>
    </div>
  );
}
