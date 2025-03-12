//@ts-nocheck
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { usePutData } from "@/lib/HTTP/PUT";
import { toast } from "sonner";

// Form Validation Schema - lowercase to match usage
const formSchema = z.object({
  expense_head: z.string().min(1, "Expense Head is required").max(50),
});

// Define form values type correctly
type FormValues = z.infer<typeof formSchema>;

const DepartmentDialog = ({
  loading,
  setLoading,
  open,
  form,
  setOpen,
  editDepartment,
  setEditDepartment,
  fetchDepartments,
  handleInvalidateQuery,
}) => {
  // Add Department mutation function
  const storeDepartmentData = usePostData({
    endpoint: "/api/expense_heads",
    params: {
      onSuccess: (data) => {
        console.log("Success:", data);
        form.reset();
        handleInvalidateQuery();
        handleDialogClose();
        toast.success("Expense Head added successfully");
      },
      onError: (error) => {
        console.log("Error details:", {
          response: error.response,
          data: error.response?.data,
          status: error.response?.status
        });
        
        setLoading(false);
        if (error.response?.data?.errors) {
          const serverErrors = error.response.data.errors;
          
          // Handle field-specific errors
          if (serverErrors.expense_head) {
            const errorMessage = Array.isArray(serverErrors.expense_head) 
              ? serverErrors.expense_head[0] 
              : serverErrors.expense_head;
              
            form.setError("expense_head", {
              type: "manual",
              message: errorMessage,
            });
            
            toast.error(errorMessage);
          } else {
            toast.error("Failed to add Expense Head");
          }
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to add Expense Head");
        }
      },
    },
  });

  //update department mutation function
  const updateDepartmentData = usePutData({
    endpoint: `/api/expense_heads/${editDepartment?.id}`,
    params: {
      onSuccess: (data) => {
        setEditDepartment(null);
        form.reset();
        handleInvalidateQuery();
        handleDialogClose();
        setLoading(false);
        toast.success("Expense Head updated successfully");
      },
      onError: (error) => {
        setLoading(false);
        if (error.response?.data?.errors) {
          const serverErrors = error.response.data.errors;
          
          if (serverErrors.expense_head) {
            const errorMessage = Array.isArray(serverErrors.expense_head) 
              ? serverErrors.expense_head[0] 
              : serverErrors.expense_head;
              
            form.setError("expense_head", {
              type: "manual",
              message: errorMessage,
            });
            
            toast.error(errorMessage);
          } else {
            toast.error("Failed to update Expense Head");
          }
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to update Expense Head");
        }
      },
    },
  });

  // onSubmit function
  const onSubmit = (data) => {
    console.log("Form data submitted:", data);
    console.log("Form state:", form.formState);
    
    // Client-side validation
    if (!data.expense_head || data.expense_head.trim() === '') {
      console.log("Validation failed - Expense Head is required");
      form.setError('expense_head', {
        type: 'manual',
        message: 'Expense Head is required'
      });
      return;
    }
    
    // Trim data
    const trimmedData = {
      expense_head: data.expense_head.trim()
    };
    
    console.log("Sending data to API:", trimmedData);
    
    if (editDepartment) {
      setLoading(true);
      updateDepartmentData.mutate(trimmedData);
    } else {
      setLoading(true);
      storeDepartmentData.mutate(trimmedData);
    }
  };

  const handleDialogOpen = () => {
    setEditDepartment(null);
    form.reset();
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            // Reset form and errors when dialog closes
            form.reset();
          }
          setOpen(isOpen);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" onClick={handleDialogOpen}>
            Add Department
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editDepartment ? "Edit" : "Add"} Expense Head
            </DialogTitle>
            <DialogDescription>
              {editDepartment ? "Edit" : "Add"} your expense head details here.
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="expense_head"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel className="w-40">Expense Head:</FormLabel>
                    <FormControl className="flex-1">
                      <Input 
                        placeholder="Expense Head" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          form.clearErrors('expense_head');
                        }}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-5">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      {editDepartment ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepartmentDialog;
