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
  challan_number: z.string().optional(),
  items: z.string().optional(),
  purpose: z.string().optional(),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      challan_number: "",
      items: "",
      purpose: "",
    },
  });
  const queryClient = useQueryClient();

  const navigate = useNavigate(); // Use For Navigation

  type FormValues = z.infer<typeof FormSchema>;
  const formData = usePostData({
    endpoint: "/api/challans",
    params: {
      onSuccess: (data) => {
        console.log("data", data);
        queryClient.invalidateQueries({ queryKey: ["challans"] });
        navigate("/challans");
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
            <h2 className="text-2xl font-semibold text-foreground">Note</h2>
            <p className="text-sm text-muted-foreground mb-9">
              Add a new note.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-accent/40 border border-border">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground flex justify-between items-center">
                <span>Note Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="items"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Items</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Items"
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
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Purpose</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Purpose"
                          {...field}
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
