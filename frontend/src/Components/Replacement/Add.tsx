//@ts-nocheck
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { usePostData } from "@/lib/HTTP/POST";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Get QueryClient from the context
// Form Schema
const FormSchema = z.object({
  date: z.string().optional(),
  customer_name: z.string().optional(),
  customer_mobile: z.string().optional(),
  customer_email: z.string().optional(),
  customer_address: z.string().optional(),
  instrument: z.string().optional(),
  instrument_number: z.string().optional(),
  invoice_number: z.string().optional(),
  invoice_date: z.string().optional(),
  received_date: z.string().optional(),
  replace: z.string().optional(),
  dispatch: z.string().optional(),
  current_status: z.string().optional(),
  registered: z.string().optional(),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      customer_name: "",
      customer_mobile: "",
      customer_email: "",
      customer_address: "",
      instrument: "",
      instrument_number: "",
      invoice_number: "",
      invoice_date: "",
      received_date: "",
      replace: "",
      dispatch: "",
      mobile_2: "",
      current_status: "",
      registered: "",
    },
  });
  const queryClient = useQueryClient();

  const navigate = useNavigate(); // Use For Navigation

  type FormValues = z.infer<typeof FormSchema>;
  const formData = usePostData({
    endpoint: "/api/replacements",
    params: {
      onSuccess: (data) => {
        console.log("data", data);
        queryClient.invalidateQueries({ queryKey: ["replacements"] });
        navigate("/replacements");
      },
      onError: (error) => {
        console.log("error", error);

        if (error.response && error.response.data.errors) {
          const serverStatus = error.response.data.status;
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the department_name field
          if (serverStatus === false) {
            if (serverErrors.replacements) {
              form.setError("replacements", {
                type: "manual",
                message: serverErrors.replacements[0],
              });
              toast.error("The Customer  has already been taken.");
            }
          } else {
            setError("Failed to add Replacements");
          }
        } else {
          setError("Failed to add Replacements");
        }
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    formData.mutate(data);
  };

  return (
    <div className="mx-auto p-6 bg-background border border-border shadow-lg rounded-lg">
      <div className="flex items-center justify-between w-full">
        <div className="mb-7">
          <Button
            onClick={() => navigate("/replacements")}
            variant="ghost"
            className="mr-4 text-foreground hover:text-foreground/80 hover:bg-accent"
            type="button"
          >
            <ChevronLeft className="text-foreground" />
            Back
          </Button>
        </div>
        <div className="flex-1 mr-9 text-center">
          <div className="-ml-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Replacements & Repairs Form
            </h2>
            <p className="text-sm text-muted-foreground mb-9">
              Add a new replacements & repairs.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-accent/40 border border-border">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground flex justify-between items-center">
                <span>Customer Information</span>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel className="flex-shrink-0 mt-2">
                        Date :
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Customer Name{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Customer Name"
                          {...field}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customer_mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Customer Mobile
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Customer Mobile"
                          {...field}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="customer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Customer Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Customer Email"
                          {...field}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customer_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Customer Address
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Customer Address"
                          {...field}
                          className="bg-background text-foreground border-input  resize-none px-3 py-2"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/40 border border-border">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground flex justify-between items-center">
                Instrument Information
                <FormField
                  control={form.control}
                  name="registered"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel className="flex-shrink-0 mt-2 text-sm ">
                        Registered :
                      </FormLabel>
                      <FormControl className="flex space-x-4">
                        <div className="flex  space-x-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <Input
                              type="radio"
                              id="emd"
                              {...field}
                              value="0"
                              checked={field.value === "0"}
                              className="h-4 w-4"
                            />
                            <label htmlFor="emd-paid">No</label>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Input
                              type="radio"
                              id="emd"
                              {...field}
                              value="1"
                              checked={field.value === "1"}
                              className="h-4 w-4"
                            />
                            <label htmlFor="emd-pending">Yes</label>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="instrument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Instrument Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Instrument Name"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instrument_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Instrument Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Instrument Number"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="replace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="replace">Replace</SelectItem>
                            <SelectItem value="repair">Repair</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoice_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Invoice Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Invoice Number"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="received_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Received Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="dispatch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dispatch">Dispatch</SelectItem>
                            <SelectItem value="handover">Handover</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Current Status
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Current Status"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {error && <div className="text-destructive">{error}</div>}

          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => navigate("/replacements")}
              variant="outline"
              className="text-foreground hover:text-foreground/80 hover:bg-accent"
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              varient="outline"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
