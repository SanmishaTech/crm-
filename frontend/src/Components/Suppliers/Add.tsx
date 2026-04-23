import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronsUpDown, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { useQueryClient } from "@tanstack/react-query";
import AddProductCategory from "../ProductCategories/AddProductCategory";

interface ProductCategory {
  id: number;
  product_category: string;
}


// Get QueryClient from the context
// Form Schema
const FormSchema = z.object({
  supplier_type: z.any().optional(),
  supplier: z
    .string()
    .min(2, { message: "Supplier field must have at least 2 characters." })
    .max(50, {
      message: "Supplier field must have no more than 50 characters.",
    })
    .nonempty({ message: "Supplier field is required." }),

  street_address: z.string().optional().or(z.literal("")),
  area: z.string().optional(),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  pincode: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  gstin: z.string().optional(),
  contact_name: z.string().optional().or(z.literal("")),

  department: z.string().optional(),
  location: z.string().optional(),
  mobile_1: z
    .string()
    .regex(/^\d{10}$/, {
      message: "Mobile number must be exactly 10 digits",
    })
    .optional()
    .or(z.literal("")),
  mobile_2: z
    .string()
    .regex(/^\d{10}$/, {
      message: "Mobile number must be exactly 10 digits",
    })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),
  alternate_email: z
    .string()
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),
  product_category_id: z.any().optional(),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      supplier: "",
      supplier_type: "",
      street_address: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      gstin: "",
      contact_name: "",
      department: "",
      location: "",
      mobile_1: "",
      mobile_2: "",
      email: "",
      alternate_email: "",
      product_category_id: "",
    },
  });
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    []
  );
  const navigate = useNavigate(); // Use For Navigation

  type FormValues = z.infer<typeof FormSchema>;
  const formData = usePostData({
    endpoint: "/api/suppliers",
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["supplier"] });
        navigate("/suppliers");
      },
      onError: (error) => {
        if (error.response && error.response.data.errors) {
          const serverStatus = error.response.data.status;
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the department_name field
          if (serverStatus === false) {
            if (serverErrors.supplier) {
              form.setError("supplier", {
                type: "manual",
                message: serverErrors.supplier[0], // The error message from the server
              });
              toast.error("The supplier has already been taken.");
            }
          } else {
            setError("Failed to add Supplier"); // For any other errors
          }
        } else {
          setError("Failed to add Supplier");
        }
      },
    },
  });

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

  useEffect(() => {
    fetchProductCategories();
  }, []);

  const onSubmit = async (data: FormValues) => {
    formData.mutate(data);
  };

  return (
    <div className="mx-auto p-6 bg-background border border-border shadow-lg rounded-lg">
      <div className="flex items-center justify-between w-full">
        <div className="mb-7">
          <Button
            onClick={() => navigate("/suppliers")}
            variant="ghost"
            className="mr-4 text-foreground hover:text-foreground/80 hover:bg-accent"
            type="button"
          >
            <ChevronLeft className="text-foreground" />
            Back
          </Button>
        </div>
        <div className="flex-1 mr-9 text-center">
          <div className="-ml-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Supplier Form
            </h2>
            <p className="text-sm text-muted-foreground mb-9">
              Add a new supplier.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-accent/40 border border-border">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Supplier Information
              </CardTitle>
              <div className="mt-2">
                <FormField
                  control={form.control}
                  name="supplier_type"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel className="flex-shrink-0 mt-2 text-sm ">
                        Supplier Type :
                      </FormLabel>
                      <FormControl className="flex space-x-4">
                        <div className="flex  space-x-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <Input
                              type="radio"
                              id="Trader"
                              {...field}
                              value="0"
                              checked={field.value === "0"}
                              className="h-4 w-4"
                            />
                            <label htmlFor="Trader">Trader</label>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Input
                              type="radio"
                              id="Manufacturer"
                              {...field}
                              value="1"
                              checked={field.value === "1"}
                              className="h-4 w-4"
                            />
                            <label htmlFor="Manufacturer">Manufacturer</label>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Supplier
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Supplier Name"
                        {...field}
                        className="bg-background text-foreground border-input"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
                <FormField
                  control={form.control}
                  name="product_category_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Product Category</FormLabel>
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
            </CardContent>
          </Card>

          <Card className="bg-accent/40 border border-border">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                GST Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="gstin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">GST IN</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        maxLength={15}
                        {...field}
                        style={{ textTransform: "uppercase" }}
                        placeholder="e.g., 22ABCDE0123A1Z5"
                        className="bg-background text-foreground border-input"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="bg-accent/40 border border-border">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Contact Supplier
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Contact Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Contact Name"
                          {...field}
                          type="text"
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background text-foreground border-input"
                          placeholder="Enter Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="mobile_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Primary Mobile Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Mobile"
                          {...field}
                          type="text"
                          maxLength={10}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Secondary Mobile Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Mobile"
                          {...field}
                          type="text"
                          maxLength={10}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Department
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background text-foreground border-input"
                          placeholder="Enter Department"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background text-foreground border-input"
                          placeholder="Enter Location"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="alternate_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Alternate Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-background text-foreground border-input"
                        placeholder="Enter Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="bg-accent/40 border border-border">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Supplier Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="street_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Street Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Street Address"
                          {...field}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Area</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Area"
                          {...field}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background text-foreground border-input"
                          placeholder="Enter City"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        State
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter State"
                          {...field}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Pincode
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Pincode"
                          {...field}
                          type="text"
                          inputMode="numeric"
                          pattern="\d{6}"
                          maxLength={6}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background text-foreground border-input"
                          placeholder="Enter Country"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {error && <div className="text-destructive">{error}</div>}

          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => navigate("/suppliers")}
              variant="outline"
              className="text-foreground hover:text-foreground/80 hover:bg-accent"
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outline"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
