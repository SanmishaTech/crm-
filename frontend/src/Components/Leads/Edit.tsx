import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  contact_id: z.string().optional(),
  lead_status: z.string().optional(),
  lead_source: z.string().optional(),

  email: z.string().optional(),
});

// Move FormValues type definition outside the component
type FormValues = z.infer<typeof formSchema>;

export default function EditLeadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

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
    endpoint: `/api/leads/${id}`,
    queryKey: ["editlead", id],

    params: {
      onSuccess: (data) => {
        console.log("editdata", data);
        queryClient.invalidateQueries({ queryKey: ["editlead"] });
        queryClient.invalidateQueries({ queryKey: ["editlead", id] });
        toast.success("Lead updated successfully");
        navigate("/leads");
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate lead")) {
          toast.error("Lead name is duplicated. Please use a unique name.");
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
    endpoint: `/api/leads/${id}`,
    params: {
      queryKey: ["editlead", id],
      retry: 1,

      onSuccess: (data) => {
        console.log("GetData", data);
        setData(data?.Lead);
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate lead")) {
          toast.error("Lead name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to fetch lead data. Please try again.");
        }
      },
      enabled: !!id,
    },
  });

  useEffect(() => {
    console.log("data", editData);
  }, [editData]);

  useEffect(() => {
    if (editData?.data?.Lead) {
      const newData = editData?.data?.Lead;
      console.log("Lead", newData);
      form.reset({
        contact_id: newData?.Lead?.contact_id || "",
        lead_status: newData.lead_status || "",
        lead_source: newData.lead_source || "",
      });
    }
  }, [editData, form]);

  const getData = useGetData({
    endpoint: `/api/contacts`,
    params: {
      queryKey: ["contacts"],
      retry: 1,
      onSuccess: (data) => {
        console.log("GetData", data);
        setContacts(data?.data?.Contact);
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

  const onSubmit = (data: FormValues) => {
    fetchData.mutate(data);
    getData.mutate(data);
    queryClient.invalidateQueries({ queryKey: ["supplier"] });
    queryClient.invalidateQueries({ queryKey: ["supplier", id] });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-12">
      <h3 className="text-2xl font-semibold text-center">Edit Lead</h3>
      <p className="text-center text-xs mb-9">Edit & Update Lead.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Feilds First Row */}
          <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="contact_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contacts</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)} // Ensure the value is a string
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <SelectItem disabled>Loading...</SelectItem>
                        ) : (
                          contacts &&
                          contacts?.map((contact) => (
                            <SelectItem
                              key={contact.id}
                              value={String(contact.id)}
                            >
                              {contact.contact_person}{" "}
                              {/* Display the client name */}
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
            {/* <FormField
              control={form.control}
              name="contact_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>contact_id</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter contact_id Name"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>Enter the contact_id name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
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
            <FormField
              control={form.control}
              name="lead_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Source</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Lead Source" {...field} />
                  </FormControl>
                  <FormDescription>Enter the Lead Source.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}{" "}
          {/* Buttons For Submit and Cancel */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                navigate("/leads");
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
