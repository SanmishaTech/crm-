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
import { useNavigate } from "react-router-dom";
import { usePostData } from "@/lib/HTTP/POST";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Get QueryClient from the context
// Form Schema
const FormSchema = z.object({
  supplier: z
    .string()
    .min(2, { message: "Supplier field must have at least 2 characters." })
    .max(50, {
      message: "Supplier field must have no more than 50 characters.",
    })
    .nonempty({ message: "Supplier field is required." }),

  street_address: z
    .string()
    .min(2, {
      message: "Street Address field must have at least 2 characters.",
    })
    .nonempty({ message: "Street Address field is required." }),
  area: z.string().optional(),
  city: z
    .string()
    .min(2, { message: "City field must have at least 2 characters." })
    .nonempty({ message: "City field is required." }),
  state: z
    .string()
    .min(2, { message: "State field must have at least 2 characters." })
    .nonempty({ message: "State field is required." }),
  pincode: z.string().optional(),
  country: z
    .string()
    .min(2, { message: "Country field must have at least 2 characters." })
    .nonempty({ message: "Country field is required." }),
  gstin: z.string().optional(),
  // .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/, {
  //     message: "Invalid GST Number. Please enter a valid GSTIN. ",
  //   })
  //   .max(15, "GST Number must be exactly 15 characters")
  //   .min(15, "GST Number must be exactly 15 characters"),
  contact_name: z
    .string()
    .min(2, { message: "Contact Name field must have at least 2 characters." })
    .max(50, {
      message: "Contact Name field must have no more than 50 characters.",
    })
    .nonempty({ message: "Contact Name field is required." }),

  department: z.string().optional(),
  designation: z.string().optional(),
  mobile_1: z
    .string()
    .regex(/^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s.-]{5,20}$/, {
      message: "Invalid mobile number format",
    })
    .nonempty({ message: "Mobile number field is required." }),
  mobile_2: z.any().optional(),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .nonempty("Email is required."),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      supplier: "",
      street_address: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      gstin: "",
      contact_name: "",
      department: "",
      designation: "",
      mobile_1: "",
      mobile_2: "",
      email: "",
    },
  });
  const queryClient = useQueryClient();

  const navigate = useNavigate(); // Use For Navigation

  type FormValues = z.infer<typeof FormSchema>;
  const formData = usePostData({
    endpoint: "/api/suppliers",
    params: {
      onSuccess: (data) => {
        console.log("data", data);
        queryClient.invalidateQueries({ queryKey: ["supplier"] });
        navigate("/suppliers");
      },
      onError: (error) => {
        console.log("error", error);

        if (error.response && error.response.data.errors) {
          const serverStatus = error.response.data.status;
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the department_name field
          if (serverStatus === false) {
            if (serverErrors.supplier) {
              form.setError("inventory", {
                type: "manual",
                message: serverErrors.supplier[0], // The error message from the server
              });
              toast.error("The inventory has already been taken.");
            }
          } else {
            setError("Failed to add Inventory"); // For any other errors
          }
        } else {
          setError("Failed to add Inventory");
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
            onClick={() => navigate("/inventory")}
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
              Inventory Form
            </h2>
            <p className="text-sm text-muted-foreground mb-9">
              Add a new Inventory.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-accent/40 border border-border">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Inventory Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Name"
                        {...field}
                        className="bg-background text-foreground border-input"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="bg-accent/40 border border-border">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Inventory/Stock Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Warehouse Number
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Warehouse Number"
                          {...field}
                          type="text"
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Type <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select>
                          <SelectTrigger className="">
                            <SelectValue placeholder="Inventory Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">
                              Bulk or Wholesale Inventory
                            </SelectItem>
                            <SelectItem value="2">
                              Raw Materials Inventory (Components and Parts)
                            </SelectItem>
                            <SelectItem value="3">
                              End-of-Life (EOL) Inventory
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="mobile_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Price
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter price"
                          {...field}
                          type="text"
                          inputMode="numeric"
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        In Stock
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the quantity of stock"
                          {...field}
                          type="text"
                          inputMode="numeric"
                          pattern="\d{10}"
                          maxLength={10}
                          className="bg-background text-foreground border-input"
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
              onClick={() => navigate("/suppliers")}
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
