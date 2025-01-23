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
  client: string;
};

// Form Validation Schema
const formSchema = z.object({
  contact_person: z.string().min(1, "Contact name is required").max(50),
  client: z.string().optional(),
  mobile_1: z.string().optional(),
  email: z.string().optional(),
  client_id: z.string().optional(),
});

const AddContacts = ({ fetchContacts }) => {
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // Manage the dialog state
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false); // To handle loading state
  const [suppliers, setSuppliers] = useState<any[]>([]); // State to store fetched clients
  const [isCustomClient, setIsCustomClient] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact_person: "",
      client: "",
      client_id: "",
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
  const storeSupplierData = usePostData({
    endpoint: "/api/suppliers",
    queryKey: ["suppliers"],
    params: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["suppliers"] });
        queryClient.invalidateQueries({ queryKey: ["suppliers", id] });
        form.reset();
        handleDialogClose();
        fetchContacts();
      },
    },
  });

  const { data: Suppliers } = usePostData({
    endpoint: `/api/suppliers`,
    params: {
      queryKey: ["suppliers"],
      retry: 1,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["suppliers"] });
        queryClient.invalidateQueries({ queryKey: ["suppliers", id] });

        setSuppliers(data.data.Client);
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
  const { data: fetchSuppliers } = useGetData({
    endpoint: `/api/all_suppliers`,
    params: {
      queryKey: ["suppliers"],
      retry: 1,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["suppliers"] });
        setSuppliers(data.data.Suppliers);
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate client")) {
          toast.error("Suppliers is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to fetch Suppliers data. Please try again.");
        }
      },
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    Suppliers.mutate(data);
    fetchSuppliers.mutate(data);
    storeSupplierData.mutate(data);
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
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="custom-client"
                    checked={isCustomClient}
                    onChange={() => setIsCustomClient(!isCustomClient)}
                  />
                  <label htmlFor="custom-client" className="cursor-pointer">
                    Create New Client
                  </label>
                </div>
                {isCustomClient ? (
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-2">
                        <FormLabel className="w-40">
                          Supplier Name: <span style={{ color: "red" }}>*</span>
                        </FormLabel>
                        <FormControl className="flex-1">
                          <Input placeholder="Enter Client Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="supplier_id"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-2">
                        <FormLabel className="w-40">
                          Select Supplier:
                          <span style={{ color: "red" }}>*</span>
                        </FormLabel>
                        <FormControl className="flex-1">
                          <Select
                            value={String(field.value)}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Select Supplier" />
                            </SelectTrigger>
                            <SelectContent>
                              {loading ? (
                                <SelectItem disabled>Loading...</SelectItem>
                              ) : (
                                suppliers?.map((supplier) => (
                                  <SelectItem
                                    key={supplier.id}
                                    value={String(supplier.id)}
                                  >
                                    {supplier.supplier}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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
