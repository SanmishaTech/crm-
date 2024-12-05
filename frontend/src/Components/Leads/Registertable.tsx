// components/Dashboardholiday.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
// import AddItem from "./Additem"; // Corrected import path
import userAvatar from "@/images/Profile.jpg";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const AddItem = () => {
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/leads/add");
  };
  return (
    <Button onClick={handleAdd} variant="outline">
      Add Item
    </Button>
  );
};
const Edititem = (id: string) => {
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate(`/leads/edit/${id?.id}`);
  };
  return (
    <Button onClick={handleAdd} variant="ghost" className="w-full">
      Edit Item
    </Button>
  );
};

export default function Dashboardholiday() {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  const [config, setConfig] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [parameter, setParameter] = useState<any[]>([]);
  const [parameterGroup, setParameterGroup] = useState<any[]>([]);
  const [test, setTest] = useState<any[]>([]);

  // Define the schema with various input types
  useEffect(() => {
    console.log("This is parameter", parameter);
    console.log("This is parameterGroup", parameterGroup);
    console.log("This is test", test);
  }, [parameter, parameterGroup, test]);
  const typeofschema = {
    // sortBy: { type: "Number", label: "Sort By" },
    // date: { type: "Date", label: "Date" },
    // category: {
    //   type: "Select",
    //   label: "Category",
    //   options: [
    //     { value: "category1", label: "Category 1" },
    //     { value: "category2", label: "Category 2" },
    //     // Add more options as needed
    //   ],
    // },
    // isActive: { type: "Checkbox", label: "Is Active" },
    isbol: { type: "Checkbox", label: "Is bol" },
    // Add more fields as needed
  };

  useEffect(() => {
    // Fetch data from the API
    axios
      .get(`/api/leads`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.data.Leads);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      });

    // Define the dashboard configuration
    setConfig({
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Leads" },
      ],
      searchPlaceholder: "Search Leads...",
      userAvatar: userAvatar, // Use the imported avatar
      tableColumns: {
        title: "Leads",
        description: "Manage Leads and view their details.",
        headers: [
          { label: "Lead Name", key: "firstName" },
          { label: "Company", key: "company" },
          { label: "Email", key: "email" },
          { label: "Phone", key: "mobile" },
          { label: "Lead Source", key: "leadSource" },
          { label: "Action", key: "action" },
        ],
        actions: [
          { label: "Edit", value: "edit" },
          { label: "Delete", value: "delete" },
        ],
        pagination: {
          from: 1,
          to: 10,
          total: 32,
        },
      },
    });
  }, [User?._id]);

  // Handlers for actions
  const handleAddProduct = () => {
    console.log("Add Parameter Group clicked");
    // The AddItem component now handles the modal, so no additional logic needed here
  };

  const handleExport = () => {
    console.log("Export clicked");
    // Implement export functionality such as exporting data as CSV or PDF
  };

  const handleFilterChange = (filterValue: string) => {
    console.log(`Filter changed: ${filterValue}`);
    // Implement filtering logic here, possibly refetching data with filters applied
  };

  const handleProductAction = (action, product) => {
    // console.log(`Action: ${action} on product:`, product);
    if (action === "edit") {
      if (!token) {
        console.error("No authentication token found");
        alert("You must be logged in to edit departments");
        return;
      }
      if (product && product._id) {
        axios
          .put(`/api/leads/${product._id}`, product)
          .then((response) => {
            console.log(response.data);
            setProducts(response.data);
          })
          .catch((error) => {
            console.error("Error updating product:", error);
            alert("Error updating product");
          });
      }

      // Navigate to edit page or open edit modal
    } else if (action === "delete") {
      if (!token) {
        console.error("No authentication token found");
        alert("You must be logged in to delete departments");
        return;
      }

      if (product && product._id) {
        console.log(`Deleting department with ID: ${product._id}`);
        axios
          .delete(`/api/leads/${product._id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log("Delete successful:", response);
            // Update the state instead of reloading
            setData((prevData) =>
              prevData.filter((item: any) => item.id !== product._id)
            );
          })
          .catch((error) => {
            console.error("Error deleting department:", error);
            if (error.response?.status === 401) {
              alert("Unauthorized: Please log in again");
              // Optionally redirect to login page or handle token expiration
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            } else {
              alert("Failed to delete department. Please try again.");
            }
          });
      } else {
        console.error("Product ID is undefined");
      }
    }
  };

  // Handler for adding a new item (optional if parent needs to do something)
  const handleAddItem = (newItem: any) => {
    console.log("New item added:", newItem);
    // Optionally, you can update the data state to include the new item without refetching
    setData((prevData) => [...prevData, newItem]);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading parameters.</div>;
  if (!config) return <div className="p-4">Loading configuration...</div>;

  // Map the API data to match the Dashboard component's expected tableData format
  const mappedTableData =
    Array.isArray(data) && !loading
      ? data.map((item) => {
          return {
            _id: item?.id || item?._id, // Fallback to _id if id is missing
            firstName: item?.firstName || "Unknown",
            company: item?.company || "No description",
            email: item?.email || "Unknown",
            mobile: item?.mobile || "Unknown",
            leadSource: item?.leadSource || "Unknown",
            edit: item?.id ? `leads/${item.id}` : "#",
            delete: item?.id ? `leads/${item.id}` : "#",
            editfetch: item?.id ? `leads/${item.id}` : "#",
          };
        })
      : [];

  return (
    <div className="p-4">
      <Dashboard
        breadcrumbs={config.breadcrumbs}
        searchPlaceholder={config.searchPlaceholder}
        userAvatar={config.userAvatar}
        tableColumns={config.tableColumns}
        tableData={mappedTableData}
        Edititem={Edititem}
        onAddProduct={handleAddProduct}
        onExport={handleExport}
        onFilterChange={handleFilterChange}
        onProductAction={handleProductAction}
        typeofschema={typeofschema}
        AddItem={() => (
          <AddItem typeofschema={typeofschema} onAdd={handleAddItem} />
        )}
      />
    </div>
  );
}
