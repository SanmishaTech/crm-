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

// Form Schema
const FormSchema = z.object({
  voucher_number: z.string().optional(),
  voucher_date: z.string(),
  voucher_amount: z.string(),
});

interface ProductRow {
  expense_head_id: string | number;
  amount: string;
  isOpen: boolean;
}

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

export default function EditExpensePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [expenseHeads, setExpenseHeads] = useState<Array<{value: number, label: string}>>([]);
  const [productRows, setProductRows] = useState<ProductRow[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      voucher_number: "",
      voucher_date: "",
      voucher_amount: "",
    },
  });

  // Fetch expense heads
  const { data: expenseHeadsData } = useGetData({
    endpoint: "/api/all_expense_heads",
    params: {
      queryKey: ["expenseHeads"],
      retry: 1,
      onError: (error) => {
        toast.error("Failed to fetch expense heads.");
      },
    },
  });

  // Fetch expense details for editing
  const { data: editData } = useGetData({
    endpoint: `/api/expenses/${id}`,
    params: {
      queryKey: ["editExpense", id],
      retry: 1,
      onSuccess: (data) => {
        if (data?.data?.Expense) {
          const expense = data.data.Expense;
          // Set form values
          form.reset({
            voucher_number: expense.voucher_number || "",
            voucher_date: expense.voucher_date || "",
            voucher_amount: expense.voucher_amount || "",
          });

          // Set expense details rows
          if (expense.expense_details) {
            const details = expense.expense_details.map((detail: any) => ({
              expense_head_id: detail.expense_head_id,
              amount: detail.amount,
              isOpen: false
            }));
            setProductRows(details);
          }
        }
      },
      onError: (error) => {
        toast.error("Failed to fetch expense data");
      },
      enabled: !!id,
    },
  });

  // Update expense heads when data is loaded
  useEffect(() => {
    if (expenseHeadsData?.data?.ExpenseHead) {
      const mappedHeads = expenseHeadsData.data.ExpenseHead.map((head) => ({
        value: head.id,
        label: head.expense_head
      }));
      setExpenseHeads(mappedHeads);
    }
  }, [expenseHeadsData]);

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const payload = {
      ...data,
      expense_details: productRows
        .filter((row) => row.expense_head_id && row.amount)
        .map(row => ({
          expense_head_id: Number(row.expense_head_id),
          amount: Number(row.amount)
        }))
    };

    try {
      const response = await fetch(`/api/expense/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("Expense updated successfully");
        queryClient.invalidateQueries({ queryKey: ["expense"] });
        navigate("/expense");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update expense");
      }
    } catch (error) {
      toast.error("Error updating expense");
    }
  };

  const addRow = () => {
    setProductRows([
      ...productRows,
      { expense_head_id: "", amount: "", isOpen: false },
    ]);
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
              <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4">
                
                           
 
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
                                    (head) => head.value === Number(row.expense_head_id)
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
