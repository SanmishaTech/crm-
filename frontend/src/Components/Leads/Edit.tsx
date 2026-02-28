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
  assigned_to: z.any().optional(),
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
  lead_attachment: z.any().optional(),
  lead_sale_order: z.any().optional(),
  lead_audit_report: z.any().optional(),
  lead_atr_report: z.any().optional(),
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
  const [leads, setLeads] = useState<any>([]);

  const [contacts, setContacts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [productRows, setProductRows] = useState<ProductRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [saleOrderFile, setSaleOrderFile] = useState<File | null>(null);
  const [auditReportFile, setAuditReportFile] = useState<File | null>(null);
  const [atrReportFile, setAtrReportFile] = useState<File | null>(null);
  const [frameworks, setFrameworks] = useState<
    { value: string; label: string }[]
  >([]);

  const openPdfFromApi = async (title: string, apiUrl: string) => {
    const popup = window.open("", "_blank");
    if (!popup) {
      toast.error("Popup blocked. Please allow popups.");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          Accept: "application/pdf, application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${title}`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      const blob = await response.blob();
      const signature = await blob.slice(0, 5).text();
      if (!signature.startsWith("%PDF-")) {
        const text = await blob.text();
        popup.document.open();
        popup.document.write(text);
        popup.document.close();
        toast.error(
          `${title} is not a PDF (content-type: ${contentType || "unknown"}).`
        );
        return;
      }

      const pdfBlob =
        blob.type && blob.type !== "application/octet-stream"
          ? blob
          : new Blob([blob], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      popup.document.open();
      popup.document.write(
        `<html><head><title>${title}</title><style>html,body{margin:0;height:100%;}iframe{border:0;width:100%;height:100%;}</style></head><body><iframe src="${url}"></iframe></body></html>`
      );
      popup.document.close();

      const revokeWhenClosed = window.setInterval(() => {
        if (popup.closed) {
          window.clearInterval(revokeWhenClosed);
          window.URL.revokeObjectURL(url);
        }
      }, 1000);
    } catch {
      popup.close();
      toast.error(`Failed to open ${title}.`);
    }
  };

  const addRow = () => {
    setProductRows([
      ...productRows,
      { product_id: "", quantity: "", rate: null },
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
        if (error.response && error.response.data.errors) {
          const serverStatus = error.response.data.status;
          const serverErrors = error.response.data.errors;
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
            setError("Failed to update lead"); // For any other errors
          }
        } else {
          setError("Failed to update lead");
        }
      },
    },
  });

  const { data: productsData } = useGetData({
    endpoint: "/api/all_products",
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
  const { data: FetchEmployees } = useGetData({
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

  const { data: editData } = useGetData({
    endpoint: `/api/leads/${id}`,
    params: {
      queryKey: ["editlead", id],
      retry: 1,
      onSuccess: (data) => {
        setData(data?.Lead);
        setLeads(data.data.Lead?.contact?.client?.client);
        setContacts(data?.data?.Lead?.contact_id);
        setLoading(false);
        queryClient.invalidateQueries({ queryKey: ["editlead"] });
        queryClient.invalidateQueries({ queryKey: ["editlead", id] });
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

  const savedLeadStatus = (() => {
    const raw = (editData?.data?.Lead?.lead_status ?? "").trim();
    return raw === "Close" ? "Closed" : raw;
  })();

  useEffect(() => {
    if (editData?.data?.Lead?.products) {
      const products = editData.data.Lead.products.map((product: any) => ({
        product_id: product.product_id.toString(),
        quantity: product.quantity || "",
        rate: product.rate || null,
        isOpen: false,
      }));
      setProductRows(products);
    }
  }, [editData]);

  useEffect(() => {
    if (editData?.data?.Lead) {
      const newData = editData.data.Lead;
      const normalizedLeadStatus = (() => {
        const raw = (newData?.lead_status ?? "").trim();
        return raw === "Close" ? "Closed" : raw;
      })();
      form.reset({
        contact_id: newData?.contact_id || "",
        assigned_to: newData?.assigned_to || "",
        lead_status: normalizedLeadStatus || "",
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
        rate: newData?.rate || null,
        product_id: newData?.product_id || "",
        lead_attachment: newData?.lead_attachment || "",
        lead_sale_order: newData?.lead_sale_order || "",
        lead_audit_report: newData?.lead_audit_report || "",
        lead_atr_report: newData?.lead_atr_report || "",
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
      lead_sale_order: saleOrderFile,
      lead_audit_report: auditReportFile,
      lead_atr_report: atrReportFile,

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
            <h2 className="text-2xl font-semibold">Lead Edit Form</h2>
            <p className="text-xs mb-9 text-muted-foreground">
              Update the lead details.
            </p>
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
              <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
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
                                "w-[550px] lg:w-[350px] md:w-[250px] justify-between relative top-[10px]",
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
                      <div className=" relative top-[10px] max-w-xs bg-gray-300 rounded-lg shadow-lg p-3 transform transition duration-300 hover:scale-105  hover:shadow-2xl hover:translate-z-10">
                        <p className="text-gray-700">
                          <strong className="text-black-500">Client Name:</strong>{" "}
                          {leads}
                        </p>
                      </div>

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
                                "w-[390px] justify-between relative top-[10px]",
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
                        <PopoverContent className="w-[390px] max-h-[260px] overflow-y-auto p-0">
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
                                            employee.id === field.value
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

                <FormField
                  control={form.control}
                  name="lead_source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Source</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Lead Source" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover text-popover-foreground max-h-[250px] overflow-y-auto p-0">
                            <SelectItem value="Email">Email</SelectItem>
                            <SelectItem value="Inbound Call">
                              Inbound Call
                            </SelectItem>
                            <SelectItem value="Outbound Call">
                              Outbound Call
                            </SelectItem>
                            <SelectItem value="India Market">
                              India Market
                            </SelectItem>
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
              <CardTitle className="text-xl font-semibold">
                Lead Status
              </CardTitle>
              <div className="mt-2 flex flex-wrap gap-2">
                {editData?.data?.Lead?.lead_quotation ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openPdfFromApi(
                        "Quotation",
                        `/api/quotations/${encodeURIComponent(
                          editData.data.Lead.lead_quotation
                        )}`
                      )
                    }
                  >
                    View quotation
                  </Button>
                ) : null}
                {editData?.data?.Lead?.lead_attachment ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openPdfFromApi(
                        "Lead Attachment",
                        `/api/lead_attachments/${encodeURIComponent(
                          editData.data.Lead.lead_attachment
                        )}`
                      )
                    }
                  >
                    View attachment
                  </Button>
                ) : null}
                {editData?.data?.Lead?.lead_sale_order ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openPdfFromApi(
                        "Sale Order",
                        `/api/sale_orders/${encodeURIComponent(
                          editData.data.Lead.lead_sale_order
                        )}`
                      )
                    }
                  >
                    View sale order
                  </Button>
                ) : null}
                {editData?.data?.Lead?.lead_audit_report ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openPdfFromApi(
                        "Audit Report",
                        `/api/audit_reports/${encodeURIComponent(
                          editData.data.Lead.lead_audit_report
                        )}`
                      )
                    }
                  >
                    View audit report
                  </Button>
                ) : null}
                {editData?.data?.Lead?.lead_atr_report ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openPdfFromApi(
                        "ATR Report",
                        `/api/atr_reports/${encodeURIComponent(
                          editData.data.Lead.lead_atr_report
                        )}`
                      )
                    }
                  >
                    View ATR report
                  </Button>
                ) : null}
              </div>
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
                            {savedLeadStatus === "Open" ? (
                              <>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="In Progress">
                                  In Progress
                                </SelectItem>
                              </>
                            ) : savedLeadStatus === "In Progress" ? (
                              <>
                                <SelectItem value="In Progress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="Quotation">
                                  Quotation
                                </SelectItem>
                                <SelectItem value="Closed">Close</SelectItem>
                              </>
                            ) : savedLeadStatus === "Quotation" ? (
                              <>
                                <SelectItem value="Quotation">
                                  Quotation
                                </SelectItem>
                                <SelectItem value="Closed">Close</SelectItem>
                                <SelectItem value="Purchase Order">
                                  Purchase Order
                                </SelectItem>
                              </>
                            ) : savedLeadStatus === "Purchase Order" ? (
                              <>
                                <SelectItem value="Purchase Order">
                                  Purchase Order
                                </SelectItem>
                                <SelectItem value="Closed">Close</SelectItem>
                                {editData?.data?.Lead?.lead_sale_order ? (
                                  <SelectItem value="Audit">Audit</SelectItem>
                                ) : null}
                              </>
                            ) : savedLeadStatus === "Audit" ? (
                              <>
                                <SelectItem value="Audit">Audit</SelectItem>
                                <SelectItem value="Closed">Close</SelectItem>
                                {editData?.data?.Lead?.lead_audit_report ? (
                                  <SelectItem value="ATR Report">
                                    ATR Report
                                  </SelectItem>
                                ) : null}
                              </>
                            ) : savedLeadStatus === "ATR Report" ? (
                              <>
                                <SelectItem
                                  value="ATR Report"
                                  disabled={!!editData?.data?.Lead?.lead_atr_report}
                                >
                                  ATR Report
                                </SelectItem>
                                <SelectItem value="Closed">Close</SelectItem>
                              </>
                            ) : savedLeadStatus === "Deal" ? (
                              <>
                                <SelectItem value="Closed">Close</SelectItem>
                              </>
                            ) : (savedLeadStatus === "Close" ||
                              savedLeadStatus === "Closed") ? (
                              <>
                                <SelectItem value="Closed">Close</SelectItem>
                                <SelectItem value="Open">Open</SelectItem>
                              </>
                            ) : (
                              <></> // Ensure there's no empty return when no condition is met
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                      {field.value === "Closed" && (
                        <FormField
                          control={form.control}
                          name="lead_closing_reason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Closing Reason</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter closing reason"
                                  className="resize-none"
                                  {...field}
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
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lead Attachment (PDF)</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="application/pdf"
                                  onChange={(event) => {
                                    const selectedFile = event.target.files?.[0] ?? null;
                                    setFile(selectedFile);
                                    field.onChange(selectedFile);
                                  }}
                                />
                              </FormControl>
                              {editData?.data?.Lead?.lead_attachment ? (
                                <Button
                                  type="button"
                                  variant="link"
                                  className="p-0 h-auto text-sm"
                                  onClick={async () => {
                                    const popup = window.open("", "_blank");
                                    if (!popup) {
                                      toast.error("Popup blocked. Please allow popups.");
                                      return;
                                    }
                                    try {
                                      const response = await fetch(
                                        `/api/lead_attachments/${encodeURIComponent(
                                          editData.data.Lead.lead_attachment
                                        )}`,
                                        {
                                          headers: {
                                            Authorization:
                                              "Bearer " + localStorage.getItem("token"),
                                            Accept: "application/pdf, application/json",
                                            "X-Requested-With": "XMLHttpRequest",
                                          },
                                        }
                                      );

                                      if (!response.ok) {
                                        throw new Error("Failed to fetch lead attachment");
                                      }

                                      const contentType =
                                        response.headers.get("content-type") ?? "";
                                      const blob = await response.blob();
                                      const signature = await blob.slice(0, 5).text();
                                      if (!signature.startsWith("%PDF-")) {
                                        const text = await blob.text();
                                        popup.document.open();
                                        popup.document.write(text);
                                        popup.document.close();
                                        toast.error(
                                          `Lead attachment is not a PDF (content-type: ${contentType || "unknown"}).`
                                        );
                                        return;
                                      }

                                      const pdfBlob =
                                        blob.type && blob.type !== "application/octet-stream"
                                          ? blob
                                          : new Blob([blob], { type: "application/pdf" });
                                      const url = window.URL.createObjectURL(pdfBlob);
                                      popup.document.open();
                                      popup.document.write(
                                        `<html><head><title>Lead Attachment</title><style>html,body{margin:0;height:100%;}iframe{border:0;width:100%;height:100%;}</style></head><body><iframe src="${url}"></iframe></body></html>`
                                      );
                                      popup.document.close();
                                      const revokeWhenClosed = window.setInterval(() => {
                                        if (popup.closed) {
                                          window.clearInterval(revokeWhenClosed);
                                          window.URL.revokeObjectURL(url);
                                        }
                                      }, 1000);
                                    } catch {
                                      popup.close();
                                      toast.error("Failed to open lead attachment.");
                                    }
                                  }}
                                >
                                  View current attachment
                                </Button>
                              ) : null}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      {field.value === "Purchase Order" && (
                        <FormField
                          control={form.control}
                          name="lead_sale_order"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sale Order (PDF)</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="application/pdf"
                                  onChange={(event) => {
                                    const selectedFile = event.target.files?.[0] ?? null;
                                    setSaleOrderFile(selectedFile);
                                    field.onChange(selectedFile);
                                  }}
                                />
                              </FormControl>
                              {editData?.data?.Lead?.lead_sale_order ? (
                                <Button
                                  type="button"
                                  variant="link"
                                  className="p-0 h-auto text-sm"
                                  onClick={async () => {
                                    const popup = window.open("", "_blank");
                                    if (!popup) {
                                      toast.error("Popup blocked. Please allow popups.");
                                      return;
                                    }
                                    try {
                                      const response = await fetch(
                                        `/api/sale_orders/${encodeURIComponent(
                                          editData.data.Lead.lead_sale_order
                                        )}`,
                                        {
                                          headers: {
                                            Authorization:
                                              "Bearer " + localStorage.getItem("token"),
                                            Accept: "application/pdf, application/json",
                                            "X-Requested-With": "XMLHttpRequest",
                                          },
                                        }
                                      );

                                      if (!response.ok) {
                                        throw new Error("Failed to fetch sale order");
                                      }

                                      const contentType =
                                        response.headers.get("content-type") ?? "";
                                      const blob = await response.blob();
                                      const signature = await blob.slice(0, 5).text();
                                      if (!signature.startsWith("%PDF-")) {
                                        const text = await blob.text();
                                        popup.document.open();
                                        popup.document.write(text);
                                        popup.document.close();
                                        toast.error(
                                          `Sale order is not a PDF (content-type: ${contentType || "unknown"}).`
                                        );
                                        return;
                                      }

                                      const pdfBlob =
                                        blob.type && blob.type !== "application/octet-stream"
                                          ? blob
                                          : new Blob([blob], { type: "application/pdf" });
                                      const url = window.URL.createObjectURL(pdfBlob);
                                      popup.document.open();
                                      popup.document.write(
                                        `<html><head><title>Sale Order</title><style>html,body{margin:0;height:100%;}iframe{border:0;width:100%;height:100%;}</style></head><body><iframe src="${url}"></iframe></body></html>`
                                      );
                                      popup.document.close();
                                      const revokeWhenClosed = window.setInterval(() => {
                                        if (popup.closed) {
                                          window.clearInterval(revokeWhenClosed);
                                          window.URL.revokeObjectURL(url);
                                        }
                                      }, 1000);
                                    } catch {
                                      popup.close();
                                      toast.error("Failed to open sale order.");
                                    }
                                  }}
                                >
                                  View current sale order
                                </Button>
                              ) : null}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      {field.value === "Audit" && (
                        <FormField
                          control={form.control}
                          name="lead_audit_report"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Audit Report (PDF)</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="application/pdf"
                                  onChange={(event) => {
                                    const selectedFile = event.target.files?.[0] ?? null;
                                    setAuditReportFile(selectedFile);
                                    field.onChange(selectedFile);
                                  }}
                                />
                              </FormControl>
                              {editData?.data?.Lead?.lead_audit_report ? (
                                <Button
                                  type="button"
                                  variant="link"
                                  className="p-0 h-auto text-sm"
                                  onClick={async () => {
                                    const popup = window.open("", "_blank");
                                    if (!popup) {
                                      toast.error("Popup blocked. Please allow popups.");
                                      return;
                                    }
                                    try {
                                      const response = await fetch(
                                        `/api/audit_reports/${encodeURIComponent(
                                          editData.data.Lead.lead_audit_report
                                        )}`,
                                        {
                                          headers: {
                                            Authorization:
                                              "Bearer " + localStorage.getItem("token"),
                                            Accept: "application/pdf, application/json",
                                            "X-Requested-With": "XMLHttpRequest",
                                          },
                                        }
                                      );

                                      if (!response.ok) {
                                        throw new Error("Failed to fetch audit report");
                                      }

                                      const contentType =
                                        response.headers.get("content-type") ?? "";
                                      const blob = await response.blob();
                                      const signature = await blob.slice(0, 5).text();
                                      if (!signature.startsWith("%PDF-")) {
                                        const text = await blob.text();
                                        popup.document.open();
                                        popup.document.write(text);
                                        popup.document.close();
                                        toast.error(
                                          `Audit report is not a PDF (content-type: ${contentType || "unknown"}).`
                                        );
                                        return;
                                      }

                                      const pdfBlob =
                                        blob.type && blob.type !== "application/octet-stream"
                                          ? blob
                                          : new Blob([blob], { type: "application/pdf" });
                                      const url = window.URL.createObjectURL(pdfBlob);
                                      popup.document.open();
                                      popup.document.write(
                                        `<html><head><title>Audit Report</title><style>html,body{margin:0;height:100%;}iframe{border:0;width:100%;height:100%;}</style></head><body><iframe src="${url}"></iframe></body></html>`
                                      );
                                      popup.document.close();
                                      const revokeWhenClosed = window.setInterval(() => {
                                        if (popup.closed) {
                                          window.clearInterval(revokeWhenClosed);
                                          window.URL.revokeObjectURL(url);
                                        }
                                      }, 1000);
                                    } catch {
                                      popup.close();
                                      toast.error("Failed to open audit report.");
                                    }
                                  }}
                                >
                                  View current audit report
                                </Button>
                              ) : null}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      {field.value === "ATR Report" && (
                        <FormField
                          control={form.control}
                          name="lead_atr_report"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ATR Report (PDF)</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="application/pdf"
                                  onChange={(event) => {
                                    const selectedFile = event.target.files?.[0] ?? null;
                                    setAtrReportFile(selectedFile);
                                    field.onChange(selectedFile);
                                  }}
                                />
                              </FormControl>
                              {editData?.data?.Lead?.lead_atr_report ? (
                                <Button
                                  type="button"
                                  variant="link"
                                  className="p-0 h-auto text-sm"
                                  onClick={async () => {
                                    const popup = window.open("", "_blank");
                                    if (!popup) {
                                      toast.error("Popup blocked. Please allow popups.");
                                      return;
                                    }
                                    try {
                                      const response = await fetch(
                                        `/api/atr_reports/${encodeURIComponent(
                                          editData.data.Lead.lead_atr_report
                                        )}`,
                                        {
                                          headers: {
                                            Authorization:
                                              "Bearer " + localStorage.getItem("token"),
                                            Accept: "application/pdf, application/json",
                                            "X-Requested-With": "XMLHttpRequest",
                                          },
                                        }
                                      );

                                      if (!response.ok) {
                                        throw new Error("Failed to fetch ATR report");
                                      }

                                      const contentType =
                                        response.headers.get("content-type") ?? "";
                                      const blob = await response.blob();
                                      const signature = await blob.slice(0, 5).text();
                                      if (!signature.startsWith("%PDF-")) {
                                        const text = await blob.text();
                                        popup.document.open();
                                        popup.document.write(text);
                                        popup.document.close();
                                        toast.error(
                                          `ATR report is not a PDF (content-type: ${contentType || "unknown"}).`
                                        );
                                        return;
                                      }

                                      const pdfBlob =
                                        blob.type && blob.type !== "application/octet-stream"
                                          ? blob
                                          : new Blob([blob], { type: "application/pdf" });
                                      const url = window.URL.createObjectURL(pdfBlob);
                                      popup.document.open();
                                      popup.document.write(
                                        `<html><head><title>ATR Report</title><style>html,body{margin:0;height:100%;}iframe{border:0;width:100%;height:100%;}</style></head><body><iframe src="${url}"></iframe></body></html>`
                                      );
                                      popup.document.close();
                                      const revokeWhenClosed = window.setInterval(() => {
                                        if (popup.closed) {
                                          window.clearInterval(revokeWhenClosed);
                                          window.URL.revokeObjectURL(url);
                                        }
                                      }, 1000);
                                    } catch {
                                      popup.close();
                                      toast.error("Failed to open ATR report.");
                                    }
                                  }}
                                >
                                  View current ATR report
                                </Button>
                              ) : null}
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
                          type="button"
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
