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
  open,
  form,
  setOpen,
  editDepartment,
  setError,
  setEditDepartment,
  fetchDepartments,
}) => {
  // onSubmit function
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (editDepartment) {
      // Edit department
      axios
        .put(`/api/departments/${editDepartment.id}`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setEditDepartment(null); // Reset edit mode
          form.reset();
          fetchDepartments();
          //   window.location.reload();
          handleDialogClose();
        })
        .catch((error) => {
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
        });
    } else {
      axios
        .post("/api/departments", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          form.reset();
          fetchDepartments();
          handleDialogClose();
          //   window.location.reload();
        })
        .catch((error) => {
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
        });
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
            <DialogTitle>Add Departments</DialogTitle>
            <DialogDescription>
              Add your department details here. Click save when you're done.
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
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepartmentDialog;
