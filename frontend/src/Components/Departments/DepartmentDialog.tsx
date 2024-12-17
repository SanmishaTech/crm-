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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { usePostData } from "@/lib/HTTP/POST";
import { usePutData } from "@/lib/HTTP/PUT";
import { useNavigate } from "react-router-dom";

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

const DepartmentDialog = ({
  loading,
  setLoading,
  open,
  form,
  setOpen,
  editDepartment,
  setError,
  setEditDepartment,
  fetchDepartments,
}) => {
  // Add Department mutation function
  type FormValues = z.infer<typeof FormSchema>;
  const storeDepartmentData = usePostData({
    endpoint: "/api/departments",
    params: {
      onSuccess: (data) => {
        console.log("department data", data);
        form.reset();
        fetchDepartments();
        handleDialogClose();
      },
      onError: (error) => {
        if (error.response && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the department_name field
          if (serverErrors.department_name) {
            form.setError("department_name", {
              type: "manual",
              message: serverErrors.department_name[0], // The error message from the server
            });
          } else {
            setError("Failed to add department"); // For any other errors
          }
        } else {
          setError("Failed to add department");
        }
      },
    },
  });

  //update department mutation function
  const updateDepartmentData = usePutData({
    endpoint: `/api/departments/${editDepartment}`,
    params: {
      onSuccess: (data) => {
        setEditDepartment(null); // Reset edit mode
        form.reset();
        fetchDepartments();
        handleDialogClose();
        setLoading(false);
      },
      onError: (error) => {
        if (error.response && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the department_name field
          if (serverErrors.department_name) {
            form.setError("department_name", {
              type: "manual",
              message: serverErrors.department_name[0], // The error message from the server
            });
          } else {
            setError("Failed to update department"); // For any other errors
          }
        } else {
          setError("Failed to update department");
        }
        setLoading(false);
      },
    },
  });

  // onSubmit function
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (editDepartment) {
      setLoading(true);
      updateDepartmentData.mutate(data);
    } else {
      storeDepartmentData.mutate(data);
    }
  };

  const handleDialogOpen = () => {
    setEditDepartment(null);
    form.setValue("department_name", ""); // Populate form with existing data
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={handleDialogOpen}>
            Add Department
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editDepartment ? "Edit" : "Add"} Departments
            </DialogTitle>
            <DialogDescription>
              {editDepartment ? "Edit" : "Add"} your department details here.
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="department_name"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel className="w-40">Department Name:</FormLabel>{" "}
                    <FormControl className="flex-1">
                      <Input placeholder="Department" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-5">
                <Button type="submit">
                  {loading ? "Loading..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepartmentDialog;
