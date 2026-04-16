import { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { usePostData } from "@/lib/HTTP/POST";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Form Validation Schema
const formSchema = z.object({
  client: z.string().min(1, "Client name is required").max(50),
});

const AddClients = ({ fetchClients }: { fetchClients: () => void }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: "",
    },
  });

  const handleDialogClose = () => {
    setOpen(false);
    form.reset();
  };

  const storeClientData = usePostData({
    endpoint: "/api/clients",
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        toast.success("Client added successfully");
        handleDialogClose();
        fetchClients();
      },
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    storeClientData.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span
          className="text-sm cursor-pointer text-blue-600 hover:text-blue-800 focus:outline-none font-medium ml-1"
        >
          + Add Clients
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary font-bold">Add Clients</DialogTitle>
          <DialogDescription>
            Add your client's details here. This client will then be available in the dropdown.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Client Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-2">
              <Button type="submit" disabled={storeClientData.isPending}>
                {storeClientData.isPending ? "Adding..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClients;
