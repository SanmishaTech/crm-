import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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

// Form validation schema
const formSchema = z.object({
  contact_id: z.any().optional(),
  lead_status: z.string().optional(),
  lead_source: z.string().optional(),
  lead_type: z.string().optional(),
  tender_number: z.string().optional(),
  bid_end_date: z.string().optional(),
  portal: z.string().optional(),
  tender_category: z.string().optional(),
  // emd: z.string().optional(),
  emd: z.coerce.number().optional(),

  tender_status: z.string().optional(),
});

// Move FormValues type definition outside the component
type FormValues = z.infer<typeof formSchema>;

// First, let's define proper types for the data
interface Product {
  id: number;
  product: string;
  quantity?: string;
  rate?: string;
}

interface ProductRow {
  product_id: string;
  quantity: string;
  rate: string;
  isOpen: boolean;
}

export default function EditLeadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [productRows, setProductRows] = useState<ProductRow[]>([]);
  const [frameworks, setFrameworks] = useState<
    { value: string; label: string }[]
  >([]);

  const addRow = () => {
    setProductRows([
      ...productRows,
      { product_id: "", quantity: "", rate: "", isOpen: false },
    ]);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact_id: "",
      lead_source: "",
      lead_status: "",
      lead_type: "basic",
      tender_number: "",
      bid_end_date: "",
      portal: "",
      tender_category: "",
      emd: null,
      tender_status: "",
      quantity: "",
      rate: "",
      product_id: "",
    },
  });

  const fetchData = usePutData({
    endpoint: `/api/leads/${id}`,
    queryKey: ["editlead", id],
    params: {
      onSuccess: () => {
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

  const { data: productsData } = useGetData({
    endpoint: `/api/products`,
    params: {
      queryKey: ["products"],
      retry: 1,
      onSuccess: (data) => {
        if (data?.data?.Products) {
          setFrameworks(
            data.data.Products.map((product: Product) => ({
              value: product.id.toString(),
              label: product.product,
            }))
          );
        } else {
          toast.error("No products available.");
        }
        setLoading(false);
      },
      onError: (error) => {
        toast.error("Failed to fetch products. Please try again.");
        setLoading(false);
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
        setData(data?.Lead);
        setContacts(data?.data?.Lead?.contact_id); // Store contact_id for later use
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
    if (editData?.data?.Lead?.products) {
      const products = editData.data.Lead.products.map((product: any) => ({
        product_id: product.product_id.toString(),
        quantity: product.quantity || "",
        rate: product.rate || "",
        isOpen: false,
      }));
      setProductRows(products);
    }
  }, [editData]);

  useEffect(() => {
    if (editData?.data?.Lead) {
      const newData = editData?.data?.Lead;
      form.reset({
        contact_id: newData?.contact_id || "", // Preselect the contact_id from the fetched data
        lead_status: newData?.lead_status || "",
        lead_source: newData?.lead_source || "",
        lead_type: newData?.lead_type || "",
        tender_number: newData?.tender_number || "",
        bid_end_date: newData?.bid_end_date || "",
        portal: newData?.portal || "",
        tender_category: newData?.tender_category || "",
        emd: newData?.emd || "",
        tender_status: newData?.tender_status || "",
        quantity: newData?.quantity || "",
        rate: newData?.rate || "",
        product_id: newData?.product_id || "",
      });
    }
  }, [editData, form]);

  const getData = useGetData({
    endpoint: `/api/contacts`,
    params: {
      queryKey: ["contacts"],
      retry: 1,
      onSuccess: (data) => {
        setContacts(data?.data?.Contact || []);
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
    const submissionData = {
      ...data,

      products: productRows.map((row) => ({
        product_id: row.product_id,
        quantity: row.quantity,
        rate: row.rate,
      })),
    };

    // window.location.reload();
    fetchData.mutate(submissionData);
    queryClient.invalidateQueries({ queryKey: ["supplier"] });
    queryClient.invalidateQueries({ queryKey: ["supplier", id] });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-12">
      <h3 className="text-2xl font-semibold text-center">Edit Lead</h3>
      <p className="text-center text-xs mb-9">Edit & Update Lead.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Fields First Row */}
          <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="contact_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contacts</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)} // Ensure the value is a string and correctly selected
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select Contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <SelectItem disabled>Loading...</SelectItem>
                        ) : Array.isArray(contacts) && contacts.length > 0 ? (
                          contacts.map((contact) => (
                            <SelectItem
                              key={contact.id}
                              value={String(contact.id)}
                            >
                              {contact.contact_person}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled>
                            No contacts available
                          </SelectItem>
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
                  render={({ field }) => {
                    const formattedDate = field.value
                      ? field.value.split("T")[0]
                      : "";

                    return (
                      <FormItem>
                        <FormLabel>Bid End Date</FormLabel>
                        <FormControl>
                          {/* Set the formatted date */}
                          <Input type="date" {...field} value={formattedDate} />
                        </FormControl>
                        <FormDescription>
                          Select the tender date.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
                              id="emd-paid"
                              {...field}
                              value={0}
                              checked={Number(field.value) === 0}
                              // value={0}
                              // checked={field.value === 0}
                              className="h-4 w-4"
                            />
                            <label htmlFor="emd-paid">Paid</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="emd-pending"
                              {...field}
                              value={1}
                              checked={Number(field.value) === 1}
                              // value="1"
                              // checked={field.value === "1"}
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
                        setProductRows(newRows);
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
                              )?.label || "Select products..."
                            : "Select products..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search products..." />
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
                                    newRows[index].isOpen = false;
                                    setProductRows(newRows);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      row.product_id === framework.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {framework.label}
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
                        setProductRows(newRows);
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
          {/* Table End */}
          {/* Error Message */}
          <Button
            type="button"
            onClick={addRow}
            variant="outline"
            className="mb-4"
          >
            Add Row
          </Button>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={() => {
                navigate("/leads");
                window.location.reload();
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
