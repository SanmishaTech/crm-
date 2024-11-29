import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
import AddItem from "./Additem"; // Corrected import path
import userAvatar from "@/images/Profile.jpg";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import EditItem from "./Edititem";

export default function Dashboardholiday() {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  const [config, setConfig] = useState<any>(null);
  const [data, setData] = useState<any[]>([]); // Ensure this is an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [parameter, setParameter] = useState<any[]>([]);
  const [parameterGroup, setParameterGroup] = useState<any[]>([]);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(`/api/departments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response.data);
        // Ensure data is an array or initialize it as an empty array if not
        setParameter(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDepartment();
  }, []);

  // Define the schema with various input types
  const typeofschema = {
    name: {
      type: "String",
      label: "Name",
    },
    description: {
      type: "String",
      label: "Description",
    },
     
  };

  useEffect(() => {
    // Fetch data from the API
    axios
      .get(`/api/departments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const fetchedData = response.data;
        // Ensure data is an array
        setData(Array.isArray(fetchedData) ? fetchedData : []);
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
        { label: "Department Master" },
      ],
      searchPlaceholder: "Search Department Master...",
      userAvatar: userAvatar, // Use the imported avatar
      tableColumns: {
        title: "Department Master",
        description: "Manage Department Master and view their details.",
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

  // Map the API data to match the Dashboard component's expected tableData format
  console.log("Data:", data);
  const mappedTableData = Array.isArray(data)
    ? data.map((item) => ({
        _id: item._id,
        name: item?.name || "Name not provided",
        description: item?.description || "Description not provided",
         delete: `/departments/${item._id}`,
        action: "actions",
      }))
    : [];

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading parameters.</div>;
  if (!config) return <div className="p-4">Loading configuration...</div>;

  // Render the department data with schema dynamically
  const renderDepartmentFields = (department: any) => {
    return Object.keys(typeofschema).map((fieldKey) => {
      const schema = typeofschema[fieldKey];
      const fieldValue = department[fieldKey] || "Not Available"; // Fallback text if value is missing

      return (
        <div key={fieldKey} className="flex items-center space-x-2 mb-2">
          <span className="font-semibold">{schema.label}:</span>
          <span>{fieldValue}</span>
        </div>
      );
    });
  };

  const handleProductAction = async (action: string, id: string) => {
    console.log("Action:", action, "ID:", id); // Debug log
    
    if (action === "edit") {
      return <EditItem 
        editid={id} 
        typeofschema={typeofschema} 
        onAdd={() => {
          fetchDepartments(); 
        }} 
      />;
    }
    if (action === "delete") {
      if (window.confirm("Are you sure you want to delete this department?")) {
        try {
          const response = await axios.delete(`/api/departments/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          
          if (response.status === 200) {
            // Update the data state by filtering out the deleted item
            setData(prevData => prevData.filter(item => item._id !== id));
            alert("Department deleted successfully!");
          }
        } catch (error) {
          console.error("Error deleting department:", error);
          alert("Failed to delete department. Please try again.");
        }
      }
    }
  };

  // Add this function to fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`/api/departments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  return (
    <div className="p-4">
      <Dashboard
        breadcrumbs={config.breadcrumbs}
        searchPlaceholder={config.searchPlaceholder}
        userAvatar={config.userAvatar}
        tableColumns={config.tableColumns}
        tableData={mappedTableData} // This should be an array
        onAddProduct={() => {}}
        onExport={() => {}}
        onFilterChange={() => {}}
        onProductAction={handleProductAction}
        typeofschema={typeofschema}
        AddItem={() => <AddItem typeofschema={typeofschema} onAdd={() => {}} />}
      />
      <div className="mt-6">
        {Array.isArray(data) && data?.map((department) => (
          <div key={department?._id} className="border p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">{department?.name}</h2>
            {renderDepartmentFields(department)}
          </div>
        ))}
      </div>
    </div>
  );
}
