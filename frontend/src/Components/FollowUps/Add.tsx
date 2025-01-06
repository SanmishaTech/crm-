//@ts-nocheck
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import History from "./History";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Get QueryClient from the context
// Form Schema
const FormSchema = z.object({
  remarks: z.string().optional(),
  follow_up_date: z.string().optional(),
  next_follow_up_date: z.string().optional(),
  follow_up_type: z.string().optional(),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const today = new Date().toISOString().split("T")[0];
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      remarks: "",
      follow_up_date: today,
      next_follow_up_date: "",
      follow_up_type: "",
    },
  });
  const queryClient = useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate(); // Use For Navigation

  type FormValues = z.infer<typeof FormSchema>;
  const formData = usePostData({
    endpoint: "/api/follow_ups",
    params: {
      onSuccess: (data) => {
        console.log("data", data);
        queryClient.invalidateQueries({ queryKey: ["followUps"] });
        navigate("/leads");
      },
      onError: (error) => {
        console.log("error", error);

        if (error.message && error.message.includes("duplicate Follow Up")) {
          toast.error(
            "Follow Up name is duplicated. Please use a unique name."
          );
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
    const formDataWithLeadId = { lead_id: id, ...data }; // Combine the lead ID with the form data
    formData.mutate(formDataWithLeadId);
  };

  return (
    <div className="max-w-4xl mx-auto  ">
      <Tabs defaultValue="followUp">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="followUp">Add Follow up</TabsTrigger>
          </TabsList>
          <TabsList>
            <TabsTrigger value="summary">Show Summary</TabsTrigger>
          </TabsList>
          <TabsList>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          className="bg-accent/60 p-4 rounded-lg shadow-lg"
          value="followUp"
        >
          <h2 className="text-2xl font-semibold   text-center">
            Follow Up Form
          </h2>
          <p className="text-center text-xs mb-9">Add a Follow Up.</p>
          {/* Form Fields */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Feilds First Row */}
              <div className="flex justify-center space-x-6 grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="follow_up_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follow Up Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>

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

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="follow_up_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follow Up Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Follow Up Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Call">Call</SelectItem>
                          <SelectItem value="In Person Meet">
                            In Person Meet
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                {" "}
                <FormField
                  control={form.control}
                  name="remarks"
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
                <Button
                  type="submit"
                  className="align-self-center hover:pointer"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="summary">
          <Summary leads={leads} />
        </TabsContent>
        <TabsContent value="history">
          <History leads={leads} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
