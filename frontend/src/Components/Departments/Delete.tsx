import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteData } from "@/lib/HTTP/DELETE";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AlertDialogbox({
  url,
  open,
  onOpenChange,
}: {
  url: string | number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const endpoint = url === null ? "" : `/api/departments/${url}`;
  const deleteData = useDeleteData({
    endpoint,
    params: {
      onSuccess: () => {
        toast.success("Deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["departments"] });
        onOpenChange(false);
      },
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this record from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!url}
            onClick={() => {
              if (!url) return;
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
