import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Form validation schema
const formSchema = z.object({
  vendor_name: z
    .string()
    .min(2, { message: "Vendor field must have at least 2 characters." })
    .max(50, {
      message: "Vendor field must have no more than 50 characters.",
    })
    .nonempty({ message: "Vendor field is required." }),
  gstin: z.string().optional(),
  contact_name: z
    .string()
    .min(2, { message: "Contact Name field must have at least 2 characters." })
    .max(50, {
      message: "Contact Name field must have no more than 50 characters.",
    })
    .nonempty({ message: "Contact Name field is required." }),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .nonempty("Email is required."),
  mobile_1: z
    .string()
    .regex(/^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s.-]{5,20}$/, {
      message: "Invalid mobile number format",
    })
    .nonempty({ message: "Mobile number field is required." }),
  mobile_2: z.any().optional(),

  street_address: z
    .string()
    .min(2, {
      message: "Street Address field must have at least 2 characters.",
    })
    .nonempty({ message: "Street Address field is required." }),
  area: z.string().optional(),
  city: z
    .string()
    .min(2, { message: "City field must have at least 2 characters." })
    .nonempty({ message: "City field is required." }),
  state: z
    .string()
    .min(2, { message: "State field must have at least 2 characters." })
    .nonempty({ message: "State field is required." }),
  pincode: z.string().optional(),
  country: z
    .string()
    .min(2, { message: "Country field must have at least 2 characters." })
    .nonempty({ message: "Country field is required." }),
});
// Move FormValues type definition outside the component
type FormValues = z.infer<typeof formSchema>;

export default function EditSupplierPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendor_name: "",
      gstin: "",
      contact_name: "",
      mobile_1: "",
      mobile_2: "",
      email: "",
      street_address: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  // Move the usePutData hook before any conditional returns
  const fetchData = usePutData({
    endpoint: `/api/vendors/${id}`,

    params: {
      onSuccess: (data) => {
        console.log("editdata", data);
        queryClient.invalidateQueries({ queryKey: ["vendors"] });
        queryClient.invalidateQueries({ queryKey: ["vendors", id] });
        toast.success("Vendor updated successfully");
        navigate("/vendors");
      },
      onError: (error) => {
        if (error.response && error.response.data.errors) {
          const serverStatus = error.response.data.status;
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the department_name field
          if (serverStatus === false) {
            if (serverErrors.supplier) {
              form.setError("vendors", {
                type: "manual",
                message: serverErrors.supplier[0], // The error message from the server
              });
              toast.error("The Vendor has already been taken.");
            }
          } else {
            setError("Failed to add Vendor"); // For any other errors
          }
        } else {
          setError("Failed to add Vendor");
        }
      },
    },
  });

  const {
    data: editData,
    isLoading,
    isError,
  } = useGetData({
    endpoint: `/api/vendors/${id}`,
    params: {
      queryKey: ["vendors", id],
      retry: 1,

      onSuccess: (data) => {
        console.log("GetData", data);
        setData(data?.Vendors);
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate vendors")) {
          toast.error("Vendors name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to fetch vendors data. Please try again.");
        }
      },
      enabled: !!id,
    },
  });

  useEffect(() => {
    console.log("data", editData);
  }, [editData]);

  useEffect(() => {
    if (editData?.data.Vendors) {
      const newData = editData.data.Vendors;
      console.log("newData", newData);
      form.reset({
        vendor_name: newData.vendor_name || "",
        gstin: newData.gstin || "",
        contact_name: newData.contact_name || "",
        mobile_1: newData.mobile_1 || "",
        mobile_2: newData.mobile_2 || "",
        email: newData.email || "",
        street_address: newData.street_address || "",
        area: newData.area || "",
        city: newData.city || "",
        state: newData.state || "",
        pincode: newData.pincode || "",
        country: newData.country || "India",
      });
    }
  }, [editData, form]);

  const onSubmit = (data: FormValues) => {
    fetchData.mutate(data);
    queryClient.invalidateQueries({ queryKey: ["vendors"] });
    queryClient.invalidateQueries({ queryKey: ["vendors", id] });
  };

  if (isLoading) {
    return (
      <div className="p-6 mx-auto">
        <div className="flex items-center justify-between w-full">
          <div className="mb-7">
            <Button
              onClick={() => navigate("/vendors")}
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
              <h2 className="text-2xl font-semibold">Vendor Edit Form</h2>
              <p className="text-xs mb-9 text-muted-foreground">
                Edit/Update the vendor.
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="bg-accent/40">
              <CardHeader className="text- justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold">
                  Vendor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-accent/40">
              <CardHeader className="text- justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold">
                  GST Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/40">
              <CardHeader className="text- justify-between space-y-0 pb-2">
                <CardTitle className=" text-xl  font-semibold">
                  Contact Vendor
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-accent/40">
              <CardHeader className="text- justify-between space-y-0 pb-2">
                <CardTitle className=" text-xl  font-semibold">
                  Vendor Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end space-x-4 mt-6">
              <Skeleton className="w-24 h-10 bg-gray-400 rounded-md" />
              <Skeleton className="w-24 h-10 bg-gray-400 rounded-md" />
            </div>
          </form>
        </Form>
      </div>
    );
  }
  if (isError) {
    return <div>Error fetching data. Please try again.</div>;
  }

  return (
    <div className="mx-auto p-6 bg-background border border-border shadow-lg rounded-lg">
      <div className="flex items-center justify-between w-full">
        <div className="mb-7">
          <Button
            onClick={() => navigate("/vendors")}
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
              Vendor Edit Form
            </h2>
            <p className="text-xs mb-9 text-muted-foreground">
              Update the vendors details.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-accent/40 border border-border">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Vendor Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="vendor_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Vendor <span className="text-destructive">*</span>
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
                        placeholder="Enter GST Number"
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
                Contact Vendors
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
                        Contact Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Contact"
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
                        Email <span className="text-destructive">*</span>
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
                        Primary Mobile Number{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Mobile"
                          {...field}
                          type="text"
                          inputMode="numeric"
                          pattern="\d{10}"
                          maxLength={10}
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
                          inputMode="numeric"
                          pattern="\d{10}"
                          maxLength={10}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/40 border border-border">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Vendors Address Information
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
                        Street Address{" "}
                        <span className="text-destructive">*</span>
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
                        City <span className="text-destructive">*</span>
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
                        State <span className="text-destructive">*</span>
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
                        Pincode <span className="text-destructive">*</span>
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
                        Country <span className="text-destructive">*</span>
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
              onClick={() => navigate("/vendors")}
              variant="outline"
              className="text-foreground hover:text-foreground/80 hover:bg-accent"
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
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
