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
import { useQueryClient } from "@tanstack/react-query";

// Supplier type
type Clients = {
  id: string;
  client: string;
};

// Form Validation Schema
const formSchema = z.object({
  client: z.string().min(1, "Client name is required").max(50),
});

const AddClients = ({ fetchClients }) => {
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // Manage the dialog state
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: "",
    },
  });

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  type FormValues = z.infer<typeof FormSchema>;
  const storeClientData = usePostData({
    endpoint: "/api/clients",
    queryKey: ["clients"],
    params: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        form.reset();
        handleDialogClose();
        fetchClients();
      },
      // onError: (error) => {
      //   if (error.response && error.response.data.errors) {
      //     const serverErrors = error.response.data.errors;
      //     // Assuming the error is for the product_category field
      //     if (serverErrors.product_category) {
      //       form.setError("product_category", {
      //         type: "manual",
      //         message: serverErrors.product_category[0], // The error message from the server
      //       });
      //     } else {
      //       setError("Failed to add product category"); // For any other errors
      //     }
      //   } else {
      //     setError("Failed to add product category");
      //   }
      // },
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    storeClientData.mutate(data);
  };

  return (
    <>
      {/* Add(Dialog) Starts */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* <Button
            variant="outline"
            // className="text-xl p-0 bg-transparent border-none hover:bg-transparent focus:ring-0" // Custom styles for a minimal button
            onClick={handleDialogOpen}
          >
            Add Product Category
          </Button> */}
          <span
            onClick={handleDialogOpen}
            className="text-sm cursor-pointer text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            + Add Clients
          </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Clients</DialogTitle>
            <DialogDescription>
              Add your Clients details here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              // onSubmit={form.handleSubmit(onSubmit)}
              onSubmit={(e) => {
                e.stopPropagation(); // Prevent event bubbling to parent form
                form.handleSubmit(onSubmit)(e); // Only handle the category form submit
              }}
              className=""
            >
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel className="w-40">Client Name:</FormLabel>{" "}
                    <FormControl className="flex-1">
                      <Input placeholder="Client" {...field} />
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

export default AddClients;
