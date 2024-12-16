//@ts-nocheck
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { usePostData } from "@/lib/HTTP/POST";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddProductCategory from "../ProductCategories/AddProductCategory";

type ProductCategory = {
  id: string;
  product_category: string;
};

// Form Schema
const FormSchema = z.object({
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
    .string()
    .min(1, { message: "Opening quantity field is required." })
    .max(50, {
      message: "Opening quantity field must have no more than 50 characters.",
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
    .string()
    .min(1, { message: "Closing quantity field is required." })
    .max(50, {
      message: "Closing quantity field must have no more than 50 characters.",
    }),
  // last_traded_price: z
  //   .number()
  //   .min(1, { message: "Last traded price field is required." })
  //   .max(50, {
  //     message: "Last traded price field must have no more than 50 characters.",
  //   }),
  last_traded_price: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== undefined, {
      message: "Last traded price field is required.",
    }),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    []
  );
  const [loading, setLoading] = useState(false); // To handle loading state

  const [suppliers, setSuppliers] = useState([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
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

  // Fetch Products
  const fetchProductCategories = () => {
    axios
      .get("/api/product_categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setProductCategories(response.data.data.ProductCategories);
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

  const navigate = useNavigate(); // Use For Navigation

  type FormValues = z.infer<typeof FormSchema>;
  const StoreProductData = usePostData({
    endpoint: "/api/products",
    params: {
      onSuccess: (data) => {
        console.log("data", data);
        navigate("/products");
      },
      onError: (error) => {
        if (error.response && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the department_name field
          if (serverErrors.product) {
            form.setError("product", {
              type: "manual",
              message: serverErrors.product[0], // The error message from the server
            });
          } else {
            setError("Failed to add product"); // For any other errors
          }
        } else {
          setError("Failed to add product");
        }
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    StoreProductData.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-12">
      <h2 className="text-2xl font-semibold   text-center">
        Products Information
      </h2>
      <p className="text-center text-xs mb-9">
        Add a new product to the database.
      </p>
      {/* Form Fields */}
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
                    <Input placeholder="Enter Product Name" {...field} />
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
                  <FormLabel>model</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter model" {...field} />
                  </FormControl>
                  <FormDescription>Enter the model.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
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
                      placeholder="Enter Opening Quantity"
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
                    <Input placeholder="Enter Closing Quantity" {...field} />
                  </FormControl>
                  <FormDescription>Enter the Closing Quantity.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_traded_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Traded Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Last Traded Price" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the Last Traded Price.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Feilds Second Row Ends */}
          {/* Feilds Third Row Starts */}
          <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="product_category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Category</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)}
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
                          <AddProductCategory
                            fetchProductCategories={fetchProductCategories}
                          />
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
          {/* Feilds Fifth Row Ends */}
          {error && <div className="text-red-500">{error}</div>}{" "}
          {/* Error Message */}
          {/* Buttons For Submit and Cancel */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={() => navigate("/products")}
              className="align-self-center"
            >
              Cancel
            </Button>
            <Button type="submit" className="align-self-center hover:pointer">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
