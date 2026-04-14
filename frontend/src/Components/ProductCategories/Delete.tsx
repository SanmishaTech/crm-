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
import { useDeleteData } from "@/lib/HTTP/DELETE";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AlertDialogbox({ url, handleProductCategoryInvalidateQuery }: { url: string | number; handleProductCategoryInvalidateQuery?: () => void }) {
  const queryClient = useQueryClient();
  const deleteData = useDeleteData({
    endpoint: `/api/product_categories/${url}`,
    params: {
      onSuccess: () => {
        toast.success("Deleted successfully"); if (handleProductCategoryInvalidateQuery) handleProductCategoryInvalidateQuery();
        queryClient.invalidateQueries({ queryKey: ["product_categories"] });
      },
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full text-sm">
          Delete
        </Button>
      </AlertDialogTrigger>
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
