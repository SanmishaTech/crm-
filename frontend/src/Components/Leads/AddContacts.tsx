import { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { usePostData } from "@/lib/HTTP/POST";
import { useQueryClient } from "@tanstack/react-query";
import { useGetData } from "@/lib/HTTP/GET";
import { toast } from "sonner";

// Form Validation Schema
const formSchema = z.object({
  contact_person: z.string().min(1, "Contact name is required").max(50),
  client: z.string().optional(),
  mobile_1: z
    .string()
    .regex(/^\d{10}$/, { message: "Mobile number must be exactly 10 digits" })
    .optional()
    .or(z.literal("")),
  email: z.string().optional(),
  client_id: z.string().optional(),
  street_address: z.string().optional(),
  area: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().optional(),
});

const AddContacts = ({ fetchContacts }: { fetchContacts: () => void }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [clients, setClients] = useState<any[]>([]);
  const [isCustomClient, setIsCustomClient] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact_person: "",
      client: "",
      client_id: "",
      mobile_1: "",
      email: "",
      street_address: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  const handleDialogClose = () => {
    setOpen(false);
    form.reset();
    setIsCustomClient(false);
  };

  // Standardized Query for clients dropdown
  const { isLoading: loadingClients } = useGetData({
    endpoint: `/api/all_clients`,
    params: {
      queryKey: ["clients"],
      retry: 1,
      staleTime: 0, // Ensure we get fresh data when opening the dialog
      onSuccess: (data) => {
        if (data?.data?.Client) {
          setClients(data.data.Client);
        }
      },
    },
  });

  // Mutation for creating a contact
  const storeContactData = usePostData({
    endpoint: "/api/contacts",
    params: {
      onSuccess: () => {
        toast.success("Contact added successfully");
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        fetchContacts();
        handleDialogClose();
      },
    },
  });

  // Mutation for creating a client on the fly
  const storeClientData = usePostData({
    endpoint: "/api/clients",
    params: {
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        toast.success("Client created successfully");
        
        // After client creation, proceed to create contact with the new client_id
        const newClientId = response?.data?.data?.id;
        if (newClientId) {
          const formData = form.getValues();
          storeContactData.mutate({
            ...formData,
            client_id: newClientId.toString(),
          });
        }
      },
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (isCustomClient) {
      // Create client first
      storeClientData.mutate({
        client: data.client,
        street_address: data.street_address,
        area: data.area,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: data.country,
        contact_no: data.mobile_1,
        email: data.email,
      });
    } else {
      // Create contact directly
      storeContactData.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 bg-gray-300 text-black hover:bg-gray-400 transition-colors"
        >
          Add Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center mb-2 text-primary">Add Contacts</DialogTitle>
          <DialogDescription className="text-center">
            Enter contact details below. You can also create a new client on the fly.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4 pt-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile_1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10 digit number"
                        {...field}
                        maxLength={10}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
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
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id="custom-client-leads"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={isCustomClient}
                onChange={() => setIsCustomClient(!isCustomClient)}
              />
              <label htmlFor="custom-client-leads" className="text-sm font-medium leading-none cursor-pointer">
                Create New Client
              </label>
            </div>

            {isCustomClient ? (
              <div className="space-y-3 p-3 bg-accent/30 rounded-md border border-border/50 animate-in fade-in duration-300">
                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Company Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input className="h-8" {...field} />
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
                          <Input className="h-8" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Client <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder={loadingClients ? "Loading..." : "Choose a client"} />
                        </SelectTrigger>
                        <SelectContent>
                          {clients?.map((client) => (
                            <SelectItem
                              key={client.id}
                              value={client.id.toString()}
                            >
                              {client.client}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-primary"
                disabled={storeContactData.isPending || storeClientData.isPending}
              >
                {storeContactData.isPending || storeClientData.isPending ? "Saving..." : "Save Contact"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContacts;
