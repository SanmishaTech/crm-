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
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Supplier type
type Resign = {
  id: string;
  department_name: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

const formSchema = z.object({
  resignation_date: z.string().optional(),
});

const Resign = ({ id, employee }) => {
  const today = new Date().toISOString().split("T")[0];
  const queryClient = useQueryClient();
  const [editEmployee, setEditEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false); // Manage the dialog state
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resignation_date: employee.resignation_date || today,
    },
  });

  type FormValues = z.infer<typeof FormSchema>;
  const storeResignationDate = usePostData({
    endpoint: "/api/departments",
    params: {
      onSuccess: (data) => {
        console.log("department data", data);
        form.reset();
        handleInvalidateQuery();
        // fetchDepartments();
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
  const updateResignationDate = usePutData({
    endpoint: `/api/employee_resignation/${id}`,
    params: {
      onSuccess: (data) => {
        
        queryClient.invalidateQueries("employees");
        setEditEmployee(null); // Reset edit mode
        form.reset();
        handleDialogClose();
        setLoading(false);
      },
      onError: (error) => {
        if (error.response && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the department_name field
          if (serverErrors.resignation_date) {
            form.setError("resignation_date", {
              type: "manual",
              message: serverErrors.resignation_date[0], // The error message from the server
            });
          } else {
            setError("Failed to update resignation date"); // For any other errors
          }
        } else {
          setError("Failed to update resignation date");
        }
        setLoading(false);
      },
    },
  });

  // onSubmit function
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (editEmployee) {
      setLoading(true);
      updateResignationDate.mutate(data);
    } else {
      storeResignationDate.mutate(data);
    }
  };

  const handleDialogOpen = () => {
    // setEditEmployee(null);
    // form.setValue("resignation_date", ""); // Populate form with existing data
    setOpen(true);
  };

  const handleEdit = () => {
    setEditEmployee(employee);
    form.setValue("resignation_date", employee.resignation_date || today); // Populate form with existing data
    // handleEditDialogOpen();
    handleDialogOpen();
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className=" w-full text-sm p-0 bg-transparent border-none"
            variant="outline"
            // onClick={handleDialogOpen}
            onClick={() => handleEdit(employee)}
          >
            Resign
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editEmployee ? "Edit" : "Add"} Departments
            </DialogTitle>
            <DialogDescription>
              {editEmployee ? "Edit" : "Add"} your department details here.
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              {/* <FormField
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
              /> */}
              <FormField
                control={form.control}
                name="resignation_date"
                render={({ field }) => {
                  const formattedDate = field.value
                    ? field.value.split("T")[0]
                    : "";

                  return (
                    <FormItem>
                      <FormLabel>Resignation Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={formattedDate} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  );
                }}
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

export default Resign;
