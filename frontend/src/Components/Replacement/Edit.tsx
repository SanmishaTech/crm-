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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Form validation schema
const formSchema = z.object({
  date: z.string().optional(),
  customer_name: z.string().optional(),
  customer_mobile: z.string().optional(),
  customer_email: z.string().optional(),
  customer_address: z.string().optional(),
  instrument: z.string().optional(),
  instrument_number: z.string().optional(),
  invoice_number: z.string().optional(),
  invoice_date: z.string().optional(),
  received_date: z.string().optional(),
  replace: z.string().optional(),
  dispatch: z.string().optional(),
  current_status: z.string().optional(),
  registered: z.string().optional(),
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
      date: "",
      customer_name: "",
      customer_mobile: "",
      customer_email: "",
      customer_address: "",
      instrument: "",
      instrument_number: "",
      invoice_number: "",
      invoice_date: "",
      received_date: "",
      replace: "",
      dispatch: "",
      mobile_2: "",
      current_status: "",
      registered: "",
    },
  });

  // Move the usePutData hook before any conditional returns
  const fetchData = usePutData({
    endpoint: `/api/replacements/${id}`,

    params: {
      onSuccess: (data) => {
        console.log("editdata", data);
        queryClient.invalidateQueries({ queryKey: ["replacements"] });
        queryClient.invalidateQueries({ queryKey: ["replacements", id] });
        toast.success("Supplier updated successfully");
        navigate("/replacements");
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

  const {
    data: editData,
    isLoading,
    isError,
  } = useGetData({
    endpoint: `/api/replacements/${id}`,
    params: {
      queryKey: ["replacements", id],
      retry: 1,

      onSuccess: (data) => {
        console.log("GetData", data);
        setData(data?.Replaces);
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("Duplicate Customer")) {
          toast.error(
            "Replacement name is duplicated. Please use a unique name."
          );
        } else {
          toast.error("Failed to fetch supplier data. Please try again.");
        }
      },
      enabled: !!id,
    },
  });

  useEffect(() => {
    console.log("data", editData);
  }, [editData]);

  useEffect(() => {
    if (editData?.data.Replaces) {
      const newData = editData.data.Replaces;
      console.log("newData", newData);
      form.reset({
        date: newData.date || "",
        customer_name: newData.customer_name || "",
        customer_mobile: newData.customer_mobile || "",
        customer_email: newData.customer_email || "",
        customer_address: newData.customer_address || "",
        instrument: newData.instrument || "",
        instrument_number: newData.instrument_number || "",
        invoice_number: newData.invoice_number || "",
        invoice_date: newData.invoice_date || "",
        received_date: newData.received_date || "",
        replace: newData.replace || "",
        dispatch: newData.dispatch || "",
        current_status: newData.current_status || "",
        registered: newData.registered || "",
      });
    }
  }, [editData, form]);

  const onSubmit = (data: FormValues) => {
    fetchData.mutate(data);
    queryClient.invalidateQueries({ queryKey: ["replacements"] });
    queryClient.invalidateQueries({ queryKey: ["replacements", id] });
  };

  if (isLoading) {
    return (
      <div className="p-6 mx-auto">
        <div className="flex items-center justify-between w-full">
          <div className="mb-7">
            <Button
              onClick={() => navigate("/replacements")}
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
              <h2 className="text-2xl font-semibold">
                Replacements & Repairs Edit Form
              </h2>
              <p className="text-xs mb-9 text-muted-foreground">
                Edit/Update the Replacements & Repairs.
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="bg-accent/40">
              <CardHeader className="text- justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold">
                  Supplier Information
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
                  Contact Supplier
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
                  Supplier Address Information
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
            onClick={() => navigate("/replacements")}
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
              Replacements & Repairs Edit Form
            </h2>
            <p className="text-xs mb-9 text-muted-foreground">
              Update the Replacements & Repairs details.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-accent/40 border border-border">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground flex justify-between items-center">
                <span>Customer Information</span>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel className="flex-shrink-0 mt-2">
                        Date :
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Customer Name{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Customer Name"
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
                  name="customer_mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Customer Mobile
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Customer Mobile"
                          {...field}
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
                  name="customer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Customer Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Customer Email"
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
                  name="customer_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Customer Address
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Customer Address"
                          {...field}
                          className="bg-background text-foreground border-input  resize-none px-3 py-2"
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
              <CardTitle className="text-xl font-semibold text-foreground flex justify-between items-center">
                Instrument Information
                <FormField
                  control={form.control}
                  name="registered"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel className="flex-shrink-0 mt-2 text-sm ">
                        Registered :
                      </FormLabel>
                      <FormControl className="flex space-x-4">
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <Input
                              type="radio"
                              id="registered-yes"
                              {...field}
                              value="1" // Keep as string for submission
                              checked={field.value == 1} // Compare as number
                              className="h-4 w-4"
                            />
                            <label htmlFor="registered-yes">Yes</label>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Input
                              type="radio"
                              id="registered-no"
                              {...field}
                              value="0" // Keep as string for submission
                              checked={field.value == 0} // Compare as number
                              className="h-4 w-4"
                            />
                            <label htmlFor="registered-no">No</label>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="instrument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Instrument Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Instrument Name"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instrument_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Instrument Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Instrument Number"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="replace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="replace">Replace</SelectItem>
                            <SelectItem value="repair">Repair</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoice_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Invoice Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Invoice Number"
                          type="text"
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
                  name="received_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Received Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoice_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="dispatch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dispatch">Dispatch</SelectItem>
                            <SelectItem value="handover">Handover</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Current Status
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Current Status"
                          type="text"
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
              onClick={() => navigate("/replacements")}
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
