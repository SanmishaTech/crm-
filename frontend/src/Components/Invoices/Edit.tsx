import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { toast } from "sonner";
import { useGetData } from "@/lib/HTTP/GET";
import { usePutData } from "@/lib/HTTP/PUT";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Form validation schema
const formSchema = z.object({
  dispatch_details: z.string().optional(),
  payment_information: z.string().optional(),
  // .min(2, { message: "Supplier field must have at least 2 characters." })
  // .max(50, {
  //   message: "Supplier field must have no more than 50 characters.",
  // })
  // .nonempty({ message: "Supplier field is required." }),
});

// Move FormValues type definition outside the component
type FormValues = z.infer<typeof formSchema>;

export default function EditSupplierPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dispatch_details: "",
    },
  });

  // Move the usePutData hook before any conditional returns
  const fetchData = usePutData({
    endpoint: `/api/invoices/${id}`,

    params: {
      onSuccess: (data) => {
        console.log("editdata", data);
        queryClient.invalidateQueries({ queryKey: ["editInvoice"] });
        queryClient.invalidateQueries({ queryKey: ["editInvoice", id] });
        toast.success("Invoice updated successfully");
        navigate("/invoices");
      },
      onError: (error) => {
        toast.error("Failed to submit the form. Please try again.");
      },
    },
  });

  const {
    data: editData,
    isLoading,
    isError,
  } = useGetData({
    endpoint: `/api/invoices/${id}`,
    params: {
      queryKey: ["editInvoice", id],
      retry: 1,

      onSuccess: (data) => {
        console.log("GetData", data);
        setData(data?.Invoice);
        setLoading(false);
      },
      onError: (error) => {
        toast.error("Failed to fetch invoice data. Please try again.");
      },
      enabled: !!id,
    },
  });

  useEffect(() => {
    console.log("data", editData);
  }, [editData]);

  useEffect(() => {
    if (editData?.data.Invoice) {
      const newData = editData.data.Invoice;
      console.log("newData", newData);
      form.reset({
        dispatch_details: newData.dispatch_details || "",
        payment_information: newData.payment_information || "",
      });
    }
  }, [editData, form]);

  const onSubmit = (data: FormValues) => {
    fetchData.mutate(data);
    queryClient.invalidateQueries({ queryKey: ["invoices"] });
    queryClient.invalidateQueries({ queryKey: ["invoices", id] });
  };

  if (isLoading) {
    return (
      <div className="mx-auto p-6 mt-12">
        <div className="flex items-center justify-between w-full">
          <div className="mb-7">
            <Button
              onClick={() => navigate("/invoices")}
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
              <h2 className="text-2xl font-semibold">Invoice Form</h2>
            </div>
          </div>
        </div>
        <Card className="bg-accent/40">
          <CardHeader className="text- justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">
              <Skeleton className="h-6 w-40" /> {/* Skeleton for Title */}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <Skeleton className="h-10 w-full" />{" "}
              {/* Skeleton for Input Field */}
              <Skeleton className="h-10 w-32" /> {/* Skeleton for Button */}
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end space-x-4 mt-6">
          <Skeleton className="w-24 h-10 bg-gray-400 rounded-md" />
          <Skeleton className="w-24 h-10 bg-gray-400 rounded-md" />
        </div>
      </div>
    );
  }
  if (isError) {
    return <div>Error fetching data. Please try again.</div>;
  }

  return (
    <div className=" mx-auto p-6  mt-12">
      <div className="flex items-center justify-between w-full">
        <div className="mb-7">
          <Button
            onClick={() => navigate("/invoices")}
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
            <h2 className="text-2xl font-semibold">Invoice Form</h2>
          </div>
        </div>
      </div>
      {/* Form Fields */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Feilds First Row */}
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Invoice Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="dispatch_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dispatch Details</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter dispatch details"
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
              <CardTitle className="text-xl font-semibold">
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="payment_information"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Enter Payment Information"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          {error && <div className="text-red-500">{error}</div>}{" "}
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => navigate("/invoices")}
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
