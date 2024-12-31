import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import AddClients from "./AddClients";

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
import { z } from "zod";
import { toast } from "sonner";
import { useGetData } from "@/lib/HTTP/GET";
import { usePutData } from "@/lib/HTTP/PUT";
import { ChevronsUpDown, Check, ChevronLeft } from "lucide-react";
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

  contact_person: z
    .string()
    .min(2, {
      message: "Contact Person field must have at least 2 characters.",
    })
    .max(50, {
      message: "Contact Person field must have no more than 50 characters.",
    })
    .nonempty({ message: "Contact Person field is required." }),

  department: z
    .string()

    .min(2, { message: "Department field must have at least 2 characters." })
    .max(50, {
      message: "Department field must have no more than 50 characters.",
    })
    .nonempty({ message: "Department field is required." }),
  designation: z.string().optional(),
  mobile_1: z
    .string()
    .regex(/^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s.-]{5,20}$/, {
      message: "Invalid mobile number format",
    })
    .nonempty({ message: "Mobile number field is required." }),
  mobile_2: z.any().optional(),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .nonempty("Email is required."),
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
  const { data: fetchClients } = useGetData({
    endpoint: `/api/clients`,
    params: {
      queryKey: ["clients"],
      retry: 1,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["clients"] });
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
    },
  });

  const onSubmit = (data: FormValues) => {
    fetchData.mutate(data);
    getData.mutate();
    queryClient.invalidateQueries({ queryKey: ["client"] });
    queryClient.invalidateQueries({ queryKey: ["client", id] });
  };

  return (
    <div className=" mx-auto p-6 ">
      <div className="flex items-center justify-between w-full">
        <div className="mb-7">
          <Button
            onClick={() => navigate("/contacts")}
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
            <h2 className="text-2xl font-semibold">Contact Form</h2>
            <p className="text-xs mb-9">Edit/Update contact to the database.</p>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Feilds First Row */}
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Client <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[603px] justify-between",
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
                        <PopoverContent className="w-[603px] p-0">
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
                          <div className="px-5 py-1 ">
                            <AddClients fetchClients={fetchClients} />
                          </div>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Contact Person <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Contact Person" {...field} />
                      </FormControl>

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
                      <FormLabel>
                        Department <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Department" {...field} />
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
                        <Input placeholder="Enter Designation" {...field} />
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
                Contact Person
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="mobile_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Primary Mobile <span style={{ color: "red" }}>*</span>
                      </FormLabel>
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
                      <FormLabel>Secondary Mobile</FormLabel>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span style={{ color: "red" }}>*</span>
                      </FormLabel>
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
