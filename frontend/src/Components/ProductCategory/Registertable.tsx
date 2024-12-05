import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
import AddItem from "./Additem";
import userAvatar from "@/images/Profile.jpg";

export default function Dashboarddepartment() {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const token = localStorage.getItem("token");
  const [config, setConfig] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const typeofschema = {
    name: "String",
  };

  useEffect(() => {
    axios
      .get(`/api/product_categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response?.data?.data?.ProductCategories);
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
        { label: "Product categories" },
      ],
      searchPlaceholder: "Search Departments...",
      userAvatar: "/path-to-avatar.jpg",
      tableColumns: {
        title: "Product Categories",
        description: "Manage Product Categories and view their details.",
        headers: [
          { label: "Name", key: "name" },
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
    // console.log(`Action: ${action} on registration:`, product);

    if (action === "edit") {
      // Navigate to edit page or open edit modal
      if (!token) {
        console.error("No authentication token found");
        alert("You must be logged in to edit departments");
        return;
      }

      if (product && product._id) {
        console.log(`Editing Product Category with ID: ${product._id}`);
        axios
          .get(`/api/product_categories/${product._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log("Response:", response?.data);
            setProduct(response?.data?.data?.ProductCategory);
            setIsEditModalOpen(true);
          })
          .catch((error) => {
            console.error("Error fetching department:", error);
            alert("Error fetching department");
          });
      } else {
        console.log("No product found");
      }
    } else if (action === "delete") {
      if (!token) {
        console.error("No authentication token found");
        alert("You must be logged in to delete departments");
        return;
      }

      if (product && product._id) {
        console.log(`Deleting Product with ID: ${product._id}`);
        axios
          .delete(`/api/product_categories/${product._id}`, {
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
              alert("Failed to delete product. Please try again.");
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
      ? data.map((item) => {
          return {
            _id: item?.id || item?._id, // Fallback to _id if id is missing
            name: item?.name || "Unknown",
            edit: item?.id ? `product_categories/${item.id}` : "#",
            delete: item?.id ? `product_categories/${item.id}` : "#",
            editfetch: item?.id ? `product_categories/${item.id}` : "#",
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
