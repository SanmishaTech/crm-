import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { usePostData } from "@/lib/HTTP/POST";
import { useQueryClient } from "@tanstack/react-query";
import { useGetData } from "@/lib/HTTP/GET";
import { toast } from "sonner";

// Form Validation Schema
const formSchema = z.object({
  product: z.string().min(1, "Product name is required"),
  product_category_id: z.string().min(1, "Product category is required"),
  gst_rate: z.string().min(1, "GST rate is required"),
  hsn_code: z.string().optional().refine(val => !val || (val.length >= 6 && val.length <= 8), {
    message: "HSN Code must be between 6 and 8 digits"
  }).or(z.literal("")),
  supplier_id: z.string().optional(),
  supplier_name: z.string().optional(),
  isCustomSupplier: z.boolean().default(false),
});

const AddProduct = ({ onProductAdded }: { onProductAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [productCategories, setProductCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: "",
      product_category_id: "",
      gst_rate: "",
      hsn_code: "",
      supplier_id: "",
      supplier_name: "",
      isCustomSupplier: false,
    },
  });

  const isCustomSupplier = form.watch("isCustomSupplier");

  const handleDialogClose = () => {
    setOpen(false);
    form.reset();
  };

  // Fetch product categories
  const { isLoading: loadingCategories } = useGetData({
    endpoint: `/api/all_product_categories`,
    params: {
      queryKey: ["product_categories"],
      onSuccess: (data) => {
        if (data?.data?.ProductCategories) {
          setProductCategories(data.data.ProductCategories);
        }
      },
    },
  });

  // Fetch suppliers
  const { isLoading: loadingSuppliers } = useGetData({
    endpoint: `/api/all_suppliers`,
    params: {
      queryKey: ["suppliers"],
      onSuccess: (data) => {
        if (data?.data?.Suppliers) {
          setSuppliers(data.data.Suppliers);
        }
      },
    },
  });

  // Mutation for creating a product
  const storeProductData = usePostData({
    endpoint: "/api/products",
    params: {
      onSuccess: () => {
        toast.success("Product added successfully");
        queryClient.invalidateQueries({ queryKey: ["products"] });
        onProductAdded();
        handleDialogClose();
      },
      onError: (error: any) => {
        if (error.response?.data?.errors?.product) {
          form.setError("product", {
            type: "manual",
            message: error.response.data.errors.product[0],
          });
        } else {
          toast.error("Failed to add product");
        }
      },
    },
  });

  // Mutation for creating a supplier on the fly
  const storeSupplierData = usePostData({
    endpoint: "/api/suppliers",
    params: {
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({ queryKey: ["suppliers"] });
        const newSupplierId = response?.data?.data?.Suppliers?.id;
        if (newSupplierId) {
          const currentValues = form.getValues();
          storeProductData.mutate({
            product: currentValues.product,
            product_category_id: currentValues.product_category_id,
            gst_rate: currentValues.gst_rate,
            hsn_code: currentValues.hsn_code,
            supplier_id: newSupplierId.toString(),
          });
        }
      },
      onError: (error: any) => {
        if (error.response?.data?.errors?.supplier) {
          form.setError("supplier_name", {
            type: "manual",
            message: error.response.data.errors.supplier[0],
          });
        } else {
          toast.error("Failed to create supplier");
        }
      },
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (data.isCustomSupplier) {
      if (!data.supplier_name) {
        form.setError("supplier_name", {
          type: "manual",
          message: "Supplier name is required",
        });
        return;
      }
      storeSupplierData.mutate({
        supplier: data.supplier_name,
        product_category_id: data.product_category_id,
      });
    } else {
      if (!data.supplier_id) {
        form.setError("supplier_id", {
          type: "manual",
          message: "Supplier selection is required",
        });
        return;
      }
      storeProductData.mutate({
        product: data.product,
        product_category_id: data.product_category_id,
        gst_rate: data.gst_rate,
        hsn_code: data.hsn_code,
        supplier_id: data.supplier_id,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full text-left justify-start h-10 bg-gray-300 text-black hover:bg-gray-400 transition-colors"
        >
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] max-h-[95vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-center mb-2 text-primary">Add Product</DialogTitle>
          <DialogDescription className="text-center">
            Enter product details. You can also create a new supplier on the fly.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="product_category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder={loadingCategories ? "Loading..." : "Select Category"} />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.product_category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gst_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Rate (%) <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter GST Rate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hsn_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HSN Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter HSN Code" minLength={6} maxLength={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isCustomSupplier && (
                <FormField
                  control={form.control}
                  name="supplier_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Supplier <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder={loadingSuppliers ? "Loading..." : "Select Supplier"} />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map((sup) => (
                              <SelectItem key={sup.id} value={sup.id.toString()}>
                                {sup.supplier}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id="create-new-supplier"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                {...form.register("isCustomSupplier")}
              />
              <label htmlFor="create-new-supplier" className="text-sm font-medium leading-none cursor-pointer">
                Create New Supplier
              </label>
            </div>

            {isCustomSupplier && (
              <FormField
                control={form.control}
                name="supplier_name"
                render={({ field }) => (
                  <FormItem className="animate-in fade-in duration-300">
                    <FormLabel>Supplier Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Supplier Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full bg-primary text-white"
                disabled={storeProductData.isPending || storeSupplierData.isPending}
              >
                {storeProductData.isPending || storeSupplierData.isPending ? "Saving..." : "Save Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;
