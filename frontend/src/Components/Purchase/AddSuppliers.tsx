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
  supplier: string;
  mobile_1: string;
  email: string;
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
  const [open, setOpen] = useState(false); // Manage the dialog state
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false); // To handle loading state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: "",
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
  const SupplierData = usePostData({
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

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    SupplierData.mutate(data);
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
            Add Supplier
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle className="text-center   mb-4">
              Add Supplier
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            {/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> */}

            <form
              onSubmit={(e) => {
                e.stopPropagation();
                form.handleSubmit(onSubmit)(e);
              }}
              className=""
            >
              <div className="space-y-5">
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
