import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";

const ImportProductCategoryDialog = ({ handleProductCategoryInvalidateQuery }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/product_categories/template", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Product_Category_Template.xlsx");
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Template download failed", error);
      toast.error("Failed to download template");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/product_categories/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message || "Import successful");
      setOpen(false);
      setFile(null);
      handleProductCategoryInvalidateQuery();
    } catch (error: any) {
      console.error("Import failed", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.Error || "Failed to import categories";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Product Categories</DialogTitle>
          <DialogDescription>
            Download the Excel template, fill it with your product categories, and upload it back here.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">1. Download Template</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadTemplate}
              className="w-fit flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Excel Template
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">2. Upload File</p>
            <Input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {file && (
              <p className="text-xs text-muted-foreground mt-1">
                Selected: {file.name}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? "Importing..." : "Process Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportProductCategoryDialog;
