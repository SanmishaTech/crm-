import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";

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
  terms: z.string().optional(),
});

const AlertQuotation = ({ leadId }) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousPdfUrl, setPreviousPdfUrl] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quotation_number: "",
      terms: "",
    },
  });

  // Load the previous PDF URL from localStorage when the component mounts
  useEffect(() => {
    const storedPdfUrl = localStorage.getItem("previousPdfUrl");
    if (storedPdfUrl) {
      setPreviousPdfUrl(storedPdfUrl);
    }
  }, []);

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
        link.target = "_blank"; // Open in a new tab instead of downloading

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Store the previously viewed PDF URL in localStorage
        localStorage.setItem("previousPdfUrl", url);
        setPreviousPdfUrl(url);

        queryClient.invalidateQueries({ queryKey: ["lead"] });

        toast.success(
          `Quotation for ${data.quotation_number} generated and opened successfully!`
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
    <div className="space-y-4">
      {/* Quotation Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full text-sm">Quotation</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to generate the Quotation?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please provide your <strong>Quotation Number</strong> and the{" "}
              <strong>Terms & Condition</strong> before proceeding.
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
                        placeholder="Enter Quotation Number"
                        {...field} // Ensure that field is being passed correctly
                        disabled={isSubmitting}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms & Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Terms and Conditions of the Quotation"
                        className="resize-none"
                        rows={7}
                        {...field}
                      />
                    </FormControl>

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

      {/* Always visible "View Previous Quotation" button */}
      <Button
        onClick={() => {
          if (previousPdfUrl) {
            window.open(previousPdfUrl, "_blank");
          }
        }}
        className="w-full text-sm mt-4"
      >
        {previousPdfUrl ? "View Previous Quotation" : "No Previous Quotation"}
      </Button>
    </div>
  );
};

export default AlertQuotation;
