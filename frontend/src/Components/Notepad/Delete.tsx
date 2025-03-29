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
import { Trash2 } from "lucide-react"; // Add this import

export default function AlertDialogbox({ url }) {
  const queryClient = useQueryClient();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 hover:bg-destructive/20 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove your data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await axios.delete(`/api/notepads/${url}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
                },
              });
              queryClient.invalidateQueries({ queryKey: ["notepad"] });
              queryClient.invalidateQueries({
                queryKey: ["notepad", url],
              });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
