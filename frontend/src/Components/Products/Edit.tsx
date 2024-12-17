import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { toast } from "sonner";
import { useGetData } from "@/lib/HTTP/GET";
import { usePutData } from "@/lib/HTTP/PUT";
import AddProductCategory from "../ProductCategories/AddProductCategory";

// Form validation schema
const formSchema = z.object({
  product: z
    .string()
    .min(1, { message: "Product field is required." })
    .max(50, {
      message: "Product field must have no more than 50 characters.",
    }),
  model: z.string().min(1, { message: "Model field is required." }).max(50, {
    message: "Model field must have no more than 50 characters.",
  }),
  manufacturer: z
    .string()
    .min(1, { message: "Manufacturer field is required." })
    .max(50, {
      message: "Manufacturer field must have no more than 50 characters.",
    }),
  opening_qty: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== undefined, {
      message: "Opening Quantity field is required",
    }),
  // product_category_id: z.union([z.string(), z.number()]),
  // supplier_id: z.union([z.string(), z.number()]),
  product_category_id: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== undefined, {
      message: "Product category field is required",
    }),

  supplier_id: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== undefined, {
      message: "Supplier field is required",
    }),

  closing_qty: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== undefined, {
      message: "Closing Quantity field is required",
    }),

  last_traded_price: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== undefined, {
      message: "Last traded price field is required.",
    }),
});

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // To handle loading state
  const [productCategories, setProductCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: "",
      product_category_id: "",
      supplier_id: "",
      model: "",
      manufacturer: "",
      opening_qty: "",
      closing_qty: "",
      last_traded_price: "",
    },
  });
  const { data, isLoading, isFetching, isError } = useGetData({
    endpoint: `/api/products/${id}`,
    params: {
      queryKey: ["products"],
      retry: 1,
      onError: (error) => {
        console.log("error", error);
        if (error.message && error.message.includes("duplicate supplier")) {
          toast.error("Supplier name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to submit the form. Please try again.");
        }
      },
      onSuccess: (data) => {
        console.log("data", data);
      },
    },
  });

  // const { data: ProductCategoryData, isLoading: productCategoriesLoading } =
  //   useGetData({
  //     endpoint: `/api/product_categories`,
  //     params: {
  //       queryKey: ["product_category"],
  //       retry: 1,
  //       onSuccess: (data) => {
  //         console.log(data.data.ProductCategories);
  //         setProductCategories(data.data.ProductCategories);
  //       },
  //       onError: (error) => {
  //         console.log(error);
  //       },
  //     },
  //   });

  // Fetch Product categories
  const fetchProductCategories = () => {
    axios
      .get("/api/product_categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        // setProductCategories(response.data.data.ProductCategories);
        const category = response.data.data.ProductCategories;
        setProductCategories(category);
        console.log("callled");
      })
      .catch(() => {
        setError("Failed to load Product categories");
      });
  };

  // Fetch Products
  const fetchSuppliers = () => {
    axios
      .get("/api/suppliers", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setSuppliers(response.data.data.Suppliers);
      })
      .catch(() => {
        setError("Failed to load Suppliers");
      });
  };

  useEffect(() => {
    fetchProductCategories();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    
    if (data) {
      const newData = data.data.Product;
      form.reset({
        product: newData.product || "",
        product_category_id: newData.product_category_id || "",
        supplier_id: newData.supplier_id || "",
        model: newData.model || "",
        manufacturer: newData.manufacturer || "",
        opening_qty: newData.opening_qty || "",
        closing_qty: newData.closing_qty || "",
        last_traded_price: newData.last_traded_price || "",
      });
    }
  }, [data, form]);

  type FormValues = z.infer<typeof formSchema>;
  const fetchData = usePutData({
    endpoint: `/api/products/${id}`,
    params: {
      onSuccess: (data) => {
        console.log("data", data);
        navigate("/products");
      },
      onError: (error) => {
        console.log("error", error);

        if (error.message && error.message.includes("duplicate supplier")) {
          toast.error("Supplier name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to submit the form. Please try again.");
        }
      },
    },
  });

  const onSubmit = (data: FormValues) => {
    fetchData.mutate(data);
    navigate("/products");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-12">
      <h3 className="text-2xl font-semibold text-center">Edit Product</h3>
      <p className="text-center text-xs mb-9">Edit & Update product.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Feilds First Row */}
          <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Product Name"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>Enter the Product name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Model" {...field} />
                  </FormControl>
                  <FormDescription>Enter the Model.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter manufacturer" {...field} />
                  </FormControl>
                  <FormDescription>Enter the manufacturer.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Feilds First Row Ends */}
          {/* Feilds Second Row */}
          <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="opening_qty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening Quantity</FormLabel>
                  <FormControl>
                    <Input
                      className="justify-left"
                      placeholder="Enter City"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter the Opening Quantity.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="closing_qty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Closing Quantity</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter closing quantity" {...field} />
                  </FormControl>
                  <FormDescription>Enter the Closing quantity.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_traded_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last traded Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last traded price" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the Last traded price.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Feilds Second Row Ends */}
          <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="product_category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Category</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value || "")}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Product Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <SelectItem disabled>Loading...</SelectItem>
                        ) : (
                          productCategories.map((ProductCategory) => (
                            <SelectItem
                              key={ProductCategory.id}
                              value={String(ProductCategory.id)}
                            >
                              {ProductCategory.product_category}
                            </SelectItem>
                          ))
                        )}
                        <div className="px-5 py-1">
                          <AddProductCategory />
                        </div>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Enter the Product Category.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplier_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <SelectItem disabled>Loading...</SelectItem>
                        ) : (
                          suppliers.map((supplier) => (
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
                  <FormDescription>Enter the Supplier.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Feilds Third Row Starts */}
          <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4"></div>
          {/* Feilds Fifth Row Ends */}
          {error && <div className="text-red-500">{error}</div>}{" "}
          {/* Buttons For Submit and Cancel */}
          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={() => navigate("/products")}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
