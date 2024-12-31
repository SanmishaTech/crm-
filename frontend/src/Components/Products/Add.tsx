//@ts-nocheck
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  product: z.string().nonempty("Product cannot be empty"),
  product_category_id: z.string().nonempty("Product Category cannot be empty"),
  manufacturer: z.any().optional(),
  model: z.any().optional(),
  hsn_code: z
    .string()
    .min(6, "HSN Code Minimum 6 digits")
    .max(8, "HSN Code Maximum 8 digits")
    .nonempty("HSN Code cannot be empty"),
  gst_rate: z.string().nonempty("GST Rate cannot be empty"),
  opening_qty: z.any().optional(),
  supplier_id: z.string().nonempty("Supplier cannot be empty"),
  closing_qty: z.any().optional(),
  last_traded_price: z.any().optional(),
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
      model: "",
      manufacturer: "",
      gst_rate: "",
      hsn_code: "",
      opening_qty: null,
      // closing_qty: null,
      last_traded_price: null,
      product_category_id: "",
      supplier_id: "",
    },
  });

  // Fetch Products
  const fetchProductCategories = () => {
    axios
      .get("/api/all_product_categories", {
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
    <div className=" mx-auto p-6 bg-white shadow-lg rounded-lg  ">
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
            <p className="text-xs mb-9">Add a new product </p>
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
                      <FormLabel>
                        Product <span style={{ color: "red" }}>*</span>
                      </FormLabel>
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
