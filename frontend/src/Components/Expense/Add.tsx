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
  voucher_number: z.string().optional(),
  voucher_date: z.string(),
  voucher_amount: z.string(),
});

// Add these types at the top of the file
interface ExpenseHead {
  id: number;
  expense_head: string;
}

interface APIResponse {
  data: {
    ExpenseHead: ExpenseHead[];
  };
  status: boolean;
}

interface ServerError {
  response?: {
    data: {
      status: boolean;
      errors: {
        contact_id?: string[];
        error?: string[];
        [key: string]: string[] | undefined;
      };
    };
  };
}

interface ProductRow {
  expense_head_id: string | number;
  amount: string;
  isOpen: boolean;
}

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expenseHeads, setExpenseHeads] = useState<Array<{value: number, label: string}>>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      voucher_number: "",
      voucher_date: "",
      voucher_amount: "",
       
    },
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Use For Navigation
  const [productRows, setProductRows] = useState<ProductRow[]>([]);

  const addRow = () => {
    setProductRows([
      ...productRows,
      { expense_head_id: "", amount: "", isOpen: false },
    ]);
  };
  

  type FormValues = z.infer<typeof FormSchema>;
  const formData = usePostData<FormValues>({
    endpoint: "/api/expenses",
    params: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
        navigate("/expense");
      },
      onError: (error: ServerError) => {
        console.log("error", error);

        if (error.response?.data.errors) {
          const serverStatus = error.response.data.status;
          const serverErrors = error.response.data.errors;
          
          if (serverStatus === false) {
            if (serverErrors.contact_id) {
              form.setError("voucher_number", {
                type: "manual",
                message: serverErrors.contact_id[0],
              });
            }
            if (serverErrors.error) {
              toast.error(serverErrors.error[0]);
            }
          } else {
            setError("Failed to add expense");
          }
        } else {
          setError("Failed to add expense");
        }
      },
    },
  });

  const { data: fetchExpenseHeads } = useGetData<APIResponse>({
    endpoint: `/api/all_expense_heads`,
    params: {
      queryKey: ["expenseHeads"],
      retry: 1,
      onError: (error) => {
        toast.error("Failed to fetch expense heads.");
      },
    },
  });

  useEffect(() => {
    if (fetchExpenseHeads?.data?.ExpenseHead) {
      const mappedHeads = fetchExpenseHeads.data.ExpenseHead.map((head) => ({
        value: head.id,
        label: head.expense_head
      }));
      setExpenseHeads(mappedHeads);
      setLoading(false);
    }
  }, [fetchExpenseHeads]);

  const onSubmit = async (data: FormValues) => {
    // Validate that we have at least one expense detail
    if (productRows.length === 0 || !productRows.some(row => row.expense_head_id && row.amount)) {
      toast.error("Please add at least one expense detail");
      return;
    }

    // Log the data before submission to verify
    console.log('Product Rows:', productRows);

    const payload = {
      voucher_number: data.voucher_number,
      voucher_date: data.voucher_date,
      voucher_amount: data.voucher_amount,
      expense_details: productRows
        .filter((row) => row.expense_head_id && row.amount)
        .map(row => ({
          expense_head_id: row.expense_head_id,
          amount: row.amount
        }))
    };

    console.log('Submitting payload:', payload);
    formData.mutate(payload);
  };

  return (
    <div className=" mx-auto p-6 ">
      <div className="flex items-center justify-between w-full">
        <div className="mb-7">
          <Button
            onClick={() => navigate("/expense")}
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
            <h2 className="text-2xl font-semibold">Expense Form</h2>
            <p className="text-xs mb-9 text-muted-foreground">
              Add a new expense.
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
                Expense Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
                
                           
 
                <FormField
                  control={form.control}
                  name="voucher_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voucher Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Voucher Number"
                          {...field}
                          />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="voucher_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voucher Date</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Voucher Date"
                          {...field}
                          type="date"
                         />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="voucher_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voucher Amount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Voucher Amount"
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
          
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">Expense Details</CardTitle>
              <CardDescription>Add your Expense Details</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Table Start */}
              <Table>
                <TableCaption>A list of your products.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Expense Head</TableHead>
                    <TableHead>Amount</TableHead>
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
                              {row.expense_head_id
                                ? expenseHeads.find(
                                    (head) => head.value === row.expense_head_id
                                  )?.label
                                : "Select expense head..."}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search expense heads..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No expense heads found.</CommandEmpty>
                                <CommandGroup>
                                  {expenseHeads.map((head) => (
                                    <CommandItem
                                      key={head.value}
                                      value={head.value.toString()}
                                      onSelect={() => {
                                        const newRows = [...productRows];
                                        newRows[index].expense_head_id = head.value;
                                        newRows[index].isOpen = false;
                                        setProductRows(newRows);
                                        console.log('Updated rows:', newRows);
                                      }}
                                    >
                                      {head.label}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          row.expense_head_id === head.value
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
                          placeholder="Amount"
                          name="amount"
                          value={row.amount}
                          onChange={(e) => {
                            const newRows = [...productRows];
                            newRows[index].amount = e.target.value;
                            setProductRows(newRows);
                          }}
                        />
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            const newRows = productRows.filter((_, i) => i !== index);
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
              onClick={() => navigate("/expense")}
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
