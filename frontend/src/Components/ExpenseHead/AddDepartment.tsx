//@ts-nocheck
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { usePostData } from "@/lib/HTTP/POST";

// Form Validation Schema
const formSchema = z.object({
  expense_head: z.string().min(1, "Expense Head is required").max(50),
});

// Define the form values type from the schema
type FormValues = z.infer<typeof formSchema>;

const AddDepartment = () => {
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expense_head: "",
    },
  });

  const handleDialogOpen = () => {
    form.reset(); // Reset form when opening
    setError(null); // Clear errors
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  // Add Department mutation function
  const storeDepartmentData = usePostData({
    endpoint: "/api/expense_heads",
    params: {
      onSuccess: (data) => {
        form.reset();
        handleDialogClose();
      },
      onError: (error) => {
        setLoading(false);
        if (error.response?.data?.errors) {
          const serverErrors = error.response.data.errors;
          
          // Handle field-specific errors
          if (serverErrors.expense_head) {
            form.setError("expense_head", {
              type: "manual",
              message: serverErrors.expense_head[0],
            });
          } 
          
          // Set general error message
          if (error.response.data.message) {
            setError(error.response.data.message);
          } else {
            setError("Failed to add Expense Head");
          }
        } else {
          setError("Failed to add Expense Head");
        }
      },
    },
  });

  const onSubmit = (data: FormValues) => {
    setLoading(true);
    setError(null);
    storeDepartmentData.mutate(data);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={handleDialogOpen}
          >
            Add Expense Head
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Expense Head</DialogTitle>
            <DialogDescription>
              Add your Expense Head details here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="bg-red-50 p-2 rounded text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="expense_head"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel className="w-40">Expense Head:</FormLabel>
                    <FormControl className="flex-1">
                      <Input placeholder="Expense Head" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-5">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddDepartment;
