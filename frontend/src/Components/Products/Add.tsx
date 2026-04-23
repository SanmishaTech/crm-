import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { usePostData } from "@/lib/HTTP/POST";
import { toast } from "sonner";

import { Check, ChevronsUpDown, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || (val.length >= 6 && val.length <= 8), {
      message: "HSN Code must be between 6 and 8 digits",
    }),
  gst_rate: z
    .string()
    .nonempty("GST Rate cannot be empty")
    .regex(/^\d+$/, "GST Rate must be a number")
    .refine((val) => {
      const n = Number(val);
      return Number.isFinite(n) && n >= 0 && n <= 100;
    }, "GST Rate must be between 0 and 100"),
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

  const [open, setOpen] = useState(false);
  const [supplierOpen, setSupplierOpen] = useState(false);

  const [suppliers, setSuppliers] = useState<any[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      product: "",
      model: "",
      manufacturer: "",
      gst_rate: "",
      hsn_code: "",
      opening_qty: "",
      closing_qty: "",
      last_traded_price: "",
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
      onSuccess: () => {

        toast.success("Product added successfully");
        navigate("/products");
      },
      onError: (error: any) => {
        if (error.response?.data?.errors) {
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
            if (serverErrors.hsn_code) {
              form.setError("hsn_code", {
                type: "manual",
                message: serverErrors.hsn_code[0],
              });
            }
            if (serverErrors.gst_rate) {
              form.setError("gst_rate", {
                type: "manual",
                message: serverErrors.gst_rate[0],
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

  const onSubmit = async (data: FormValues) => {
    StoreProductData.mutate({ ...data, gst_rate: Number(data.gst_rate) });
  };

  return (
    <div className=" mx-auto p-6   ">
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Product Category <span style={{ color: "red" }}>*</span></FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? productCategories.find(
                                    (category) => String(category.id) === String(field.value)
                                  )?.product_category || "Select Product Category"
                                : "Select Product Category"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder="Search product category..." />
                            <CommandList>
                              <CommandEmpty>No category found.</CommandEmpty>
                              <CommandGroup>
                                {productCategories.map((category) => (
                                  <CommandItem
                                    key={category.id}
                                    value={category.product_category}
                                    onSelect={() => {
                                      form.setValue("product_category_id", String(category.id));
                                      setOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        String(category.id) === String(field.value)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {category.product_category}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                            <div className="border-t p-2">
                              <AddProductCategory fetchProductCategories={fetchProductCategories} />
                            </div>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
                        HSN Code:
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
                            const target = e.target as HTMLInputElement;
                            const value = target.value.slice(0, 8);
                            target.value = value;
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
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          {...field}
                          placeholder="Enter GST Rate"
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
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Supplier <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={supplierOpen}
                            className={cn(
                              "w-full justify-between font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? suppliers.find(
                                  (supplier) => String(supplier.id) === String(field.value)
                                )?.supplier || "Select Supplier"
                              : "Select Supplier"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command>
                          <CommandInput placeholder="Search supplier..." />
                          <CommandList>
                            <CommandEmpty>No supplier found.</CommandEmpty>
                            <CommandGroup>
                              {suppliers.map((supplier) => (
                                <CommandItem
                                  key={supplier.id}
                                  value={supplier.supplier}
                                  onSelect={() => {
                                    form.setValue("supplier_id", String(supplier.id));
                                    setSupplierOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      String(supplier.id) === String(field.value)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {supplier.supplier}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
