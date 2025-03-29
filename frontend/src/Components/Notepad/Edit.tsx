import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { toast } from "sonner";
import { useGetData } from "@/lib/HTTP/GET";
import { usePutData } from "@/lib/HTTP/PUT";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Form validation schema
const formSchema = z.object({
  note_title: z.string().optional(),
  note_content: z.string().optional(),
});

// Move FormValues type definition outside the component
type FormValues = z.infer<typeof formSchema>;

export default function EditSupplierPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note_title: "",
      note_content: "",
    },
  });

  // Move the usePutData hook before any conditional returns
  const fetchData = usePutData({
    endpoint: `/api/notepads/${id}`,

    params: {
      onSuccess: (data) => {
        console.log("editdata", data);
        queryClient.invalidateQueries({ queryKey: ["notepad"] });
        queryClient.invalidateQueries({ queryKey: ["notepad", id] });
        toast.success("Notepad updated successfully");
        navigate("/notepad");
      },
      onError: (error) => {
        if (error.response && error.response.data.errors) {
          const serverStatus = error.response.data.status;
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the department_name field
          if (serverStatus === false) {
            if (serverErrors.supplier) {
              form.setError("notepad", {
                type: "manual",
                message: serverErrors.notepad[0], // The error message from the server
              });
              toast.error("The notepad has already been taken.");
            }
          } else {
            setError("Failed to add notepad"); // For any other errors
          }
        } else {
          setError("Failed to add notepad");
        }
      },
    },
  });

  const {
    data: editData,
    isLoading,
    isError,
  } = useGetData({
    endpoint: `/api/notepads/${id}`,
    params: {
      queryKey: ["notepad", id],
      retry: 1,

      onSuccess: (data) => {
        console.log("GetData", data);
        setData(data?.Notepad);
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("Duplicate Notepad")) {
          toast.error(
            "Notepad number is duplicated. Please use a unique number."
          );
        } else {
          toast.error("Failed to fetch supplier data. Please try again.");
        }
      },
      enabled: !!id,
    },
  });

  useEffect(() => {
    console.log("data", editData);
  }, [editData]);

  useEffect(() => {
    if (editData?.data.Notepad) {
      const newData = editData.data.Notepad;
      console.log("newData", newData);
      form.reset({
        note_title: newData.note_title || "",
        note_content: newData.note_content || "",
      });
    }
  }, [editData, form]);

  const onSubmit = (data: FormValues) => {
    fetchData.mutate(data);
    queryClient.invalidateQueries({ queryKey: ["notepad"] });
    queryClient.invalidateQueries({ queryKey: ["notepad", id] });
  };

  if (isLoading) {
    return (
      <div className="p-6 mx-auto">
        <div className="flex items-center justify-between w-full">
          <div className="mb-7">
            <Button
              onClick={() => navigate("/notepad")}
              variant="ghost"
              className="mr-4"
              type="button"
            >
              <ChevronLeft />
              Back
            </Button>
          </div>
          <div className="flex-1 mr-9 text-center">
            <div className="-ml-4">
              <h2 className="text-2xl font-semibold">Edit Note</h2>
              <p className="text-xs mb-9 text-muted-foreground">
                Edit/Update the Note.
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="bg-accent/40">
              <CardHeader className="text- justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold">
                  Supplier Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-accent/40">
              <CardHeader className="text- justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold">
                  GST Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/40">
              <CardHeader className="text- justify-between space-y-0 pb-2">
                <CardTitle className=" text-xl  font-semibold">
                  Contact Supplier
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-accent/40">
              <CardHeader className="text- justify-between space-y-0 pb-2">
                <CardTitle className=" text-xl  font-semibold">
                  Supplier Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end space-x-4 mt-6">
              <Skeleton className="w-24 h-10 bg-gray-400 rounded-md" />
              <Skeleton className="w-24 h-10 bg-gray-400 rounded-md" />
            </div>
          </form>
        </Form>
      </div>
    );
  }
  if (isError) {
    return <div>Error fetching data. Please try again.</div>;
  }

  return (
    <div className="mx-auto p-6 bg-background border border-border shadow-lg rounded-lg">
      <div className="flex items-center justify-between w-full">
        <div className="mb-7">
          <Button
            onClick={() => navigate("/notepad")}
            variant="ghost"
            className="mr-4 text-foreground hover:text-foreground/80 hover:bg-accent"
            type="button"
          >
            <ChevronLeft className="text-foreground" />
            Back
          </Button>
        </div>
        <div className="flex-1 mr-9 text-center">
          <div className="-ml-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Edit Note
            </h2>
            <p className="text-xs mb-9 text-muted-foreground">
              Update the Note details.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-accent/40 border border-border">
            <CardHeader className="justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground flex justify-between items-center">
                <span>Note Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="note_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Note Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Items"
                          {...field}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="note_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Note Content
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Purpose"
                          {...field}
                          className="bg-background text-foreground border-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {error && <div className="text-destructive">{error}</div>}

          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => navigate("/notepad")}
              variant="outline"
              className="text-foreground hover:text-foreground/80 hover:bg-accent"
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
