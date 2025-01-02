import React, { useState, useEffect } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import AddContacts from "./AddContacts";

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
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { usePostData } from "@/lib/HTTP/POST";
import { toast } from "sonner";
import { useGetData } from "@/lib/HTTP/GET";
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
  // emd: z.string().optional(),
  emd: z.coerce.number().optional(),
  tender_status: z.string().optional(),
  // Remove the quantity field from here
  // product_id: z.string().optional(),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState("");
  const [contacts, setContacts] = useState<any[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contact_id: "",
      lead_source: "",
      lead_status: "open",
      lead_type: "basic",
      tender_number: "",
      bid_end_date: "",
      portal: "",
      tender_category: "",
      emd: "",
      tender_status: "",
      quantity: "",
      rate: "",
      product_id: "",
    },
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Use For Navigation
  const [frameworks, setFrameworks] = useState<any[]>([]); // Initialize as an empty array
  const [productRows, setProductRows] = useState<any[]>([]);

  const addRow = () => {
    setProductRows([
      ...productRows,
      { product_id: "", quantity: "", rate: "", isOpen: false },
    ]);
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

  // useEffect(() => {
  //   setLoading(true);
  //   axios
  //     .get("/api/contacts", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + localStorage.getItem("token"),
  //       },
  //       queryKey: ["contacts"],
  //     })
  //     .then((response) => {
  //       queryClient.invalidateQueries({ queryKey: ["contacts"] });
  //       // Ensure the response is an array of clients
  //       const fetchedContacts = response.data.data.Contact || []; // Fallback to empty array if no clients
  //       setContacts(fetchedContacts);
  //     })
  //     .catch((error) => {
  //       console.error("Failed to fetch contacts:", error);
  //       // Optionally show a toast notification for error
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);
  // const fetchProductCategories = () => {
  //   axios
  //     .get("/api/contacts")
  //     .then((response) => setContacts(response.data))
  //     .catch((err) => console.error("Failed to fetch contacts", err));
  // };

  const { data: FetchContacts } = useGetData({
    endpoint: `/api/all_contacts`,
    params: {
      queryKey: ["contacts"],
      retry: 1,
      onSuccess: (data) => {
        console.log("data", data);
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        setContacts(data.data.Contacts);
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate contacts")) {
          toast.error("Contact name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to fetch contacts.");
        }
      },
    },
  });

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
      products: productRows.filter(
        (row) => row.product_id && row.quantity && row.rate
      ), // Only send rows with all values
    };

    formData.mutate(payload);
  };

  return (
    <div className=" mx-auto p-6 ">
      <div className="flex items-center justify-between w-full">
        <div className="mb-7">
          <Button
            onClick={() => navigate("/leads")}
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
            <h2 className="text-2xl font-semibold">Lead Form</h2>
            <p className="text-xs mb-9">Add a new lead to the database.</p>
          </div>
        </div>
      </div>
      {/* Form Fields */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Lead Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="contact_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Contact</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[350px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? contacts.find(
                                    (contact) => contact.id === field.value
                                  )?.contact_person || "No Contact Person"
                                : "Select Contact"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] max-h-[260px] overflow-y-auto p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search contact..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No contact found.</CommandEmpty>
                              <CommandGroup>
                                {loading ? (
                                  <CommandItem disabled>Loading...</CommandItem>
                                ) : (contacts || []).length > 0 ? (
                                  contacts.map((contact) => {
                                    const contactPerson =
                                      contact.contact_person ||
                                      "No Contact Person";

                                    return (
                                      <CommandItem
                                        key={contact.id}
                                        value={contact.id}
                                        onSelect={() => {
                                          form.setValue(
                                            "contact_id",
                                            contact.id
                                          );
                                        }}
                                      >
                                        {contactPerson}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            contact.id === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    );
                                  })
                                ) : (
                                  <CommandItem disabled>
                                    No Contact available
                                  </CommandItem>
                                )}
                              </CommandGroup>
                            </CommandList>
                            <AddContacts FetchContacts={FetchContacts} />
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select the contact to associate with this item.
                      </FormDescription>
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
                        <Input
                          placeholder="Enter Lead Source Name"
                          {...field}
                        />
                      </FormControl>
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
                        <Input
                          placeholder="Enter Lead Status"
                          {...field}
                          defaultValue="open"
                          disabled
                        />
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
              <CardTitle className="text-xl font-semibold">Lead Type</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
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
                            <Input
                              placeholder="Enter Tender Number"
                              {...field}
                            />
                          </FormControl>

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
                                <SelectItem value="Awaiting">
                                  Awaiting
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              {error && <div className="text-red-500">{error}</div>}{" "}
            </CardContent>
          </Card>
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">Products</CardTitle>
              <CardDescription>Add your Products & Quantity</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Table Start */}
              <Table>
                <TableCaption>A list of your products.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Products</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Popover
                          open={row.isOpen}
                          onOpenChange={(isOpen) => {
                            const newRows = [...productRows];
                            newRows[index].isOpen = isOpen;
                            setProductRows(newRows); // Update the productRows state
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={row.isOpen}
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
                                        newRows[index].product_id =
                                          framework.value;
                                        newRows[index].isOpen = false; // Close the popover after selection
                                        setProductRows(newRows); // Update the state
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
                          name="quantity"
                          value={row.quantity}
                          onChange={(e) => {
                            const newRows = [...productRows];
                            newRows[index].quantity = e.target.value;
                            setProductRows(newRows); // Update the state with the new quantity
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Rate"
                          name="rate"
                          value={row.rate}
                          onChange={(e) => {
                            const newRows = [...productRows];
                            newRows[index].rate = e.target.value;
                            setProductRows(newRows); // Update the state with the new quantity
                          }}
                        />
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            // Filter out the row at the given index and update the state
                            const newRows = productRows.filter(
                              (_, i) => i !== index
                            );
                            setProductRows(newRows); // Update the state with the new rows
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
              <Button
                type="button"
                onClick={addRow}
                variant="outline"
                className="mb-4"
              >
                Add Row
              </Button>
            </CardContent>
          </Card>

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
