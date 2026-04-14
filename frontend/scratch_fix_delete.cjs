const fs = require('fs');
const path = require('path');

const files = [
  "src/Components/Replacement/Delete.tsx",
  "src/Components/ProductCategories/Delete.tsx",
  "src/Components/Notepad/Delete.tsx",
  "src/Components/LeadSources/Delete.tsx",
  "src/Components/Inventory/Delete.tsx",
  "src/Components/ExpenseHead/Delete.tsx",
  "src/Components/FollowUps/Delete.tsx",
  "src/Components/Clients/AlertBox.tsx",
  "src/Components/Events/Delete.tsx",
  "src/Components/Expense/AlertBox.tsx",
  "src/Components/Departments/Delete.tsx",
  "src/Components/Employees/Delete.tsx",
  "src/Components/Challans/Delete.tsx",
  "src/Components/Contacts/AlertBox.tsx"
];

for (const file of files) {
  const absolutePath = path.join('d:/dir/crm/frontend', file);
  if (!fs.existsSync(absolutePath)) continue;
  
  // Re-extracting from my previous broken state if needed or just applying new structure
  // The broken state had: useDeleteData("baseEndpoint")
  // and mutate({ endpoint: url, queryKey: "queryKey" })
  
  const oldContent = fs.readFileSync(absolutePath, 'utf8');
  const endpointMatch = oldContent.match(/useDeleteData\("([A-Za-z0-9_-]+)"\)/);
  if (!endpointMatch) continue;
  const baseEndpoint = endpointMatch[1];
  
  const queryKeyMatch = oldContent.match(/queryKey: "([A-Za-z0-9_-]+)"/);
  const queryKey = queryKeyMatch ? queryKeyMatch[1] : baseEndpoint;

  let newContent = `import {
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

export default function AlertDialogbox({ url }: { url: string | number }) {
  const queryClient = useQueryClient();
  const deleteData = useDeleteData({
    endpoint: \`/api/${baseEndpoint}/\${url}\`,
    params: {
      onSuccess: () => {
        toast.success("Deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["${queryKey}"] });
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
`;

  if (file.includes("ProductCategories")) {
    newContent = newContent.replace(
      `export default function AlertDialogbox({ url }: { url: string | number }) {`,
      `export default function AlertDialogbox({ url, handleProductCategoryInvalidateQuery }: { url: string | number; handleProductCategoryInvalidateQuery?: () => void }) {`
    ).replace(
      `toast.success("Deleted successfully");`,
      `toast.success("Deleted successfully"); if (handleProductCategoryInvalidateQuery) handleProductCategoryInvalidateQuery();`
    );
  }

  fs.writeFileSync(absolutePath, newContent);
  console.log(`Fixed ${file}`);
}
