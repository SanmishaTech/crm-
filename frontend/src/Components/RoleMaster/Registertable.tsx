import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
import AddItem from "./Additem"; // Corrected import path
import userAvatar from "@/images/Profile.jpg";

export default function Dashboardholiday() {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  const [config, setConfig] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Define the schema with various input types
  const typeofschema = {
    name: {
      type: "String",
      label: "Name",
    },
  };

  useEffect(() => {
    // Check if the token exists
    if (!token) {
      setError("User is not authenticated.");
      setLoading(false);
      return;
    }

    // Fetch data from the API
    axios
      .get(`/api/roles`, {
        headers: {
          "Content-Type": "application/json", // Corrected Content-Type header
          Authorization: `Bearer ${token}`, // Using the token from localStorage
        },
      })
      .then((response) => {
        if (response.data.success) {
          // Set the roles data from the API response
          setData(response.data.data.Role);
        } else {
          setError("Failed to retrieve roles.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(
          "Error fetching roles. Please check your token or network connection."
        );
        setLoading(false);
      });

    // Define the dashboard configuration
    setConfig({
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Role Master" },
      ],
      searchPlaceholder: "Search Role...",
      userAvatar: userAvatar,
      tableColumns: {
        title: "Role",
        description: "Manage Role and view their details.",
        headers: [
          { label: "Role", key: "name" },
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
  }, [token]); // Dependency on token instead of User._id

  // Handlers for actions
  const handleAddProduct = () => {
    console.log("Add Parameter Group clicked");
    // The AddItem component now handles the modal, so no additional logic needed here
  };

  const handleExport = () => {
    console.log("Export clicked");
    // Implement export functionality such as exporting data as CSV or PDF
  };

  const handleProductAction = (action: string, product: any) => {
    console.log(`Action: ${action} on product:`, product);
    if (action === "edit") {
      // Navigate to edit page or open edit modal
      // Example: window.location.href = `/parametergroup/update/${product._id}`;
    } else if (action === "delete") {
      // Implement delete functionality, possibly with confirmation
      // Example:
      /*
      if (confirm("Are you sure you want to delete this parameter group?")) {
        axios.delete(`/api/parametergroup/delete/${product._id}`)
          .then(() => {
            // Refresh data
            setData(prevData => prevData.filter(item => item._id !== product._id));
          })
          .catch(err => console.error(err));
      }
      */
    }
  };

  // Handler for adding a new item (optional if parent needs to do something)
  const handleAddItem = (newItem: any) => {
    console.log("New item added:", newItem);
    // Optionally, you can update the data state to include the new item without refetching
    setData((prevData) => [...prevData, newItem]);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!config) return <div className="p-4">Loading configuration...</div>;

  // Map the API data to match the Dashboard component's expected tableData format
  const mappedTableData =
    data && Array.isArray(data)
      ? data.map((item) => {
          return {
            _id: item.id, // Use the role's 'id' as the unique identifier
            name: item.name || "Name not provided", // Display the role's 'name'
            edit: `/roles/${item?._id}`, // Route to the update page
            delete: `/roles${item?._id}`,

            action: "actions", // Placeholder for action buttons
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
        onAddProduct={handleAddProduct}
        onExport={handleExport}
        onProductAction={handleProductAction}
        typeofschema={typeofschema}
        AddItem={() => (
          <AddItem typeofschema={typeofschema} onAdd={handleAddItem} />
        )}
      />
    </div>
  );
}
