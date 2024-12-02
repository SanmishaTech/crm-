import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
import AddItem from "./Additem";
import userAvatar from "@/images/Profile.jpg";

export default function Dashboardholiday() {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  const [config, setConfig] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const typeofschema = {
    name: "String",
    description: "String",
  };

  useEffect(() => {
    axios
      .get(`/api/departments`, {
        headers: {
          "Content-Type": "application/json", // Corrected Content-Type header
          Authorization: `Bearer ${token}`, // Using the token from localStorage
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          console.error("Received data is not an array:", response.data);
          setData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      });

    setConfig({
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Department" },
      ],
      searchPlaceholder: "Search Departments...",
      userAvatar: "/path-to-avatar.jpg",
      tableColumns: {
        title: "Department",
        description: "Manage Department and view their details.",
        headers: [
          { label: "Name", key: "name" },
          { label: "Description", key: "description" },
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

  const handleAddProduct = () => {
    console.log("Add Registration clicked");
  };

  const handleExport = () => {
    console.log("Export clicked");
  };

  const handleFilterChange = (filterValue) => {
    console.log(`Filter changed: ${filterValue}`);
  };

  const handleProductAction = (action, product) => {
    console.log(`Action: ${action} on registration:`, product);

    if (action === "edit") {
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
          .delete(`/api/departments/${product._id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          })
          .then((response) => {
            console.log("Delete successful:", response);
            // Update the state instead of reloading
            setData(prevData => prevData.filter((item: any) => item.id !== product._id));
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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading registrations.</div>;
  if (!config) return <div className="p-4">Loading configuration...</div>;

  const mappedTableData =
    Array.isArray(data) && !loading
      ? data.map((item: any) => {
          return {
            _id: item?.id,
            name: item?.name || "Unknown",
            description: item?.description || "No description",
            edit: `departments/${item?.id}`,
            delete: `departments/${item?.id}`,
            editfetch: `departments/${item?.id}`,
          };
        })
      : [];

  return (
    <div className="p-4">
      <Dashboard
        breadcrumbs={config.breadcrumbs}
        searchPlaceholder={config.searchPlaceholder}
        userAvatar={userAvatar}
        tableColumns={config.tableColumns}
        tableData={mappedTableData}
        onAddProduct={handleAddProduct}
        onExport={handleExport}
        onFilterChange={handleFilterChange}
        onProductAction={handleProductAction}
        AddItem={AddItem}
        typeofschema={typeofschema}
      />
    </div>
  );
}
