//@ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { X, Check, ChevronsUpDown, ChevronUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import AddContacts from "./AddContacts";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
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
import { usePostData } from "@/lib/HTTP/POST";
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

const formSchema = z.object({
  contact_id: z.any().optional(),
  lead_status: z.string().optional(),
  lead_source: z.string().optional(),
  lead_type: z.string().optional(),
  tender_number: z.string().optional(),
  bid_end_date: z.string().optional(),
  portal: z.string().optional(),
  tender_category: z.string().optional(),
  emd: z.coerce.number().optional(),
  lead_closing_reason: z.string().optional(),
  tender_status: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
  const [file, setFile] = useState<File | null>(null);
  const [frameworks, setFrameworks] = useState<
    { value: string; label: string }[]
  >([]);

  const addRow = () => {
    setProductRows([
      ...productRows,
      { product_id: "", quantity: "", rate: "" },
    ]);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lead_type: "",
    },
  });

  const fetchData = usePostData({
    endpoint: `/api/leads/${id}`,
    queryKey: ["editlead", id],
    params: {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      onSuccess: () => {
        console.log("success");
        navigate("/leads");
        queryClient.invalidateQueries({ queryKey: ["editlead"] });
        queryClient.invalidateQueries({ queryKey: ["editlead", id] });
        toast.success("Lead updated successfully");
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
    endpoint: "/api/products",
    params: {
      queryKey: ["products"],
      retry: 1,
    },
  });

  useEffect(() => {
    if (productsData?.data?.Products) {
      setFrameworks(
        productsData?.data?.Products?.map((product) => ({
          value: product.id.toString(),
          label: product.product,
        }))
      );
      setLoading(false);
    } else {
      // toast.error("No products available.");
      setLoading(false);
    }
  }, [productsData]);
  const { data: editData } = useGetData({
    endpoint: `/api/leads/${id}`,
    params: {
      queryKey: ["editlead", id],
      retry: 1,
      onSuccess: (data) => {
        setData(data?.Lead);
        console.log(data.data.Lead);

        setContacts(data?.data?.Lead?.contact_id);
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
        rate: product.rate,
        isOpen: false,
      }));
      setProductRows(products);
    }
  }, [editData]);

  useEffect(() => {
    if (editData?.data?.Lead) {
      const newData = editData.data.Lead;
      form.reset({
        contact_id: newData?.contact_id || "",
        lead_status: newData?.lead_status || "",
        lead_closing_reason: newData?.lead_closing_reason || "",
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
  }, [editData]);

  const FetchContacts = useGetData({
    endpoint: `/api/all_contacts`,
    params: {
      queryKey: ["contacts"],
      retry: 1,
      onSuccess: (data) => {
        setContacts(data?.data?.Contacts || []);
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
      lead_attachment: file,

      products: productRows.map((row) => ({
        product_id: row.product_id,
        quantity: row.quantity,
        rate: row.rate,
      })),
    };
 
    const Formdata = new FormData();

    function appendFormData(submissionData, file) {
      const formData = new FormData();
      formData.append("_method", "put");

      for (const [key, value] of Object.entries(submissionData)) {
        if (typeof value === "object" && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }

      // Add the file as binary data
      if (file) {
        formData.append("file", file);
      }

      return formData;
    }

    const formData = appendFormData(submissionData, file);

    fetchData.mutate(formData);
    queryClient.invalidateQueries({ queryKey: ["supplier"] });
    queryClient.invalidateQueries({ queryKey: ["supplier", id] });
  };

  const contactsArray = Array.isArray(contacts) ? contacts : [];

  return (
    <div className=" mx-auto p-6 bg-white shadow-lg rounded-lg  ">
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
            <h2 className="text-2xl font-semibold">Lead Edit Form</h2>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Fields First Row */}
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Lead Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Contacts</FormLabel>
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
                              {Array.isArray(contacts) &&
                                contactsArray.find(
                                  (contact) => contact.id === field.value
                                )?.contact_person}

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
                                {contactsArray.map((contact) => (
                                  <CommandItem
                                    value={contact.id}
                                    key={contact.id}
                                    onSelect={() => {
                                      form.setValue("contact_id", contact.id);
                                    }}
                                  >
                                    {contact.contact_person}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        contact.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                            <AddContacts FetchContacts={FetchContacts} />
                          </Command>
                        </PopoverContent>
                      </Popover>

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
                          placeholder="Enter Lead Source"
                          {...field}
                          value={field.value || ""}
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
              <CardTitle className="text-xl font-semibold">
                Lead Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-x-6 ">
                <FormField
                  control={form.control}
                  name="lead_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Status</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Lead Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Quotation">Quotation</SelectItem>
                            <SelectItem value="Close">Close</SelectItem>
                            <SelectItem value="Deal">Deal</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                      {field.value === "Close" && (
                        <FormField
                          control={form.control}
                          name="lead_closing_reason"
                          render={({ field: closeField }) => (
                            <FormItem>
                              <FormLabel>Reason for Closing</FormLabel>
                              <FormControl>
                                <Textarea
                                  className="w-full"
                                  placeholder="Enter reason for closing the lead"
                                  {...closeField}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      {field.value === "Quotation" && (
                        <FormField
                          control={form.control}
                          name="lead_attachment"
                          render={({ field: pdfField }) => (
                            <FormItem>
                              <FormLabel>Upload PDF</FormLabel>
                              <FormControl>
                                <input
                                  id="pdf-upload"
                                  type="file"
                                  onChange={(e) => {
                                    setFile(e.target.files[0]);
                                  }}
                                  className="w-full border p-2"
                                  accept="application/pdf"
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // window.open(
                                  //   `/api/show_invoice/${invoice.invoice_file}`,
                                  //   "_blank"
                                  // );
                                  handleViewInvoice(invoice.invoice_file);
                                }}
                                className="w-full text-sm"
                              >
                                View quotation
                              </Button>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      {field.value === "Deal" && (
                        <FormField
                          control={form.control}
                          name="lead_attachment"
                          render={({ field: pdfField }) => (
                            <FormItem>
                              <FormLabel>Upload PDF</FormLabel>
                              <FormControl>
                                <input
                                  id="pdf-upload"
                                  type="file"
                                  onChange={(e) => {
                                    setFile(e.target.files[0]);
                                  }}
                                  className="w-full border p-2"
                                  accept="application/pdf" // Accept only PDF files
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
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
                          value={field.value || ""}
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
                              value={field.value || ""}
                            />
                          </FormControl>

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
                              <Input
                                type="date"
                                {...field}
                                value={formattedDate}
                              />
                            </FormControl>

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
                            <Input
                              placeholder="Enter Portal Name"
                              {...field}
                              value={field.value || ""}
                            />
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
                              value={field.value || ""}
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
                              value={field.value || ""}
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
                                        newRows[index].product_id =
                                          framework.value;
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
              type="button"
              onClick={() => {
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
