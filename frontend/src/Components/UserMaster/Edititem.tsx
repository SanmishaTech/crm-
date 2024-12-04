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
import { Button } from "@/components/ui/button";
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
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetcheditdetails = async () => {
      try {
        const response = await axios.get(`/api/${editfetch}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData(response.data.data.User);
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Failed to fetch data.");
      }
    };

    if (editfetch) {
      fetcheditdetails();
    }
  }, [editfetch, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    if (!editid) {
      console.error("Edit ID is undefined");
      return;
    }

    try {
      await axios.put(`/api/${editid}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating item:", error);
      setError("Failed to update item.");
    }
  };

  function capitalizeText(text: string) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

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
              value={formData[key] || ""}
              placeholder={`Enter ${capitalizeText(key)}`}
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
            Enter the details of the item you want to edit.
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
