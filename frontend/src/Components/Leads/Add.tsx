import { useState, useEffect } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form Schema
const FormSchema = z.object({
  contact_id: z.string().optional(),
  lead_source: z.string().optional(),
  lead_status: z.string().optional(),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // To handle loading state
  const [contacts, setContacts] = useState<any[]>([]); // Initialize as an empty array
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contact_id: "",
      lead_source: "",
      lead_status: "",
    },
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Use For Navigation

  type FormValues = z.infer<typeof FormSchema>;
  const formData = usePostData({
    endpoint: "/api/leads",
    params: {
      onSuccess: (data) => {
        console.log("data", data);
        queryClient.invalidateQueries({ queryKey: ["lead"] });
        navigate("/leads");
      },
      onError: (error) => {
        console.log("error", error);

        if (error.message && error.message.includes("duplicate lead")) {
          toast.error("Lead name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to submit the form. Please try again.");
        }
      },
    },
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/contacts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        // Ensure the response is an array of clients
        const fetchedContacts = response.data.data.Contact || []; // Fallback to empty array if no clients
        setContacts(fetchedContacts);
      })
      .catch((error) => {
        console.error("Failed to fetch contacts:", error);
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
      <h2 className="text-2xl font-semibold text-center">Lead Information</h2>
      <p className="text-center text-xs mb-9">
        Add a new lead to the database.
      </p>
      {/* Form Fields */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="contact_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <SelectItem disabled>Loading...</SelectItem>
                        ) : (contacts || []).length > 0 ? (
                          contacts.map((contact) => {
                            const contactPerson =
                              contact.contact_person || "No Contact Person";

                            return (
                              <SelectItem
                                key={contact.id}
                                value={String(contact.id)}
                              >
                                {` ${contactPerson}`}
                              </SelectItem>
                            );
                          })
                        ) : (
                          <SelectItem disabled>No clients available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Enter the Client.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="lead_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Source</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Lead Source Name" {...field} />
                  </FormControl>
                  <FormDescription>Enter the Lead Source name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lead_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Status</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Lead Status" {...field} />
                  </FormControl>
                  <FormDescription>Enter the Lead Status.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}{" "}
          {/* Error Message */}
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => navigate("/leads")}
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
