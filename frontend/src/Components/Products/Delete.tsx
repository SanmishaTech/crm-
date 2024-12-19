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
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export default function AlertDialogbox({ url, fetchProducts }) {
  const queryClient = useQueryClient();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className=" text-red-500 hover:text-red-700 pr-1"
        >
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
            onClick={async () => {
              await axios.delete(`/api/products/${url}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
                },
              });
              fetchProducts();
              queryClient.invalidateQueries({ queryKey: ["supplier"] });
              queryClient.invalidateQueries({ queryKey: ["supplier", url] });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
