import { useEffect, useState } from "react";
import axios from "axios";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form validation schema
const formSchema = z.object({
  contact_id: z.any().optional(),
  lead_source: z.string().optional(),
  lead_status: z.string().optional(),
});

// Move FormValues type definition outside the component
type FormValues = z.infer<typeof formSchema>;

export default function EditSupplierPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false); // To handle loading state
  const [contacts, setContacts] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact_id: "",
      lead_source: "",
      lead_status: "",
    },
  });

  // Fetch contacts
  const { data: contactsData, isLoading: isContactsLoading } = useGetData({
    endpoint: "/api/contacts",
    params: {
      queryKey: ["contacts"],
      onSuccess: (data) => {
        setContacts(data.Contact);
      },
      onError: () => {
        toast.error("Failed to fetch contacts. Please try again.");
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
        const fetchedContacts = response.data.data.Contact || [];
        setContacts(fetchedContacts);
      })
      .catch((error) => {
        console.error("Failed to fetch contacts:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Fetch lead data
  const {
    data: editData,
    isLoading,
    isError,
  } = useGetData({
    endpoint: `/api/leads/${id}`,
    params: {
      queryKey: ["editlead", id],
      retry: 1,
      onSuccess: (data) => {
        setLoading(false);
        form.reset({
          contact_id: data.Contact.id || "Empty",
          lead_source: data.Lead.lead_source || "",
          lead_status: data.Lead.lead_status || "",
        });
      },
      onError: (error) => {
        toast.error("Failed to fetch lead data. Please try again.");
      },
      enabled: !!id,
    },
  });

  const fetchData = usePutData({
    endpoint: `/api/leads/${id}`,
    queryKey: ["editlead", id],
    params: {
      onSuccess: (data) => {
        toast.success("Lead updated successfully");
        queryClient.invalidateQueries({ queryKey: ["editlead"] });
        queryClient.invalidateQueries({ queryKey: ["editlead", id] });
        navigate("/leads");
      },
      onError: (error) => {
        toast.error("Failed to submit the form. Please try again.");
      },
    },
  });

  useEffect(() => {
    console.log("editData", contactsData);
    if (editData?.Lead) {
      form.reset({
        contact_id: editData?.Lead?.contact?.id || "",
        lead_source: editData.Lead.lead_source || "",
        lead_status: editData.Lead.lead_status || "",
      });
    }
  }, [editData, form]);

  const onSubmit = (data: FormValues) => {
    fetchData.mutate(data);
    queryClient.invalidateQueries({ queryKey: ["lead"] });
    queryClient.invalidateQueries({ queryKey: ["lead", id] });
  };

  if (isLoading || isContactsLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data. Please try again.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-12">
      <h3 className="text-2xl font-semibold text-center">Edit Lead</h3>
      <p className="text-center text-xs mb-9">Edit & Update lead.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
            {/* Client Dropdown */}
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

            {/* Lead Source */}

            <FormField
              control={form.control}
              name="lead_source"
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
            {/* Lead Status */}
            <FormField
              control={form.control}
              name="lead_status"
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

          {/* Error message */}
          {error && <div className="text-red-500">{error}</div>}

          {/* Buttons */}
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
