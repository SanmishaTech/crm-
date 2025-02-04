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
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  lead_status: z.string().optional(),
});

// Add type for form data
type FormData = {
  from_date: string;
  to_date: string;
  lead_status: string;
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
      lead_status: "none",
    },
  });

  const handleReset = () => {
    form.reset({
      from_date: "",
      to_date: "",
      lead_status: "none",
    });
  };

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
        ...(data.lead_status &&
          data.lead_status !== "none" && { lead_status: data.lead_status }),
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
        const date = new Date();
        const formattedDate = `${String(date.getDate()).padStart(
          2,
          "0"
        )}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${date.getFullYear()}`;

        if (type === "excel") {
          // For Excel, create a download link
          const link = document.createElement("a");
          link.href = url;
          link.download = `Lead Report (${formattedDate}).xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // For PDF, open in a new tab
          window.open(url, "_blank");
        }

        queryClient.invalidateQueries({ queryKey: ["lead"] });
        toast.success(
          `Report ${type === "excel" ? "downloaded" : "opened"} successfully!`
        );
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
        <AlertDialogContent className="max-w-md w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Report</AlertDialogTitle>
            <AlertDialogDescription>
              Please select the date range for your report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
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
              <div className="flex items-end gap-4">
                <FormField
                  control={form.control}
                  name="lead_status"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Lead Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSubmitting}
                >
                  Reset Filters
                </Button>
              </div>
              <AlertDialogFooter className="flex flex-wrap gap-2">
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
                  {isSubmitting ? "Generating Excel..." : "To Excel"}
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() =>
                    form.handleSubmit((data) => onSubmit(data, "pdf"))()
                  }
                >
                  {isSubmitting ? "Generating PDF..." : "To PDF"}
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
