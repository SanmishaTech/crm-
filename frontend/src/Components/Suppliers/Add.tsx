//@ts-nocheck
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
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

// Form Schema
const FormSchema = z.object({
  supplier: z
    .string()
    .min(2, { message: "Supplier field must have at least 10 characters." })
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
    // 22AAAAA0000A1Z5
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/, {
      message: "Invalid GST Number. Please enter a valid GSTIN.",
    })
    .max(15, "GST Number must be exactly 15 characters")
    .min(15, "GST Number must be exactly 15 characters"),
  contact_no: z
    .string()
    .regex(/^\+?\d{1,4}?\s?\(?\d+\)?[\s.-]?\d+[\s.-]?\d+$/, {
      message: "Invalid contact number. Please enter a valid phone number.",
    })
    .nonempty("Contact number is required."),
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

  const navigate = useNavigate(); // Use For Navigation

  // onSubmit Function
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    axios
      .post("/api/suppliers", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        form.reset();
        navigate("/suppliers");
      })
      .catch((error) => {
        console.error(error);

        // Check if the error response contains the specific message for a duplicate supplier
        if (
          error.response &&
          error.response.data &&
          error.response.data.message === "The supplier has already been taken."
        ) {
          // If the supplier name is already taken, display a custom error message
          setError("supplierName", {
            type: "manual",
            message:
              "The supplier name is already taken. Please choose another one.",
          });
        } else {
          // For any other errors, display a generic error message
          setError("Supplier Name Already Taken ", {
            type: "manual",
            message: "Failed to add supplier. Please try again.",
          });
        }
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-12">
      <h2 className="text-2xl font-semibold   text-center">
        Supplier Information
      </h2>
      <p className="text-center text-xs mb-9">
        Add a new supplier to the database.
      </p>
      {/* Form Fields */}
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
                    <Input placeholder="Enter Supplier Name" {...field} />
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
                    this format:<strong>22AAAAA0000A1Z5</strong>
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
                      maxLength={12}
                      value={field.value}
                      onChange={(e) => {
                        const formattedValue = e.target.value
                          .replace(/\D/g, "") // Remove non-digit characters
                          .replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3"); // Format as 12-3456-7890
                        field.onChange(formattedValue);
                      }}
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
          {/* Error Message */}
          {/* Buttons For Submit and Cancel */}
          <div className="flex justify-center space-x-2">
            <Button type="submit" className="align-self-center">
              Submit
            </Button>
            <Button
              onClick={() => navigate("/suppliers")}
              className="align-self-center"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
