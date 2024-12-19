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
import { usePutData } from "@/lib/HTTP/PUT";
import { useQueryClient } from "@tanstack/react-query";
// Supplier type
type ProductCategory = {
  id: string;
  product_category: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

const ProductCategoryDialog = ({
  open,
  form,
  setOpen,
  editProductCategory,
  setError,
  setEditProductCategory,
  loading,
  setLoading,
}) => {
  // Add Product Category mutation function
  const queryClient = useQueryClient();
  type FormValues = z.infer<typeof FormSchema>;
  const storeProductCategoryData = usePostData({
    endpoint: "/api/product_categories",
    params: {
      onSuccess: (data) => {
        form.reset();
        queryClient.invalidateQueries("product_categories");
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

  //update product category mutation function
  const updateProductCategoryData = usePutData({
    endpoint: `/api/product_categories/${editProductCategory?.id}`,
    params: {
      onSuccess: (data) => {
        setEditProductCategory(null); // Reset edit mode
        form.reset();
        queryClient.invalidateQueries("product_categories");
        handleDialogClose();
        setLoading(false);
      },
      onError: (error) => {
        if (error.response && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the product category field
          if (serverErrors.product_category) {
            form.setError("product_category", {
              type: "manual",
              message: serverErrors.product_category[0], // The error message from the server
            });
          } else {
            setError("Failed to update product category"); // For any other errors
          }
        } else {
          setError("Failed to update product category");
        }
        setLoading(false);
      },
    },
  });

  // onSubmit function
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (editProductCategory) {
      setLoading(true);
      updateProductCategoryData.mutate(data);
    } else {
      storeProductCategoryData.mutate(data);
    }
  };

  const handleDialogOpen = () => {
    setEditProductCategory(null);
    form.setValue("product_category", ""); // Populate form with existing data
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
            Add Product Category
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editProductCategory ? "Edit" : "Add"} Product Category
            </DialogTitle>
            <DialogDescription>
              {editProductCategory ? "Edit" : "Add"} your Product Category
              details here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
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

export default ProductCategoryDialog;
