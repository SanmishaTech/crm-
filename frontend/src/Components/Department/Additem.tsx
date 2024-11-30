import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "axios";

interface AddItemProps {
  onAdd: (item: { id: string; name: string; description: string }) => void;
  typeofschema: any;
  add: any;
}

const AddItem: React.FC<AddItemProps> = ({ onAdd, typeofschema, add }) => {
  const user = localStorage.getItem("user");
  const User = user ? JSON.parse(user) : null;

  const [SelectedValue, setSelectedValue] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [handleopen, setHandleopen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [description, setdescription] = useState("");
  const [formData, setFormData] = useState<any>({});

  const handleAdd = async () => {
    if (!User || !User.token) {
      setError("You are not authenticated. Please log in.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${User.token}`, // Include token in the header
    };

    try {
      // Send request with the token
      await axios.post(`/api/departments`, formData, {
        headers: {
          ContentType: "appication/json",
          Authorization: `Bearer ${User.token}`,
        },
      });
      window.location.reload();
      setName("");
      setDate(null);
      setHandleopen(false);
    } catch (err) {
      setError("Failed to add department: " + err.message);
    }
  };

  function capitalizeText(text: string) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // dynamically set key-value pairs
    }));
  };

  const addFields = (typeofschema: any) => {
    const allFieldsToRender = [];
    Object.entries(typeofschema).forEach(([key, value]) => {
      if (value === "String") {
        allFieldsToRender.push(
          <div className="grid grid-cols-4 items-center gap-4" key={key}>
            <Label htmlFor={key} className="text-right">
              {capitalizeText(key)}
            </Label>
            <Input
              id={key}
              name={key}
              onChange={handleChange}
              value={formData[key] || ""}
              className="col-span-3"
            />
          </div>
        );
      }
    });
    return allFieldsToRender;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Department</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>
            Enter the details of the Department you want to add to the order.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && <p className="text-red-500">{error}</p>}
          {addFields(typeofschema)}
        </div>

        <DialogFooter>
          <Button onClick={handleAdd} type="button">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItem;
