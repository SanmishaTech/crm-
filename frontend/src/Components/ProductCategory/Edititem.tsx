// components/AddItem.tsx

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
  onAdd: (item: { id: string; name: string }) => void;
  typeofschema: Record<string, string>;
  editid: string;
  setToggleedit: (toggle: boolean) => void;
  toggleedit: boolean;
  editfetch: string;
}

const AddItem: React.FC<AddItemProps> = ({
  onAdd,
  typeofschema,
  editid,
  setToggleedit,
  toggleedit,
  editfetch,
}) => {
  console.log("Edit ID:", editid);
  console.log("Edit Fetch Path:", editfetch);

  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const token = localStorage.getItem("token");
  const [SelectedValue, setSelectedValue] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [handleopen, setHandleopen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [description, setdescription] = useState("");
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetcheditdetails = async () => {
      try {
        const response = await axios.get(`/api/${editfetch}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData(response.data.data.ProductCategory);
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Failed to fetch data.");
      }
    };

    if (editfetch) {
      fetcheditdetails();
    } else {
      console.error("Edit fetch path is undefined");
    }
  }, [editfetch, token]);

  const handleAdd = async () => {
    if (!editid) {
      console.error("Edit ID is undefined");
      return;
    }

    await axios
      .put(`/api/${editid}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        window.location.reload();
      });
    setName("");
    setDate(null);
    setHandleopen(false);
  };

  function capitalizeText(text: string) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addFields = (typeofschema: Record<string, string>) => {
    const allFieldstorender: JSX.Element[] = [];
    Object.entries(typeofschema).map(([key, value]) => {
      if (value === "String") {
        allFieldstorender.push(
          <div className="grid grid-cols-4 items-center gap-4" key={key}>
            <Label htmlFor={key} className="text-right">
              {capitalizeText(key)}
            </Label>
            <Input
              id={key}
              name={key}
              onChange={handleChange}
              placeholder={`Enter ${capitalizeText(key)}`}
              value={formData[key] || ""}
              className="col-span-3"
            />
          </div>
        );
      }
    });
    return allFieldstorender;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full text-start">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>
            Enter the details of the Product Category you want to edit.
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
