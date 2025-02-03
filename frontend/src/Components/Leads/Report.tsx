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
} from "@/components/ui/alert-dialog";
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
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});

// Add type for form data
type FormData = {
  from_date: string;
  to_date: string;
};

// Add type for props
interface ReportProps {
  leadId: string;
}

const Report = ({ leadId }: ReportProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_date: "",
      to_date: "",
    },
  });

  const handleGenerateReport = async (
    data: FormData,
    type: "excel" | "pdf"
  ) => {
    setIsSubmitting(true);
    try {
      // Build query params including dates
      const params = new URLSearchParams({
        type: type,
        ...(data.from_date && { from_date: data.from_date }),
        ...(data.to_date && { to_date: data.to_date }),
      });

      const response = await fetch(
        `/api/generate_lead_report/${leadId}?${params}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.target = "_blank";

        // Set filename based on type
        const extension = type === "excel" ? ".xlsx" : ".pdf";
        const date = new Date();
        const formattedDate = `${String(date.getDate()).padStart(
          2,
          "0"
        )}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${date.getFullYear()}`;
        link.download = `Lead Report (${formattedDate})${extension}`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        queryClient.invalidateQueries({ queryKey: ["lead"] });

        toast.success(`Report generated and downloaded successfully!`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.errors?.error || "Failed to generate report.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while generating the report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: FormData, type: "excel" | "pdf") => {
    await handleGenerateReport(data, type);
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
            <AlertDialogTitle>Generate Report</AlertDialogTitle>
            <AlertDialogDescription>
              Please select the date range for your report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form className="space-y-4">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="from_date"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="From Date"
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
                  name="to_date"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>To</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="To Date"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <AlertDialogFooter className="flex gap-2">
                <AlertDialogCancel disabled={isSubmitting}>
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() =>
                    form.handleSubmit((data) => onSubmit(data, "excel"))()
                  }
                >
                  {isSubmitting ? "Generating Excel..." : "Export to Excel"}
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() =>
                    form.handleSubmit((data) => onSubmit(data, "pdf"))()
                  }
                >
                  {isSubmitting ? "Generating PDF..." : "Export to PDF"}
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
