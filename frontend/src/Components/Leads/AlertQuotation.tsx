import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"; // Adjust import path based on your project structure
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const formSchema = z.object({
  quotation_number: z.string().min(2, {
    message: "Quotation number must be at least 2 characters.",
  }),
});

const AlertQuotation = ({ leadId }) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quotation_number: "", // Default value for quotation_number
    },
  });

  const handleGenerateQuotation = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/generate_quotation/${leadId}`, {
        method: "POST", // Corrected method to POST (capitalized)
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data), // Ensure the form data is sent as the body
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `Quotation-${leadId}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        queryClient.invalidateQueries({ queryKey: ["lead"] });

        toast.success(
          `Quotation for ${data.quotation_number} generated and downloaded successfully!`
        );
      } else {
        const errorData = await response.json();
        if (response.status === 401 && errorData.status === false) {
          toast.error(errorData.errors.error);
        } else {
          toast.error("Failed to generate Quotation.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while generating the quotation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data) => {
    console.log("Form Data:", data); // Check form data for debugging
    await handleGenerateQuotation(data);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full text-sm">Quotation</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to download the Quotation?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Please provide your quotation number before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quotation_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quotation Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter quotation number"
                      {...field} // Ensure that field is being passed correctly
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be associated with the generated quotation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>
                Cancel
              </AlertDialogCancel>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertQuotation;
