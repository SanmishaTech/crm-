import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; // Adjust import path based on your project structure
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const AlertQuotation = ({ leadId }) => {
  console.log("Lead ID:", leadId);

  const queryClient = useQueryClient();

  const handleGenerateQuotation = async () => {
    try {
      const response = await fetch(`/api/generate_quotation/${leadId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.ok) {
        // Handle successful response
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `Quotation-${leadId}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        queryClient.invalidateQueries({ queryKey: ["lead"] });

        toast.success("Quotation generated and downloaded successfully!");
      } else {
        // Handle error response
        const errorData = await response.json(); // Parse the error response JSON
        if (response.status === 401 && errorData.status === false) {
          toast.error(errorData.errors.error);
        } else {
          toast.error("Failed to generate Quotation");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while generating the quotation.");
    }
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
            Click submit to proceed with generating and downloading the
            quotation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleGenerateQuotation}>
            Submit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertQuotation;
