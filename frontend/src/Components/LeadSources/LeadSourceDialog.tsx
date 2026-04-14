import { useEffect, useState } from "react";
import { usePostData } from "@/lib/HTTP/POST";
import { usePutData } from "@/lib/HTTP/PUT";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LeadSourceDialog = ({
  loading,
  setLoading,
  setOpen,
  open,
  editLeadSource,
  setEditLeadSource,
  setError,
  form,
  handleInvalidateQuery,
}) => {
  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEditLeadSource(null);
    form.reset({
      source_title: "",
      source_name: "",
    });
  };

  // Post Data
  const storeLeadSourceData = usePostData({
    endpoint: "/api/lead_sources",
    params: {
      onSuccess: (data) => {
        handleInvalidateQuery();
        form.reset();
        handleDialogClose();
      },
      onError: (error) => {
        if (error.response && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          if (serverErrors.source_name) {
            form.setError("source_name", {
              type: "manual",
              message: serverErrors.source_name[0],
            });
          }
          if (serverErrors.source_title) {
            form.setError("source_title", {
              type: "manual",
              message: serverErrors.source_title[0],
            });
          }
        } else {
          setError("Failed to add lead source");
        }
      },
    },
  });

  // Update Data
  const updateLeadSourceData = usePutData({
    endpoint: `/api/lead_sources/${editLeadSource?.id}`,
    params: {
      onSuccess: (data) => {
        handleInvalidateQuery();
        form.reset();
        handleDialogClose();
      },
      onError: (error) => {
        setError("Failed to update lead source");
      },
    },
  });

  const onSubmit = (data) => {
    if (editLeadSource) {
      updateLeadSourceData.mutate(data);
    } else {
      storeLeadSourceData.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleDialogOpen}>
          {editLeadSource ? "Edit Lead Source" : "Add Lead Source"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editLeadSource ? "Edit Lead Source" : "Add Lead Source"}
          </DialogTitle>
          <DialogDescription>
            {editLeadSource
              ? "Edit your lead source details here. Click save when you're done."
              : "Add your lead source details here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="source_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source Title:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a title" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="India Mart">India Mart</SelectItem>
                      <SelectItem value="Just Dial">Just Dial</SelectItem>
                      <SelectItem value="Trade India">Trade India</SelectItem>
                      <SelectItem value="Direct Inquiry">Direct Inquiry</SelectItem>
                      <SelectItem value="Contractor/Interior">Contractor/Interior</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source Name:</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter specific source name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-5">
              <Button type="submit">
                {editLeadSource ? "Save changes" : "Add Source"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadSourceDialog;
