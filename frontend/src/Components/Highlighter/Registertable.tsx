import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
import AddItem from "./Additem";
import userAvatar from "@/images/Profile.jpg";
import { Button } from "@/components/ui/button";
export default function Dashboardholiday() {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const [config, setConfig] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const typeofschema = {
    patientName: "Checkbox",
    patientId: "Checkbox",
    sid: "Checkbox",
    dateOfAppointment: "Checkbox",
    timeOfAppointment: "Checkbox",
    testName: "Checkbox",
    testAbbreviation: "Checkbox",
    container: "Checkbox",
  };
  useEffect(() => {
    // Fetch data from the API
    axios
      .get(`/api/barcode/allhighlighter`)
      .then((response) => {
        setData(response.data);

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
        { label: "High Lighter Setup" },
      ],
      searchPlaceholder: "Search...",
      userAvatar: "/path-to-avatar.jpg",
      tableColumns: {
        title: "Highlighter",
        description: "Manage Highlighter and view their details.",
        headers: [
          { label: "Patient Name", key: "one" },
          { label: "Patient id", key: "two" },
          { label: "sid", key: "three" },
          { label: "Date of Appointment", key: "four" },
          { label: "Time of Appointment", key: "five" },
          { label: "Test Name", key: "six" },
          { label: "Test Abbreviation", key: "seven" },
          { label: "Container", key: "eight" },
          { label: "Action", key: "action" },
        ],
        // tabs: [
        //   { label: "All", value: "all" },
        //   { label: "Active", value: "active" },
        //   { label: "Completed", value: "completed" },
        // ],
        // filters: [
        //   { label: "Active", value: "active", checked: true },
        //   { label: "Completed", value: "completed", checked: false },
        // ],
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
    console.log("Add Registration clicked");

    // For example, navigate to an add registration page or open a modal
  };

  const handleExport = () => {
    console.log("Export clicked");
    // Implement export functionality such as exporting data as CSV or PDF
  };

  const handleFilterChange = (filterValue) => {
    console.log(`Filter changed: ${filterValue}`);
    // You can implement filtering logic here, possibly refetching data with filters applied
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

  // Ensure data is an array and contains items
  const mappedTableData =
    Array.isArray(data) && data.length > 0
      ? data.map((item) => {
          const services = item?.services || [];
          const paidAmount = item?.paymentMode?.paidAmount || 0;

          // Calculate the total service price based on each service's populated details.
          const totalServicePrice = services.reduce((acc, service) => {
            const servicePrice = service?.serviceId?.price || 0; // Replace 'price' with the actual field name for service price
            return acc + servicePrice;
          }, 0);

          // Calculate balance amount based on total service price and paid amount.
          const balanceAmount =
            totalServicePrice - paidAmount > 0
              ? totalServicePrice - paidAmount
              : 0;

          return {
            _id: item?._id,
            one: item?.patientName,
            two: item?.patientId,
            three: item?.sid,
            four: item?.dateOfAppointment,
            five: item?.timeOfAppointment,
            six: item?.testName,
            seven: item?.testAbbreviation,
            eight: item?.container,
            edit: `/barcode/update/${item?._id}`,
            delete: `/barcode/delete/${item?._id}`,
            editfetch: `/barcode/reference/${item?._id}`,
            // two: item?. || "Unknown",
          };
        })
      : [];
  return (
    <div className="p-4">
      <Dashboard
        breadcrumbs={config.breadcrumbs}
        searchPlaceholder={config.searchPlaceholder}
        userAvatar={userAvatar}
      />
    </div>
  );
}
