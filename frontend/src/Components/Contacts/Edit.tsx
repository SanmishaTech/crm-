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
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Form validation schema
const formSchema = z.object({
  client_id: z.any().optional(),
  contact_person: z.string().optional(),
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
  const [loading, setLoading] = useState(false); // To handle loading state
  const [clients, setClients] = useState<any[]>([]); // State to store fetched clients

  const [data, setData] = useState<any>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      contact_person: "",
      department: "",
      designation: "",

      mobile_1: "",
      mobile_2: "",
      email: "",
    },
  });

  // Move the usePutData hook before any conditional returns
  const fetchData = usePutData({
    endpoint: `/api/contacts/${id}`,
    queryKey: ["editsupplier", id],

    params: {
      onSuccess: (data) => {
        console.log("editdata", data);
        queryClient.invalidateQueries({ queryKey: ["editsupplier"] });
        queryClient.invalidateQueries({ queryKey: ["editsupplier", id] });
        toast.success("Supplier updated successfully");
        navigate("/contacts");
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
    endpoint: `/api/contacts/${id}`,
    params: {
      queryKey: ["editsupplier", id],
      retry: 1,

      onSuccess: (data) => {
        console.log("data", data);
        setData(data.Contact);
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
    if (editData?.data?.Contact) {
      const newData = editData?.data?.Contact;
      form.reset({
        client_id: newData.client_id || "",
        contact_person: newData.contact_person || "",
        department: newData.department || "",
        designation: newData.designation || "",
        mobile_1: newData.mobile_1 || "",
        mobile_2: newData.mobile_2 || "",
        email: newData.email || "",
      });
    }
  }, [editData, form]);

  const getData = useGetData({
    endpoint: `/api/clients`,
    params: {
      queryKey: ["clients"],
      retry: 1,
      onSuccess: (data) => {
        setClients(data.data.Client);
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
    getData.mutate();
    queryClient.invalidateQueries({ queryKey: ["client"] });
    queryClient.invalidateQueries({ queryKey: ["client", id] });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-12">
      <h3 className="text-2xl font-semibold text-center">Edit Contact</h3>
      <p className="text-center text-xs mb-9">Edit & Update Contact.</p>
      <h2 className="text-xl font-semibold text-left">Contact Information</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Feilds First Row */}
          <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Client</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? clients?.find(
                                (client) => client.id === field.value
                              )?.client
                            : "Select client"}

                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search contact..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No contact found.</CommandEmpty>
                          <CommandGroup>
                            {clients?.map((client) => (
                              <CommandItem
                                value={client.id}
                                key={client.id}
                                onSelect={() => {
                                  form.setValue("client_id", client.id);
                                }}
                              >
                                {client.client}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    client.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the contact you want to associate.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Contact Person" {...field} />
                  </FormControl>
                  <FormDescription>Enter the Contact Person.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4">
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
                    Enter the Mobile (e.g:- 12-3456-7890).
                  </FormDescription>
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
                    Enter the Mobile (e.g:- 12-3456-7890).
                  </FormDescription>
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
          {error && <div className="text-red-500">{error}</div>}{" "}
          {/* Buttons For Submit and Cancel */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                navigate("/contacts");
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
