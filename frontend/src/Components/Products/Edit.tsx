import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  product: z.string().nonempty("Product cannot be empty"),
  product_category_id: z.any().optional(),
  manufacturer: z.any().optional(),
  model: z.any().optional(),
  hsn_code: z.any().optional(),

  gst_rate: z.any().optional(),
  opening_qty: z.any().optional(),
  supplier_id: z.any().optional(),
  closing_qty: z.any().optional(),
  last_traded_price: z.any().optional(),
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
      gst_rate: "",
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
        gst_rate: newData.gst_rate || "",
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
        navigate("/products");
      },
      onError: (error) => {
        console.log("error", error);

        if (error.response && error.response.data.errors) {
          const serverStatus = error.response.data.status;
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the department_name field
          if (serverStatus === false) {
            if (serverErrors.product) {
              form.setError("product", {
                type: "manual",
                message: serverErrors.product[0], // The error message from the server
              });
              toast.error("The product has already been taken.");

            }
            if (serverErrors.product_category_id) {
              form.setError("product_category_id", {
                type: "manual",
                message: serverErrors.product_category_id[0], // The error message from the server
              });
            }
            if (serverErrors.supplier_id) {
              form.setError("supplier_id", {
                type: "manual",
                message: serverErrors.supplier_id[0], // The error message from the server
              });
            }
          } else {
            setError("Failed to add Product"); // For any other errors
          }
        } else {
          setError("Failed to add Product");
        }
      },
    },
  });

  const onSubmit = (data: FormValues) => {
    fetchData.mutate(data);
  };

  return (
    <div className=" mx-auto p-6  ">
      <div className="flex items-center justify-between w-full">
        <div className="mb-7">
          <Button
            onClick={() => navigate("/products")}
            variant="ghost"
            className="mr-4"
            type="button"
          >
            <ChevronLeft />
            Back
          </Button>
        </div>
        <div className="flex-1 mr-9 text-center">
          <div className="-ml-4">
            <h2 className="text-2xl font-semibold">Products Form</h2>
            <p className="text-xs mb-9">Edit/Update the product </p>
          </div>
        </div>
      </div>
      {/* Form Fields */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Feilds First Row */}
          <Card className="bg-accent/40 ">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Product Information{" "}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          {/* Feilds First Row Ends */}
          {/* Feilds Second Row */}
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Pricing & Tax Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hsn_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        HSN Code: <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="justify-left"
                          placeholder="Enter HSN Code (6 digits)"
                          {...field}
                          maxLength={8}
                          minLength={6}
                          onInput={(e) => {
                            const value = e.target.value.slice(0, 8);
                            e.target.value = value;
                          }}
                        />
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
                      <FormLabel>
                        GST Rate (%) <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          maxLength={15}
                          {...field}
                          style={{ textTransform: "uppercase" }}
                          placeholder="Enter Gst Number"
                        />
                      </FormControl>

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
                          disabled
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          {/* Feilds Second Row Ends */}
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Inventory Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
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
                          disabled
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Supplier <span style={{ color: "red" }}>*</span>
                    </FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
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
