import React, { useState, useEffect } from "react";

import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { X, Check, ChevronsUpDown, ChevronLeft } from "lucide-react";
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
  contact_id: z.any().optional(),
  assigned_to: z.any().optional(),
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
  quantity: z.string().optional(),
  rate: z.string().optional(),
  product_id: z.string().optional(),
  payment_received_remark: z.string().optional(),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [contacts, setContacts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [leadSources, setLeadSources] = useState<any[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contact_id: "",
      assigned_to: "",
      lead_source: "",
      lead_status: "",

      lead_type: "basic",
      tender_number: "",
      bid_end_date: "",
      portal: "",
      tender_category: "",
      emd: 0,
      tender_status: "",
      quantity: "",
      rate: "",
      product_id: "",
      payment_received_remark: "",
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


  type FormValues = z.infer<typeof FormSchema>;
  const formData = usePostData({
    endpoint: "/api/leads",
    params: {
      retry: 1,
      onSuccess: (data: any) => {
        console.log("data", data);
        queryClient.invalidateQueries({ queryKey: ["lead"] });
        queryClient.invalidateQueries({ queryKey: ["lead"] });
        navigate("/leads");
      },
      onError: (error) => {
        console.log("error", error);

        if ((error as any).response && (error as any).response.data.errors) {
          const serverStatus = (error as any).response.data.status;
          const serverErrors = (error as any).response.data.errors;
          // Assuming the error is for the department_name field
          if (serverStatus === false) {
            if (serverErrors.contact_id) {
              form.setError("contact_id", {
                type: "manual",
                message: serverErrors.contact_id[0], // The error message from the server
              });
            }
            if (serverErrors.error) {
              // setError(serverErrors.error[0]);
              toast.error(serverErrors.error[0]);
            }
          } else {
            setError("Failed to add lead"); // For any other errors
          }
        } else {
          setError("Failed to add lead");
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


  const [leadStatuses, setLeadStatuses] = useState<any[]>([]);

  useGetData({
    endpoint: `/api/all_lead_sources`,
    params: {
      queryKey: ["lead_sources_all"],
      onSuccess: (data) => {
        setLeadSources(data.data.LeadSources);
      },
    },
  });

  useGetData({
    endpoint: `/api/lead_status`,
    params: {
      queryKey: ["lead_status"],
      onSuccess: (data) => {
        setLeadStatuses(Object.values(data.data.LeadStatus));
      },
    },
  });


  useGetData({
    endpoint: `/api/all_employees`,
    params: {
      queryKey: ["employees"],
      retry: 1,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        setEmployees(data.data);
        setLoading(false);
      },
      onError: (error) => {
        toast.error("Failed to fetch employees.");
      },
    },
  });

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
      .get("/api/all_products", {
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
          toast.info("No products available.");
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
      products: productRows.filter((row) => row.product_id && row.quantity), // Only send rows with all values
    };

    formData.mutate(payload);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 ">
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
        <div className="flex-1 text-center">
          <div className="-ml-4">
            <h2 className="text-2xl font-semibold">Lead Form</h2>
            <p className="text-xs mb-9 text-muted-foreground">
              Add a new lead.
            </p>
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
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="contact_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className=" relative top-[7px]">
                        Contact
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between relative top-[10px]",
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
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
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
                            <AddContacts fetchContacts={FetchContacts} />
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assigned_to"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className=" relative top-[7px]">
                        Assign To
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between relative top-[10px]",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? employees.find(
                                  (employee) => employee.id === field.value
                                )?.name || "No Employee Name"
                                : "Select Employee"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search employee..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No employee found.</CommandEmpty>
                              <CommandGroup>
                                {loading ? (
                                  <CommandItem disabled>Loading...</CommandItem>
                                ) : (employees || []).length > 0 ? (
                                  employees.map((employee) => {
                                    const employeeName =
                                      employee.name ||
                                      "No Employee Name";

                                    return (
                                      <CommandItem
                                        key={employee.id}
                                        value={employee.id}
                                        onSelect={() => {
                                          form.setValue(
                                            "assigned_to",
                                            employee.id
                                          );
                                        }}
                                      >
                                        {employeeName}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            String(employee.id) === String(field.value)
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    );
                                  })
                                ) : (
                                  <CommandItem disabled>
                                    No Employees available
                                  </CommandItem>
                                )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Lead Source Title</FormLabel>
                  <Select
                    value={selectedTitle}
                    onValueChange={(value) => {
                      setSelectedTitle(value);
                      form.setValue("lead_source", ""); // Reset name selection
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Source Title" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from(new Set(leadSources.map(s => s.source_title))).map(title => (
                        <SelectItem key={title} value={title}>{title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormField
                  control={form.control}
                  name="lead_source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Source Name</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                          disabled={!selectedTitle}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={selectedTitle ? "Select Source Name" : "First select title"} />
                          </SelectTrigger>
                          <SelectContent className="bg-popover text-popover-foreground max-h-[250px] overflow-y-auto p-0">
                            {leadSources
                              .filter(source => source.source_title === selectedTitle)
                              .map((source) => (
                                <SelectItem key={source.id} value={`(${source.source_title}) ${source.source_name}`}>
                                  {source.source_name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
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
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Lead Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover text-popover-foreground max-h-[250px] overflow-y-auto p-0">
                            {leadStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                  checked={String(field.value) === "0"}
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
                                  checked={String(field.value) === "1"}
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
                          type="button"
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
