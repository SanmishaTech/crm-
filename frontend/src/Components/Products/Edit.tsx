import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
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
import useFetchData from "@/lib/HTTP/useFetchData";

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

  opening_qty: z.coerce
    .number()
    .min(1, { message: "Opening quantity field is required." }),
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

  closing_qty: z.coerce
    .number()
    .min(1, { message: "Closing quantity field is required." }),

  last_traded_price: z.coerce
    .number()
    .min(1, { message: "Last Traded Price field is required." }),
  hsn_code: z.coerce
    .number()
    .min(100000, { message: "HSN Code must be at least 6 digits." })
    .max(9999999999, { message: "HSN Code should not exceed 10 digits." }),
  product_gstin: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/, {
      message: "Invalid GST Number. Please enter a valid GSTIN.",
    })
    .max(15, "GST Number must be exactly 15 characters")
    .min(15, "GST Number must be exactly 15 characters"),
});

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // To handle loading state
  const [productCategories, setProductCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: "",
      product_gstin: "",
      hsn_code: null,
      product_category_id: "",
      supplier_id: "",
      model: "",
      manufacturer: "",
      opening_qty: null,
      closing_qty: null,
      last_traded_price: null,
    },
  });

  // Fetch Product categories
  const fetchProductCategories = () => {
    axios
      .get("/api/all_product_categories", {
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
      .get("/api/all_suppliers", {
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

  // my component start
  const options = {
    enabled: true,
    refetchOnWindowFocus: true,
    retry: 1,
  };

  const {
    data,
    isLoading: isProductLoading,
    error: isProductrror,
    isSuccess: isProductSuccess,
  } = useFetchData("products", id, options, null);

  const handleInvalidateQuery = () => {
    // Invalidate the 'departments' query to trigger a refetch
    queryClient.invalidateQueries(["product", id]);
  };

  useEffect(() => {
    if (isProductSuccess) {
      console.log("Product data");
      const newData = data.data.Product;
      form.reset({
        product: newData.product || "",
        product_gstin: newData.product_gstin || "",
        hsn_code: newData.hsn_code || "",

        supplier_id: newData.supplier_id || "",
        product_category_id: newData.product_category_id || "",
        model: newData.model || "",
        manufacturer: newData.manufacturer || "",
        opening_qty: newData.opening_qty || "",
        closing_qty: newData.closing_qty || "",
        last_traded_price: newData.last_traded_price || "",
      });
    }
    handleInvalidateQuery();
  }, [data, form]);

  // const { data, isLoading, isFetching, isError } = useGetData({
  //   endpoint: `/api/products/${id}`,
  //   params: {
  //     queryKey: ["product", id],
  //     retry: 1,
  //     onError: (error) => {
  //       console.log("error", error);
  //       if (error.message && error.message.includes("duplicate supplier")) {
  //         toast.error("Supplier name is duplicated. Please use a unique name.");
  //       } else {
  //         toast.error("Failed to submit the form. Please try again.");
  //       }
  //     },
  //     onSuccess: (data) => {
  //       console.log("data", data);
  //       // form.setValue(
  //       //   "product_category_id",
  //       //   data.data.Product.product_category_id
  //       // );
  //       // form.setValue("supplier_id", data.data.Product.supplier_id);
  //     },
  //   },
  // });

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

  // useEffect(() => {
  //   if (data) {
  //     const newData = data.data.Product;
  //     form.reset({
  //       product: newData.product || "",
  //       product_category_id: newData.product_category_id || "",
  //       supplier_id: newData.supplier_id || "",
  //       model: newData.model || "",
  //       manufacturer: newData.manufacturer || "",
  //       opening_qty: newData.opening_qty || "",
  //       closing_qty: newData.closing_qty || "",
  //       last_traded_price: newData.last_traded_price || "",
  //     });
  //   }
  // }, [data, form]);

  type FormValues = z.infer<typeof formSchema>;
  const fetchData = usePutData({
    endpoint: `/api/products/${id}`,
    params: {
      onSuccess: (data) => {
        console.log("data", data);
        navigate("/products");
        // queryClient.invalidateQueries({ queryKey: ["product", id] });
        handleInvalidateQuery();
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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-12">
      <h2 className="text-2xl font-semibold   text-center">Products Form</h2>
      <p className="text-center text-xs mb-9">
        Edit and update the product information.
      </p>
      <h2 className="text-xl font-semibold text-left">Product Information</h2>

      {/* Form Fields */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Feilds First Row */}
          <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4">
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
              name="product_category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Category</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="">
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
          </div>
          <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4">
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
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter model" {...field} />
                  </FormControl>
                  <FormDescription>Enter the model.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Feilds First Row Ends */}
          {/* Feilds Second Row */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold  text-left">
              Pricing & Tax Info
            </h2>
            <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hsn_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HSN Code:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="justify-left"
                        placeholder="Enter hsn code"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Enter the HSN Code.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="product_gstin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST IN</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        maxLength={15}
                        {...field}
                        style={{ textTransform: "uppercase" }}
                        placeholder="Enter Gst Number"
                      />
                    </FormControl>
                    <FormDescription>
                      The GST Number must be 15 characters long and should
                      follow this format:<strong>22ABCDE0123A1Z5</strong>
                    </FormDescription>{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="last_traded_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Traded Price (Rs)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Last Traded Price"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the Last Traded Price.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Feilds Second Row Ends */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold  text-left">
              Inventory Details
            </h2>
            {/* Feilds Third Row Starts */}
            <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="opening_qty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Quantity(units)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="justify-left"
                        placeholder="Enter Opening Quantity"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the Opening Quantity.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="closing_qty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Closing Quantity (units)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Closing Quantity"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the Closing Quantity.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold  text-left">
              Supplier Information
            </h2>
            <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4">
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
                        <SelectTrigger className="">
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
