//@ts-nocheck
import React, { useState, useEffect } from "react";
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
import { usePostData } from "@/lib/HTTP/POST";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form Schema
const FormSchema = z.object({
  client_id: z.string().optional(),
  contact_person: z.string().optional(),
  // .min(2, { message: "Supplier field must have at least 2 characters." })
  // .max(50, {
  //   message: "Supplier field must have no more than 50 characters.",
  // })
  // .nonempty({ message: "Supplier field is required." }),

  department: z.string().optional(),
  designation: z.string().optional(),
  mobile_1: z.string().optional(),
  mobile_2: z.string().optional(),
  email: z.string().optional(),
  // .email("Please enter a valid email address.")
  // .nonempty("Email is required."),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = React.useState("bottom");
  const [loading, setLoading] = useState(false); // To handle loading state
  const [clients, setClients] = useState<any[]>([]); // State to store fetched clients

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      client_id: "",
      contact_person: "",
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

  type FormValues = z.infer<typeof FormSchema>;
  const formData = usePostData({
    endpoint: "/api/contacts",
    params: {
      onSuccess: (data) => {
        console.log("data", data);
        navigate("/contacts");
      },
      onError: (error) => {
        console.log("error", error);

        if (error.message && error.message.includes("duplicate contacts")) {
          toast.error("Contact name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to submit the form. Please try again.");
        }
      },
    },
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/clients", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setClients(response.data.data.Client); // Assuming response.data contains the list of clients
      })
      .catch((error) => {
        console.error("Failed to fetch clients:", error);
        // Optionally show a toast notification for error
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onSubmit = async (data: FormValues) => {
    formData.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-12">
      <h2 className="text-2xl font-semibold   text-center">
        Contact Information
      </h2>
      <p className="text-center text-xs mb-9">
        Add a new contact to the database.
      </p>
      {/* Form Fields */}

      <div></div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center">
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Client" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <SelectItem disabled>Loading...</SelectItem>
                        ) : (
                          clients.map((client) => (
                            <SelectItem
                              key={client.id}
                              value={String(client.id)}
                            >
                              {client.client}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Enter the Client.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Feilds First Row */}
          <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Contact Name" {...field} />
                  </FormControl>
                  <FormDescription>Enter the Contact.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Department" {...field} />
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
                    <Input placeholder="Enter Designation" {...field} />
                  </FormControl>
                  <FormDescription>Enter the Designation.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
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
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => navigate("/contacts")}
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
