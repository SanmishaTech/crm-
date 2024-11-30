import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
import AddItem from "./Additem";
import userAvatar from "@/images/Profile.jpg";
 
export default function Dashboardholiday() {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
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
      .get(`/api/container/allcontainer`)
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
          { label: "Department", key: "one" },
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
      // Implement delete functionality, possibly with confirmation
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading registrations.</div>;
  if (!config) return <div className="p-4">Loading configuration...</div>;

 
  const mappedTableData =
    Array.isArray(data) && !loading
      ? data.map((item) => {
          const services = item?.services || [];
          const paidAmount = item?.paymentMode?.paidAmount || 0;

           const totalServicePrice = services.reduce((acc, service) => {
            const servicePrice = service?.serviceId?.price || 0;  
            return acc + servicePrice;
          }, 0);

         
          const balanceAmount =
            totalServicePrice - paidAmount > 0
              ? totalServicePrice - paidAmount
              : 0;
          return {
            _id: item?._id,
            one: item?.container || "Unknown",
            edit: `container/update/${item?._id}`,
            delete: `container/delete/${item?._id}`,
            editfetch: `container/reference/${item?._id}`,
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
