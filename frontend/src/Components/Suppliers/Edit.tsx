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

// Form validation schema
const formSchema = z.object({
  supplier: z.string().optional(),
  street_address: z.string().optional(),
  area: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().optional(),
  gstin: z
    // 22AAAAA0000A1Z5
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/, {
      message: "Invalid GST Number. Please enter a valid GSTIN.",
    })
    .max(15, "GST Number must be exactly 15 characters")
    .min(15, "GST Number must be exactly 15 characters"),
  contact_no: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  mobile_1: z.string().optional(),
  mobile_2: z.string().optional(),
  email: z.string().optional(),
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
      supplier: "",
      street_address: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      gstin: "",
      contact_no: "",
      department: "",
      designation: "",
      mobile_1: "",
      mobile_2: "",
      email: "",
    },
  });

  // Move the usePutData hook before any conditional returns
  const fetchData = usePutData({
    endpoint: `/api/suppliers/${id}`,
    queryKey: ["editsupplier", id],

    params: {
      onSuccess: (data) => {
        console.log("editdata", data);
        queryClient.invalidateQueries({ queryKey: ["editsupplier"] });
        queryClient.invalidateQueries({ queryKey: ["editsupplier", id] });
        toast.success("Supplier updated successfully");
        navigate("/suppliers");
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate supplier")) {
          toast.error("Supplier name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to submit the form. Please try again.");
        }
      },
    },
  });

  const {
    data: editData,
    isLoading,
    isError,
  } = useGetData({
    endpoint: `/api/suppliers/${id}`,
    params: {
      queryKey: ["editsupplier", id],
      retry: 1,

      onSuccess: (data) => {
        console.log("GetData", data);
        setData(data.Supplier);
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate supplier")) {
          toast.error("Supplier name is duplicated. Please use a unique name.");
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
    if (editData?.Supplier) {
      const newData = editData.Supplier;
      form.reset({
        supplier: newData.supplier || "",
        street_address: newData.street_address || "",
        area: newData.area || "",
        city: newData.city || "",
        state: newData.state || "",
        pincode: newData.pincode || "",
        country: newData.country || "India",
        gstin: newData.gstin || "",
        contact_no: newData.contact_no || "",
        department: newData.department || "",
        designation: newData.designation || "",
        mobile_1: newData.mobile_1 || "",
        mobile_2: newData.mobile_2 || "",
        email: newData.email || "",
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
    queryClient.invalidateQueries({ queryKey: ["supplier"] });
    queryClient.invalidateQueries({ queryKey: ["supplier", id] });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-12">
      <h3 className="text-2xl font-semibold text-center">Edit Supplier</h3>
      <p className="text-center text-xs mb-9">Edit & Update supplier.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Feilds First Row */}
          <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Supplier Name"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>Enter the Supplier name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="street_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Street Address" {...field} />
                  </FormControl>
                  <FormDescription>Enter the Street Address.</FormDescription>
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
                  <FormDescription>Enter the Area.</FormDescription>
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
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      className="justify-left"
                      placeholder="Enter City"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter the City.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter State" {...field} />
                  </FormControl>
                  <FormDescription>Enter the State.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
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
                  <FormDescription>Enter the Pincode.</FormDescription>
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
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      className="justify-left"
                      placeholder="Enter Country"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter the Country.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      placeholder="Enter Gst Number"
                    />
                  </FormControl>
                  <FormDescription>
                    The GST Number must be 15 characters long and should follow
                    this format:<strong>22ABCDE0123A1Z5</strong>
                  </FormDescription>{" "}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Contact"
                      {...field}
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      value={field.value}
                      // onChange={(e) => {
                      //   const formattedValue = e.target.value
                      //     .replace(/\D/g, "") // Remove non-digit characters
                      //     .replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3"); // Format as 12-3456-7890
                      //   field.onChange(formattedValue);
                      // }}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the Contact (e.g:- 12-3456-7890).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Feilds Third Row Ends */}
          {/* Feilds Fourth Row Starts */}
          <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input
                      className="justify-left"
                      placeholder="Enter Department"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter the Department.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input
                      className="justify-left"
                      placeholder="Enter Designation"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter the Designation.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile-1</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Mobile"
                      {...field}
                      type="text"
                      inputMode="numeric"
                      pattern="\d{10}"
                      maxLength={10}
                    />
                  </FormControl>
                  <FormDescription>Enter the Mobile.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Feilds Fourth Row Ends */}
          {/* Feilds Fifth Row Starts */}
          <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="mobile_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile-2</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Mobile"
                      {...field}
                      type="text"
                      inputMode="numeric"
                      pattern="\d{10}"
                      maxLength={10}
                    />
                  </FormControl>
                  <FormDescription>Enter the Mobile.</FormDescription>
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
                  <FormDescription>Enter the Email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Feilds Fifth Row Ends */}
          {error && <div className="text-red-500">{error}</div>}{" "}
          {/* Buttons For Submit and Cancel */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                navigate("/suppliers");
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
