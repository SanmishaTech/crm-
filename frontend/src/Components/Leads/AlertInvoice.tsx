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
  invoice_number: z.string().min(2, {
    message: "Quotation number must be at least 2 characters.",
  }),
  mode_of_payment: z.string().optional(),
  ref_no: z.string().optional(),
  other_ref: z.string().optional(),
  buyer_order_no: z.string().optional(),
  buyers_date: z.string().optional(),
  invoice_terms: z.string().optional(),
});

const AlertQuotation = ({ leadId }) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousPdfUrl, setPreviousPdfUrl] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_number: "",
      mode_of_payment: "",
      ref_no: "",
      other_ref: "",
      buyer_order_no: "",
      buyers_date: "",
      invoice_terms: "",
    },
  });

  // Fetch the lead details and get the previous quotation
  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        const response = await fetch(`/api/leads/${leadId}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (response.ok) {
          const leadData = await response.json();
          setPreviousPdfUrl(leadData?.lead_invoice || null);
        } else {
          console.error("Failed to fetch lead details.");
        }
      } catch (error) {
        console.error("Error fetching lead details:", error);
      }
    };

    if (leadId) {
      fetchLeadDetails();
    }
  }, [leadId]);
  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        const response = await fetch(`/api/leads/${leadId}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const leadData = await response.json();
        console.log("Lead Data:", leadData);
        setPreviousPdfUrl(leadData?.lead_invoice || null);
      } catch (error) {
        console.error("Error fetching lead details:", error);
      }
    };
    if (leadId) fetchLeadDetails();
  }, [leadId]);

  const handleGenerateQuotation = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/generate_invoice/${leadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setPreviousPdfUrl(url);

        queryClient.invalidateQueries({ queryKey: ["lead"] });

        toast.success(
          `Quotation for ${data.quotation_number} generated and opened successfully!`
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.errors?.error || "Failed to generate Quotation.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while generating the quotation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    await handleGenerateQuotation(data);
  };

  return (
    <div className="space-y-4">
      {/* Quotation Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="w-full text-sm">
            Invoice
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to generate or view the Quotation?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-grid col-2 space-x-3">
                <FormField
                  control={form.control}
                  name="invoice_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quotation Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Quotation Number"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mode_of_payment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode of Payment</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Mode of Payment"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-grid col-2 space-x-3">
                <FormField
                  control={form.control}
                  name="ref_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Reference Number"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="other_ref"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Reference</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Other Reference"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-grid col-2 space-x-3">
                <FormField
                  control={form.control}
                  name="buyer_order_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buyers Order Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Buyers Order Number"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buyers_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buyers</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="invoice_terms"
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
                  {isSubmitting ? "Viewing Quotation..." : "View Quotation"}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlertQuotation;
