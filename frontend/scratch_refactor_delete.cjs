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
  if (!fs.existsSync(absolutePath)) {
    console.log(`Skipping ${file} - not found`);
    continue;
  }
  
  let content = fs.readFileSync(absolutePath, 'utf8');
  
  // Extract endpoint
  let baseEndpoint = "";
  const match = content.match(/axios\.delete\(`\/api\/([A-Za-z0-9_-]+)\/\$\{url\}/);
  if (match) {
    baseEndpoint = match[1];
  } else {
    const match2 = content.match(/axios\.delete\(`\/api\/([A-Za-z0-9_-]+)\/` \+ url/);
    if (match2) baseEndpoint = match2[1];
    else {
      console.log(`Skipping ${file} - no endpoint match`);
      continue;
    }
  }

  let queryKeys = [...content.matchAll(/queryKey: \["([A-Za-z0-9_-]+)"\]/g)].map(m => m[1]);
  let queryKey = queryKeys.length > 0 ? queryKeys[0] : baseEndpoint;

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

export default function AlertDialogbox({ url }: { url: string | number }) {
  const { mutate, isPending } = useDeleteData("${baseEndpoint}");

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
              mutate({ endpoint: url, queryKey: "${queryKey}" });
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
  
  // For ProductCategories that has handleProductCategoryInvalidateQuery
  if (file.includes("ProductCategories")) {
    newContent = newContent.replace(
      `export default function AlertDialogbox({ url }: { url: string | number }) {`,
      `export default function AlertDialogbox({ url, handleProductCategoryInvalidateQuery }: { url: string | number; handleProductCategoryInvalidateQuery?: () => void }) {`
    ).replace(
      `mutate({ endpoint: url, queryKey: "${queryKey}" });`,
      `mutate({ endpoint: url, queryKey: "${queryKey}" }, { onSuccess: () => { if (handleProductCategoryInvalidateQuery) handleProductCategoryInvalidateQuery(); } })`
    );
  }

  fs.writeFileSync(absolutePath, newContent);
  console.log(`Updated ${file}`);
}
