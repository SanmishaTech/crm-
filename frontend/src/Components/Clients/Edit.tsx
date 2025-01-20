import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { toast } from "sonner";
import { useGetData } from "@/lib/HTTP/GET";
import { usePutData } from "@/lib/HTTP/PUT";
import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Form validation schema
const formSchema = z.object({
  client: z.string().min(3, "Client cannot be empty").optional(),
  street_address: z
    .string()
    .min(1, "Street address cannot be empty")
    .optional(),
  area: z.any().optional(),
  city: z.string().min(3, "City cannot be empty").optional(),
  state: z.string().min(3, "State cannot be empty").optional(),
  pincode: z.string().min(3, "Pincode cannot be empty").optional(),
  country: z.string().min(3, "Country cannot be empty").optional(),
  gstin: z.any().optional(),
  contact_no: z.string().optional(),

  email: z.string().optional(),

  shipping_street: z.string().optional(),
  shipping_area: z.string().optional(),
  shipping_city: z.string().optional(),
  shipping_state: z.string().optional(),
  shipping_pincode: z.string().optional(),
  shipping_country: z.string().optional(),
});

// Move FormValues type definition outside the component
type FormValues = z.infer<typeof formSchema>;

export default function EditClientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: "",

      contact_no: "",
      email: "",
      gstin: "",

      street_address: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      shipping_street: "",
      shipping_area: "",
      shipping_city: "",
      shipping_state: "",
      shipping_pincode: "",
      shipping_country: "India",
    },
  });

  // Move the usePutData hook before any conditional returns
  const fetchData = usePutData({
    endpoint: `/api/clients/${id}`,
    queryKey: ["editclient", id],

    params: {
      onSuccess: (data) => {
        console.log("editdata", data);
        queryClient.invalidateQueries({ queryKey: ["editclient"] });
        queryClient.invalidateQueries({ queryKey: ["editclient", id] });
        toast.success("Client updated successfully");
        navigate("/clients");
      },
      onError: (error) => {
        if (error.response && error.response.data.errors) {
          const serverStatus = error.response.data.status;
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the department_name field
          if (serverStatus === false) {
            if (serverErrors.client) {
              form.setError("client", {
                type: "manual",
                message: serverErrors.client[0], // The error message from the server
              });
              toast.error("The Client has already been taken.");
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

  const {
    data: editData,
    isLoading,
    isError,
  } = useGetData({
    endpoint: `/api/clients/${id}`,
    params: {
      queryKey: ["editclient", id],
      retry: 1,

      onSuccess: (data) => {
        console.log("data", data);
        setData(data.Client);
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate client")) {
          toast.error("Client name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to fetch client data. Please try again.");
        }
      },
      enabled: !!id,
    },
  });

  useEffect(() => {
    console.log("data", editData);
  }, [editData]);

  useEffect(() => {
    if (editData?.data?.Client) {
      const newData = editData?.data?.Client;
      form.reset({
        client: newData.client || "",
        street_address: newData.street_address || "",
        area: newData.area || "",
        city: newData.city || "",
        state: newData.state || "",
        pincode: newData.pincode || "",
        country: newData.country || "India",
        gstin: newData.gstin || "",
        contact_no: newData.contact_no || "",
        email: newData.email || "",
        shipping_street: newData.shipping_street || "",
        shipping_area: newData.shipping_area || "",
        shipping_city: newData.shipping_city || "",
        shipping_state: newData.shipping_state || "",
        shipping_pincode: newData.shipping_pincode || "",
        shipping_country: newData.shipping_country || "",
      });
    }
  }, [editData, form]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error fetching data. Please try again.</div>;
  }

  const onSubmit = (data: FormValues) => {
    fetchData.mutate(data);
    queryClient.invalidateQueries({ queryKey: ["client"] });
    queryClient.invalidateQueries({ queryKey: ["client", id] });
  };

  return (
    <div className=" mx-auto p-6 ">
      <div className="flex items-center justify-between w-full">
        <div className="mb-7">
          <Button
            onClick={() => navigate("/clients")}
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
            <h2 className="text-2xl font-semibold">Client Form</h2>
            <p className="text-xs mb-9">Update the client details.</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-accent/40 ">
            <CardHeader className="   space-y-0 pb-2">
              <CardTitle className="text-xl  font-semibold">
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Client <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Client Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Contact"
                          {...field}
                          type="text"
                          inputMode="numeric"
                          maxLength={10}
                          value={field.value}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className="justify-left"
                          placeholder="Enter Email"
                          {...field}
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
                GST Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="gstin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST IN</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        maxLength={15}
                        {...field}
                        style={{ textTransform: "uppercase" }}
                        placeholder="e.g., 22ABCDE0123A1Z5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Billing Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="street_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Street Address <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Street Address" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Area" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="justify-left"
                          placeholder="Enter City"
                          {...field}
                        />
                      </FormControl>
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
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        State <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Pincode <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Pincode"
                          {...field}
                          type="text"
                          inputMode="numeric"
                          pattern="\d{6}"
                          maxLength={6}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Country <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="justify-left"
                          placeholder="Enter Country"
                          {...field}
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
                Shipping Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="shipping_street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Street Address <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Street Address" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipping_area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Area" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipping_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="justify-left"
                          placeholder="Enter City"
                          {...field}
                        />
                      </FormControl>
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
                  name="shipping_state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        State <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipping_pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Pincode <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Pincode"
                          {...field}
                          type="text"
                          inputMode="numeric"
                          pattern="\d{6}"
                          maxLength={6}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipping_country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Country <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="justify-left"
                          placeholder="Enter Country"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          {error && <div className="text-red-500">{error}</div>}{" "}
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => navigate("/clients")}
              className="align-self-center"
              type="button"
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
