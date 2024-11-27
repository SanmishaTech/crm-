import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Field {
  type: "String" | "Number" | "Date" | "Select" | "Checkbox";
  label?: string;
  options?: { value: string; label: string }[]; // For Select fields
}

interface Schema {
  [key: string]: Field;
}

interface AddItemProps {
  onAdd: (item: any) => void;
  typeofschema: Schema;
}

const AddItem: React.FC<AddItemProps> = ({ onAdd, typeofschema }) => {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");

  const [formData, setFormData] = useState<Record<string, any>>(
    Object.keys(typeofschema).reduce((acc, key) => {
      acc[key] = typeofschema[key].type === "Checkbox" ? false : "";
      return acc;
    }, {} as Record<string, any>)
  );
  const [error, setError] = useState("");
  const [handleopen, setHandleopen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
  
    // Check if the user is authenticated by verifying the token
    const token = localStorage.getItem("token");
  
    if (!token) {
      setError("You are not authenticated. Please log in.");
      setLoading(false);
      return; // Prevent further execution if no token is found
    }
  
    try {
      // Include the token in the Authorization header for the API request
      const response = await axios.post(
        "/api/departments", 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
  
      // Reset the form data and notify the parent component
      onAdd(formData);
      setFormData(Object.keys(typeofschema).reduce((acc, key) => {
        acc[key] = typeofschema[key].type === "Checkbox" ? false : "";
        return acc;
      }, {} as Record<string, any>));
      setHandleopen(false);
      setError("");
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        // Handle unauthorized error (e.g., token expired)
        setError("Authentication failed. Please log in again.");
        localStorage.removeItem("token"); // Clear the invalid token
        window.location.href = "/login"; // Redirect to login page
      } else {
        setError("Failed to add department");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (name: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addFields = (schema: Record<string, any>) => {
    return Object.entries(schema).map(([key, value]) => {
      const label = value.label || capitalizeText(key);
      switch (value.type) {
        case "String":
        case "Number":
          return (
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={key} className="text-right">{label}</Label>
              <Input
                id={key}
                name={key}
                type={value.type.toLowerCase()}
                onChange={(e) => handleChange(key, e.target.value)}
                value={formData[key] || ""}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="col-span-3"
              />
            </div>
          );
        case "Date":
          return (
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={key} className="text-right">{label}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData[key] && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2" />
                    {formData[key] ? format(new Date(formData[key]), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData[key] ? new Date(formData[key]) : null}
                    onSelect={(date) => handleChange(key, date ? date.toISOString() : null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          );
        case "Select":
          return (
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={key} className="text-right">{label}</Label>
              <Select onValueChange={(value) => handleChange(key, value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={`Select ${label.toLowerCase()}`} value={formData[key] || ""} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {value.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          );
        case "Checkbox":
          return (
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={key} className="text-right">{label}</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={formData[key] || false}
                  onCheckedChange={(checked) => handleChange(key, checked)}
                />
              </div>
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <Dialog open={handleopen} onOpenChange={setHandleopen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Department</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>Enter the details of the Department you want to add.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && <p className="text-red-500">{error}</p>}
          {addFields(typeofschema)}
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} type="button" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItem;
