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
  onAdd: (item: { id: string; name: string; description: string }) => void;
  typeofschema: any;
  add: any;
}

const AddItem: React.FC<AddItemProps> = ({ onAdd, typeofschema, add }) => {
  const user = localStorage.getItem("user");
  const User = user ? JSON.parse(user) : null;
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  const [error, setError] = useState("");
  const [handleopen, setHandleopen] = useState(false);
  const [name, setName] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/users`, formData, {
        headers: {
          ContentType: "appication/json",
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
      setName("");
       setHandleopen(false);
    } catch (err) {
      setError("Failed to add users: " + err.message);
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
        <Button variant="outline">Add Users</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Users</DialogTitle>
          <DialogDescription>
            Enter the details of the Users you want to add to the order.
          </DialogDescription>
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
