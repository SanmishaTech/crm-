import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteData } from "@/lib/HTTP/DELETE";
import { toast } from "sonner";

export default function AlertDialogbox({ url }: { url: string | number }) {
  const queryClient = useQueryClient();
  const deleteData = useDeleteData({
    endpoint: `/api/suppliers/${url}`,
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["supplier"] });
        toast.success("Supplier deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete supplier");
      },
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
      <Button variant="ghost" size="sm" className="w-full text-sm ">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteData.mutate({});
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
