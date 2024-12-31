//@ts-nocheck
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useQueryClient } from "@tanstack/react-query";

// Get QueryClient from the context
// Form Schema
const FormSchema = z.object({
  supplier: z
    .string()
    .min(2, { message: "Supplier field must have at least 2 characters." })
    .max(50, {
      message: "Supplier field must have no more than 50 characters.",
    })
    .nonempty({ message: "Supplier field is required." }),

  street_address: z.string().optional(),
  area: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().optional(),
  gstin: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/, {
      message: "Invalid GST Number. Please enter a valid GSTIN. ",
    })
    .max(15, "GST Number must be exactly 15 characters")
    .min(15, "GST Number must be exactly 15 characters"),
  contact_no: z.any().optional(),

  department: z.string().optional(),
  designation: z.string().optional(),
  mobile_1: z.string().optional(),
  mobile_2: z.string().optional(),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .nonempty("Email is required."),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      supplier: "",
      street_address: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      gstin: "",
      contact_no: "",
      department: "",
      designation: "",
      mobile_1: "",
      mobile_2: "",
      email: "",
    },
  });
  const queryClient = useQueryClient();

  const navigate = useNavigate(); // Use For Navigation

  type FormValues = z.infer<typeof FormSchema>;
  const formData = usePostData({
    endpoint: "/api/suppliers",
    params: {
      onSuccess: (data) => {
        console.log("data", data);
        queryClient.invalidateQueries({ queryKey: ["supplier"] });
        navigate("/suppliers");
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

  const onSubmit = async (data: FormValues) => {
    formData.mutate(data);
  };

  return (
    <div className=" mx-auto p-6 bg-white shadow-lg rounded-lg  ">
      <div className="flex items-center justify-between w-full">
        <div className="mb-7">
          <Button
            onClick={() => navigate("/suppliers")}
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
            <h2 className="text-2xl font-semibold">Supplier Form</h2>
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
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Supplier Name" {...field} />
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
              <CardTitle className=" text-xl  font-semibold">
                Contact Supplier
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="mobile_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Mobile Number</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Mobile Number</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
            </CardContent>
          </Card>
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className=" text-xl font-semibold">
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
                      <FormLabel>Street Address</FormLabel>
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
                      <FormLabel>City</FormLabel>
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
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="contact_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Contact Number"
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
                /> */}
              </div>
            </CardContent>
          </Card>
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => navigate("/suppliers")}
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
