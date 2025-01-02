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
import { usePostData } from "@/lib/HTTP/POST";

// Department type
type Resign = {
  id: string;
  resignation_date: string;
};

// Form Validation Schema
const formSchema = z.object({
  resignation_date: z.string().min(1, "Resignation Date is required"),
});

const Resign = ({ id }) => {
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // Manage the dialog state
  const today = new Date().toISOString().split("T")[0];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resignation_date: today,
    },
  });

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  // Add Department mutation function
  type FormValues = z.infer<typeof FormSchema>;
  const storeResignationDate = usePostData({
    endpoint: `/api/employee_resignation/${id}`,
    params: {
      onSuccess: (data) => {
        form.reset();
        handleDialogClose();
      },
      onError: (error) => {
        if (error.response && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the department_name field
          if (serverErrors.department_name) {
            form.setError("resignation_date", {
              type: "manual",
              message: serverErrors.resignation_date[0], // The error message from the server
            });
          } else {
            setError("Failed to add date"); // For any other errors
          }
        } else {
          setError("Failed to add date");
        }
      },
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    storeResignationDate.mutate(data);
    // axios
    //   .post("/api/departments", data, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + localStorage.getItem("token"),
    //     },
    //   })
    //   .then((response) => {
    //     form.reset();
    //     handleDialogClose();
    //     // window.location.reload();
    //   })
    //   .catch((error) => {
    //     if (error.response && error.response.data.errors) {
    //       const serverErrors = error.response.data.errors;
    //       // Assuming the error is for the department_name field
    //       if (serverErrors.department_name) {
    //         form.setError("department_name", {
    //           type: "manual",
    //           message: serverErrors.department_name[0], // The error message from the server
    //         });
    //       } else {
    //         setError("Failed to update department"); // For any other errors
    //       }
    //     } else {
    //       setError("Failed to update department");
    //     }
    //   });
  };

  return (
    <>
      {/* Add(Dialog) Starts */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className=" w-full text-sm p-0 bg-transparent border-none" // Custom styles for a minimal button
            onClick={handleDialogOpen}
          >
            Resign
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Resignation Date</DialogTitle>
            {/* <DialogDescription>
              Add your department details here. Click save when you're done.
            </DialogDescription> */}
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

export default Resign;
