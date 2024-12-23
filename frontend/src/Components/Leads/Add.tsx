import React, { useState, useEffect } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import AddContacts from "@/Components/Leads/AddContacts";
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
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { X, Check, ChevronsUpDown } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Form Schema
const FormSchema = z.object({
  contact_id: z.string().optional(),
  lead_source: z.string().optional(),
  lead_status: z.string().optional(),
  lead_type: z.string().optional(),
  tender_number: z.string().optional(),
  bid_end_date: z.string().optional(),
  portal: z.string().optional(),
  tender_category: z.string().optional(),
  emd: z.string().optional(),
  tender_status: z.string().optional(),
  // Remove the quantity field from here
  // product_id: z.string().optional(),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // To handle loading state
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [contacts, setContacts] = useState<any[]>([]); // Initialize as an empty array
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contact_id: "",
      lead_source: "",
      lead_status: "",
      lead_type: "basic",
      tender_number: "",
      bid_end_date: "",
      portal: "",
      tender_category: "",
      emd: "",
      tender_status: "",
      quantity: "",
      product_id: "",
    },
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Use For Navigation
  const [frameworks, setFrameworks] = useState<any[]>([]); // Initialize as an empty array
  const [productRows, setProductRows] = useState<any[]>([]); // Initialize productRows as an empty array

  const addRow = () => {
    setProductRows([...productRows, { product_id: "", quantity: "" }]);
  };

  const invoices = [
    {
      invoice: "1",
      paymentStatus: "Paid",
      paymentMethod: "Credit Card",
    },
  ];

  type FormValues = z.infer<typeof FormSchema>;
  const formData = usePostData({
    endpoint: "/api/leads",
    queryKey: ["lead"],
    params: {
      onSuccess: (data) => {
        console.log("data", data);
        queryClient.invalidateQueries({ queryKey: ["lead"] });
        queryClient.invalidateQueries({ queryKey: ["leads"] });
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
  const fetchProductCategories = () => {
    axios
      .get("/api/contacts")
      .then((response) => setContacts(response.data))
      .catch((err) => console.error("Failed to fetch contacts", err));
  };

  const fetchProduct = () => {
    setLoading(true);
    axios
      .get("/api/products", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        const fetchedProducts = response.data.data.Products;
        if (Array.isArray(fetchedProducts) && fetchedProducts.length > 0) {
          setFrameworks(
            fetchedProducts.map((product) => ({
              value: product.id,
              label: product.product,
            }))
          );
        } else {
          toast.error("No products available.");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        toast.error("Failed to fetch products.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      products: productRows.filter((row) => row.product_id && row.quantity), // Only send rows with both values
    };

    formData.mutate(payload);
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
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="">
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
                          <SelectItem disabled>No Contact available</SelectItem>
                        )}
                        <div className="px-5 py-1">
                          <AddContacts
                            fetchedContacts={fetchProductCategories}
                          />
                        </div>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Select the Contact.</FormDescription>
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
          <div className="space-x-6 ">
            <FormField
              control={form.control}
              name="lead_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Lead Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="tender">Tender</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Select the lead type.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.watch("lead_type") === "tender" && (
            <div className=" space-y-6">
              <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="tender_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tender Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Tender Number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the tender number.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bid_end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bid End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>Select the tender date.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="portal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portal</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Portal Name" {...field} />
                      </FormControl>
                      <FormDescription>Enter the Portal name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="tender_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tender Category</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Tender Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="limited">Limited</SelectItem>
                            <SelectItem value="boq">BOQ</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>Select the tender type.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emd"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>EMD Status</FormLabel>
                      <FormControl>
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="emd"
                              {...field}
                              value="0"
                              checked={field.value === "0"}
                              className="h-4 w-4"
                            />
                            <label htmlFor="emd-paid">Paid</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="emd"
                              {...field}
                              value="1"
                              checked={field.value === "1"}
                              className="h-4 w-4"
                            />
                            <label htmlFor="emd-pending">Pending</label>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tender_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tender Status</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Tender Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quoted">Quoted</SelectItem>
                            <SelectItem value="toBeQuoted">
                              To be Quoted
                            </SelectItem>
                            <SelectItem value="evaluationStage">
                              Evaluation Stage
                            </SelectItem>
                            <SelectItem value="close">Close</SelectItem>
                            <SelectItem value="Awaiting">Awaiting</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>Select the tender type.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          {error && <div className="text-red-500">{error}</div>}{" "}
          <div className="flex justify-center">
            <Label>Add your Product & Quantity</Label>
          </div>
          <Button onClick={addRow} variant="outline" className="mb-4">
            Add Row
          </Button>
          <Table>
            <TableCaption>A list of your products.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Products</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between"
                        >
                          {row.product_id
                            ? frameworks.find(
                                (framework) =>
                                  framework.value === row.product_id
                              )?.label
                            : "Select products..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search products..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No products found.</CommandEmpty>
                            <CommandGroup>
                              {frameworks.map((framework) => (
                                <CommandItem
                                  key={framework.value}
                                  value={framework.value}
                                  onSelect={() => {
                                    const newRows = [...productRows];
                                    newRows[index].product_id = framework.value;
                                    setProductRows(newRows);
                                    setOpen(false);
                                  }}
                                >
                                  {framework.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      row.product_id === framework.value
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
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Enter Quantity"
                      value={row.quantity}
                      onChange={(e) => {
                        const newRows = [...productRows];
                        newRows[index].quantity = e.target.value;
                        setProductRows(newRows);
                      }}
                    />
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const newRows = productRows.filter(
                          (_, i) => i !== index
                        );
                        setProductRows(newRows);
                      }}
                    >
                      <X />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow></TableRow>
            </TableFooter>
          </Table>
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
