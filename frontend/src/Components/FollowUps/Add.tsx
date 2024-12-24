//@ts-nocheck
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

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
import { useGetData } from "@/lib/HTTP/GET";
import { useParams } from "react-router-dom";
import Summary from "./Summary";

// Get QueryClient from the context
// Form Schema
const FormSchema = z.object({
  remark: z.string().optional(),
  follow_up_date: z.string().optional(),
  next_follow_up_date: z.string().optional(),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      remark: "",
      follow_up_date: "",
      next_follow_up_date: "",
    },
  });
  const queryClient = useQueryClient();
  const { id } = useParams();

  const navigate = useNavigate(); // Use For Navigation

  type FormValues = z.infer<typeof FormSchema>;
  const formData = usePostData({
    endpoint: "/api/leads",
    params: {
      onSuccess: (data) => {
        console.log("data", data);
        queryClient.invalidateQueries({ queryKey: ["supplier"] });
        navigate("/leads");
      },
      onError: (error) => {
        console.log("error", error);

        if (error.message && error.message.includes("duplicate supplier")) {
          toast.error("Supplier name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to submit the form. Please try again.");
        }
      },
    },
  });

  const leadData = useGetData({
    endpoint: `/api/leads/${id}`,
    params: {
      queryKey: ["leads"],
      retry: 1,
      onSuccess: (data) => {
        if (data?.data?.Lead) {
          setLeads(data.data.Lead);
        }
      },
    },
    enabled: !!id,
  });

  const onSubmit = async (data: FormValues) => {
    formData.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-12">
      <h2 className="text-2xl font-semibold   text-center">Follow Up Form</h2>
      <p className="text-center text-xs mb-9">
        Add a Follow Up to the database.
      </p>
      <h2 className="text-xl font-semibold text-left">Follow Up</h2>
      {/* Form Fields */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Feilds First Row */}
          <Summary leads={leads} />
          <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="follow_up_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Follow Up Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>Select the Follow Up Date.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="next_follow_up_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Follow Up Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Select the Next Follow Up Date.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            {" "}
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark</FormLabel>
                  <FormControl>
                    <Textarea
                      className="justify-left"
                      placeholder="Enter Remark"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter the Remark.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}{" "}
          {/* Error Message */}
          {/* Buttons For Submit and Cancel */}
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => navigate("/leads")}
              className="align-self-center"
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" className="align-self-center hover:pointer">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
