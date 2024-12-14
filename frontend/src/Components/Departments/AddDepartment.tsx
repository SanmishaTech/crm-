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

// Form Validation Schema
const formSchema = z.object({
  department_name: z.string().min(2, "Department name is required").max(50),
});

const AddDepartment = () => {
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // Manage the dialog state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department_name: "",
    },
  });

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    axios
      .post("/api/departments", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        form.reset();
        handleDialogClose();
        // window.location.reload();
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
  };

  return (
    <>
      {/* Add(Dialog) Starts */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            // className="text-xl p-0 bg-transparent border-none hover:bg-transparent focus:ring-0" // Custom styles for a minimal button
            onClick={handleDialogOpen}
          >
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
      {/* Add(Dialog) Ends */}
    </>
  );
};

export default AddDepartment;
