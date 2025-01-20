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
import AddSuppliers from "./AddSuppliers";
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
  deal_details: z.string().optional(),
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
  const [loading, setLoading] = useState(false);

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [productRows, setProductRows] = useState<ProductRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [frameworks, setFrameworks] = useState<
    { value: string; label: string }[]
  >([]);

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
    endpoint: `/api/purchase/${id}`,
    queryKey: ["purchase", id],
    params: {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      onSuccess: () => {
        console.log("success");
        navigate("/purchase");
        queryClient.invalidateQueries({ queryKey: ["purchase"] });
        queryClient.invalidateQueries({ queryKey: ["purchase", id] });
        toast.success("Purchase updated successfully");
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
  const { data: editData } = useGetData({
    endpoint: `/api/purchase/${id}`,
    params: {
      queryKey: ["purchase", id],
      retry: 1,
      onSuccess: (data) => {
        const suppliersData = data?.data?.Purchase?.supplier_id;

        setSuppliers(suppliersData);

        setLoading(false);
        queryClient.invalidateQueries({ queryKey: ["purchase"] });
        queryClient.invalidateQueries({ queryKey: ["purchase", id] });
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
        rate: product.rate || null,
        isOpen: false,
      }));
      setProductRows(products);
    }
  }, [editData]);

  useEffect(() => {
    if (editData?.data?.Purchase) {
      const newData = editData.data.Purchase;
      console.log("Products:", newData?.Products);

      const productFields = newData?.Products.map((product) => ({
        product_id: product?.product_id || "",
        quantity: product?.quantity || "",
        rate: product?.rate || null,
        cgst: product?.cgst || null,
        sgst: product?.sgst || null,
        igst: product?.igst || null,
        pre_tax_amount: product?.pre_tax_amount || null,
        post_tax_amount: product?.post_tax_amount || null,
      }));

      form.reset({
        supplier_id: newData?.supplier_id || "",
        supplier: newData?.supplier || "",
        payment_ref_no: newData?.payment_ref_no || "",
        payment_remarks: newData?.payment_remarks || "",
        is_paid: newData?.is_paid || "",
        invoice_no: newData?.invoice_no || "",
        payment_status: newData?.payment_status || "",
        invoice_date: newData?.invoice_date || "",
        total_cgst: newData?.total_cgst || "",
        total_sgst: newData?.total_sgst || "",
        total_igst: newData?.total_igst || "",
        total_tax_amount: newData?.total_tax_amount || "",
        total_amount: newData?.total_amount || "",
        products: productFields, // Assuming you can handle an array of products here
      });
    }
  }, [editData]);

  const FetchSuppliers = useGetData({
    endpoint: `/api/all_suppliers`,
    params: {
      queryKey: ["suppliers"],
      retry: 1,
      onSuccess: (data) => {
        setSuppliers(data?.data?.Suppliers || []);
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
        cgst: row.cgst,
        sgst: row.sgst,
        igst: row.igst,
        pre_tax_amount: row.pre_tax_amount,
        post_tax_amount: row.post_tax_amount,
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

  const suppliersArray = Array.isArray(suppliers) ? suppliers : [];

  return (
    <div className=" mx-auto p-6 ">
      <div className="flex items-center justify-between w-full">
        <div className="mb-7">
          <Button
            onClick={() => navigate("/purchase")}
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
              Update the Purchase details.
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
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center  grid grid-cols-1 gap-4">
                <FormItem className="flex flex-col">
                  <FormLabel className="relative top-[7px]">Supplier</FormLabel>
                  <FormControl>
                    <div className="relative top-[10px]">
                      {form.watch("supplier")}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center  grid grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <FormControl>
                    <div>{form.watch("payment_status")}</div>
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Payment Ref. No.</FormLabel>
                  <FormControl>
                    <div>{form.watch("payment_ref_no")}</div>
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Invoice No.</FormLabel>
                  <FormControl>
                    <div>{form.watch("invoice_no")}</div>
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Invoice Date</FormLabel>
                  <FormControl>
                    <div>
                      {form.watch("invoice_date")
                        ? new Date(
                            form.watch("invoice_date")
                          ).toLocaleDateString("en-GB")
                        : ""}
                    </div>
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Payment Remarks</FormLabel>
                  <FormControl>
                    <div>{form.watch("payment_remarks")}</div>
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Is Paid</FormLabel>
                  <FormControl>
                    <div>{form.watch("is_paid") === 1 ? "Yes" : "No"}</div>
                  </FormControl>
                </FormItem>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                GST Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center  grid grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>Total CGST</FormLabel>
                  <FormControl>
                    <div>{form.watch("total_cgst") || "0.00"}</div>
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Total SGST</FormLabel>
                  <FormControl>
                    <div>{form.watch("total_sgst") || "0.00"}</div>
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Total IGST</FormLabel>
                  <FormControl>
                    <div>{form.watch("total_igst") || "0.00"}</div>
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Total Tax Amount</FormLabel>
                  <FormControl>
                    <div>{form.watch("total_tax_amount") || "0.00"}</div>
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl>
                    <div>{form.watch("total_amount") || "0.00"}</div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">Products</CardTitle>
              <CardDescription>A list of your products.</CardDescription>
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
                    <TableHead>CGST</TableHead>
                    <TableHead>SGST</TableHead>
                    <TableHead>IGST</TableHead>
                    <TableHead>Pre-Tax Amount</TableHead>
                    <TableHead>Post-Tax Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editData?.data?.Purchase?.Products?.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {frameworks.find(
                          (f) => f.value === product.product_id.toString()
                        )?.label || "Unknown Product"}
                      </TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.rate}</TableCell>
                      <TableCell>{product.cgst}</TableCell>
                      <TableCell>{product.sgst}</TableCell>
                      <TableCell>{product.igst}</TableCell>
                      <TableCell>{product.pre_tax_amount}</TableCell>
                      <TableCell>{product.post_tax_amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={7}>Total</TableCell>
                    <TableCell className="text-right">
                      {form.watch("total_amount") || "0.00"}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={() => {
                navigate("/purchase");
              }}
            >
              Back
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
