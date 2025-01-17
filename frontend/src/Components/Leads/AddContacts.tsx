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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useGetData } from "@/lib/HTTP/GET";

// Supplier type
type Contacts = {
  id: string;
  contact_person: string;
  client_id: string;
  mobile_1: string;
  email: string;
};

// Form Validation Schema
const formSchema = z.object({
  contact_person: z.string().min(1, "Contact name is required").max(50),
  client: z.string().min(1, "Client name is required").max(50),
  mobile_1: z.string().optional(),
  email: z.string().optional(),
});

const AddContacts = ({ fetchContacts }) => {
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // Manage the dialog state
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false); // To handle loading state
  const [clients, setClients] = useState<any[]>([]); // State to store fetched clients

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact_person: "",
      client: "",
      mobile_1: "",
      email: "",
    },
  });

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  type FormValues = z.infer<typeof FormSchema>;
  const storeContactData = usePostData({
    endpoint: "/api/contacts",
    queryKey: ["contacts"],
    params: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        form.reset();
        handleDialogClose();
        fetchContacts();
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

  const { data: fetchClients } = usePostData({
    endpoint: `/api/clients`,
    params: {
      queryKey: ["clients"],
      retry: 1,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        setClients(data.data.Client);
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate client")) {
          toast.error("Client name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to fetch client data. Please try again.");
        }
      },
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    storeContactData.mutate(data);
    fetchClients.mutate(data);
  };

  return (
    <>
      {/* Add(Dialog) Starts */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="h-12 bg-gray-300 text-black"
            onClick={handleDialogOpen}
          >
            Add Contacts
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle className="text-center   mb-4">
              Add Contacts
            </DialogTitle>
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
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2">
                      <FormLabel className="w-40">
                        Client Name: <span style={{ color: "red" }}>*</span>
                      </FormLabel>{" "}
                      <FormControl className="flex-1">
                        <Input placeholder="Enter Client Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_person"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2">
                      <FormLabel className="w-40">
                        Contact Name: <span style={{ color: "red" }}>*</span>
                      </FormLabel>{" "}
                      <FormControl className="flex-1">
                        <Input placeholder="Enter Contact Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number:</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Contact Number "
                          {...field}
                          type="text"
                          inputMode="numeric"
                          pattern="\d{10}"
                          maxLength={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2">
                      <FormLabel className="w-40">Email:</FormLabel>{" "}
                      <FormControl className="flex-1">
                        <Input placeholder="Enter Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

export default AddContacts;
