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

// Supplier type
type ProductCategory = {
  id: string;
  product_category: string;
};

// Form Validation Schema
const formSchema = z.object({
  product_category: z
    .string()
    .min(1, "Product Category name is required")
    .max(50),
});

const AddProductCategory = () => {
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // Manage the dialog state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_category: "",
    },
  });

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  // Add Product Category mutation function
  type FormValues = z.infer<typeof FormSchema>;
  const storeProductCategoryData = usePostData({
    endpoint: "/api/product_categories",
    params: {
      onSuccess: (data) => {
        form.reset();
        handleDialogClose();
      },
      onError: (error) => {
        if (error.response && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the product_category field
          if (serverErrors.product_category) {
            form.setError("product_category", {
              type: "manual",
              message: serverErrors.product_category[0], // The error message from the server
            });
          } else {
            setError("Failed to add product category"); // For any other errors
          }
        } else {
          setError("Failed to add product category");
        }
      },
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    storeProductCategoryData.mutate(data);
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
            + Add Product Category
          </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Product Category</DialogTitle>
            <DialogDescription>
              Add your Product Category details here. Click save when you're
              done.
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
                name="product_category"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel className="w-40">
                      Product Category Name:
                    </FormLabel>{" "}
                    <FormControl className="flex-1">
                      <Input placeholder="Product Category" {...field} />
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

export default AddProductCategory;
