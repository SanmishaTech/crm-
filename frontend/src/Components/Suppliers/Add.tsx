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
  supplier: z.string().optional(),
  street_address: z.string().optional(),
  area: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().optional(),
  gstin: z.string().optional(),
  contact_no: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  mobile_1: z.string().optional(),
  mobile_2: z.string().optional(),
  email: z.string().optional(),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      supplier: "",
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
        console.error(error); // Log error details for debugging
        setError("Failed to add supplier");
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-12">
      <h2 className="text-2xl font-semibold   text-center">
        Supplier Information
      </h2>
      <p className="text-center text-sm mb-6">
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
                  <FormDescription>Enter your Supplier name.</FormDescription>
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
                  <FormDescription>Enter your Street Address.</FormDescription>
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
                  <FormDescription>Enter your Area.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                  <FormDescription>Enter your City.</FormDescription>
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
                  <FormDescription>Enter your State.</FormDescription>
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
                  <FormDescription>Enter your Pincode.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
