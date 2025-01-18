import React, { useState, useEffect } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import AddSuppliers from "./AddSuppliers";

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
import { Textarea } from "@/components/ui/textarea";
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
  supplier_id: z.any().optional(),
  supplier: z.any().optional(),
  payment_ref_no: z.string().optional(),
  payment_remarks: z.string().optional(),
  is_paid: z
    .number()
    .refine((val) => val === 0 || val === 1, {
      message: "is_paid must be 0 or 1",
    })
    .optional(),
  payment_status: z.string().optional(),
  invoice_no: z.string().optional(),
  invoice_date: z.string().optional(),
  total_cgst: z.string().optional(),
  total_sgst: z.coerce.string().optional(),
  total_igst: z.string().optional(),
  total_tax_amount: z.string().optional(),
  total_amount: z.string().optional(),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState("");
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      supplier_id: "",
      supplier: "",
      payment_ref_no: "",
      payment_remarks: "",
      is_paid: "",
      invoice_no: "",
      payment_status: "",
      invoice_date: "",
      total_cgst: "",
      total_sgst: "",
      total_igst: "",
      total_tax_amount: "",
      total_amount: "",
    },
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Use For Navigation
  const [frameworks, setFrameworks] = useState<any[]>([]); // Initialize as an empty array
  const [productRows, setProductRows] = useState<any[]>([]);

  const addRow = () => {
    setProductRows([
      ...productRows,
      {
        product_id: "",
        quantity: "",
        rate: "",
        cgst: "",
        sgst: "",
        igst: "",
        pre_tax_amount: "",
        post_tax_amount: "",
        isOpen: false,
      },
    ]);
  };

  type FormValues = z.infer<typeof FormSchema>;
  const formData = usePostData({
    endpoint: "/api/purchase",
    queryKey: ["purchase"],
    params: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["purchase"] });
        queryClient.invalidateQueries({ queryKey: ["purchase"] });
        navigate("/purchase");
      },
      onError: (error) => {
        if (error.response && error.response.data.errors) {
          const serverStatus = error.response.data.status;
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the department_name field
          if (serverStatus === false) {
            if (serverErrors.purchase) {
              form.setError("purchase", {
                type: "manual",
                message: serverErrors.purchase[0], // The error message from the server
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

  const { data: FetchSuppliers } = useGetData({
    endpoint: `/api/all_suppliers`,
    params: {
      queryKey: ["suppliers"],
      retry: 1,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["suppliers"] });
        setSuppliers(data.data.Suppliers);
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("duplicate suppliers")) {
          toast.error(
            "Suppliers name is duplicated. Please use a unique name."
          );
        } else {
          toast.error("Failed to fetch suppliers.");
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
      products: productRows.filter((row) => row.product_id && row.quantity), // Only send rows with all values
    };

    formData.mutate(payload);
  };

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
            <h2 className="text-2xl font-semibold">Purchase Form</h2>
            <p className="text-xs mb-9 text-muted-foreground">
              Add a new purchase.
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
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center  grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="supplier_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className=" relative top-[7px]">
                        Supplier
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                " justify-between relative top-[10px]",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? suppliers.find(
                                    (supplier) => supplier.id === field.value
                                  )?.supplier || "No Supplier"
                                : "Select Supplier"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className=" max-h-[260px] overflow-y-auto p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search Supplier..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No supplier found.</CommandEmpty>
                              <CommandGroup>
                                {loading ? (
                                  <CommandItem disabled>Loading...</CommandItem>
                                ) : (suppliers || []).length > 0 ? (
                                  suppliers.map((supplier) => {
                                    const contactPerson =
                                      supplier.supplier || "No Contact Person";

                                    return (
                                      <CommandItem
                                        key={supplier.id}
                                        value={supplier.id}
                                        onSelect={() => {
                                          form.setValue(
                                            "supplier_id",
                                            supplier.id
                                          );
                                        }}
                                      >
                                        {contactPerson}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            supplier.id === field.value
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
                            <AddSuppliers FetchSuppliers={FetchSuppliers} />
                          </Command>
                        </PopoverContent>
                      </Popover>

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
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center  grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="payment_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Status</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Lead Source" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover text-popover-foreground max-h-[250px] overflow-y-auto p-0">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="partially_paid">
                              Partially Paid
                            </SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="awaiting_approval">
                              Awaiting Approval
                            </SelectItem>
                            <SelectItem value="authorized">
                              Authorized
                            </SelectItem>
                            <SelectItem value="processing">
                              Processing
                            </SelectItem>
                            <SelectItem value="failed_verification">
                              Failed Verification
                            </SelectItem>
                            <SelectItem value="disputed">Disputed</SelectItem>
                            <SelectItem value="pending_confirmation">
                              Pending Confirmation
                            </SelectItem>
                            <SelectItem value="settled">Settled</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payment_ref_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Ref. No.</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Payment Reference Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invoice_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice No.</FormLabel>
                      <FormControl>
                        <Input placeholder="Invoice Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invoice_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payment_remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Remarks</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Payment Reference Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_paid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is Paid</FormLabel>
                      <FormControl>
                        <input
                          type="checkbox"
                          {...field}
                          checked={field.value === 1} // Set checkbox to checked if the value is 1
                          onChange={(e) =>
                            field.onChange(e.target.checked ? 1 : 0)
                          } // Send 1 when checked, 0 when unchecked
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
                GST Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center  grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="total_cgst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total CGST.</FormLabel>
                      <FormControl>
                        <Input placeholder="Invoice Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="total_sgst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total SGST.</FormLabel>
                      <FormControl>
                        <Input placeholder="Invoice Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="total_igst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total IGST.</FormLabel>
                      <FormControl>
                        <Input placeholder="Invoice Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="total_tax_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Tax Amount.</FormLabel>
                      <FormControl>
                        <Input placeholder="Invoice Tax Amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="total_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount.</FormLabel>
                      <FormControl>
                        <Input placeholder="Invoice  Amount" {...field} />
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
                    <TableHead>CGST</TableHead>
                    <TableHead>SGST</TableHead>
                    <TableHead>IGST</TableHead>
                    <TableHead>Pre-Tax Amount</TableHead>
                    <TableHead>Post-Tax Amount</TableHead>

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
                      <TableCell>
                        <Input
                          placeholder="CGST"
                          name="cgst"
                          value={row.cgst}
                          onChange={(e) => {
                            const newRows = [...productRows];
                            newRows[index].cgst = e.target.value;
                            setProductRows(newRows); // Update the state with the new quantity
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="SGST"
                          name="sgst"
                          value={row.sgst}
                          onChange={(e) => {
                            const newRows = [...productRows];
                            newRows[index].sgst = e.target.value;
                            setProductRows(newRows); // Update the state with the new quantity
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="IGST"
                          name="igst"
                          value={row.igst}
                          onChange={(e) => {
                            const newRows = [...productRows];
                            newRows[index].igst = e.target.value;
                            setProductRows(newRows); // Update the state with the new quantity
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Pre-Tax Amount"
                          name="pre_tax_amount"
                          value={row.pre_tax_amount}
                          onChange={(e) => {
                            const newRows = [...productRows];
                            newRows[index].pre_tax_amount = e.target.value;
                            setProductRows(newRows); // Update the state with the new quantity
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Post-Tax Amount"
                          name="post_tax_amount"
                          value={row.post_tax_amount}
                          onChange={(e) => {
                            const newRows = [...productRows];
                            newRows[index].post_tax_amount = e.target.value;
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
              onClick={() => navigate("/purchase")}
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
