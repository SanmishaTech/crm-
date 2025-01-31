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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  //   quotation_number: z.string().min(2, {
  //     message: "Quotation number must be at least 2 characters.",
  //   }),
  quotation_number: z.string().optional(),
  terms: z.string().optional(),
});

const Report = ({ leadId }) => {
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
          setPreviousPdfUrl(leadData?.lead_quotation || null);
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
        setPreviousPdfUrl(leadData?.lead_quotation || null);
      } catch (error) {
        console.error("Error fetching lead details:", error);
      }
    };
    if (leadId) fetchLeadDetails();
  }, [leadId]);

  const handleGenerateQuotation = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/generate_lead_report/${leadId}`, {
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="w-full text-sm">
            Report
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to generate or view the Report?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please provide your <strong>Report Number</strong> and the{" "}
              <strong>Terms & Condition</strong> before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="quotation_number"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter Report Number"
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
                  name="quotation_number"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>To</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter Report Number"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="lead_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Lead Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover text-popover-foreground max-h-[250px] overflow-y-auto p-0">
                           <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="Inprogress">In Progress</SelectItem>
                          <SelectItem value="Quotation">Quotation</SelectItem>
                          <SelectItem value="Deal">Deal</SelectItem>
                          <SelectItem value="Close">Close</SelectItem>

                        
                        </SelectContent>
                      </Select>
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
                  {isSubmitting ? "Viewing Report..." : "View Report"}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Report;
