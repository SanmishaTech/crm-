import React, { useEffect } from "react";
import Sidebar from "@/Dashboard/Sidebar";
import Dashboardcomponent from "@/Components/Dashboard/Dashboard";
import { useLocation } from "react-router-dom";
import Suppliers from "@/Components/Suppliers/Index";
import SuppliersAdd from "@/Components/Suppliers/Add";
import SuppliersEdit from "@/Components/Suppliers/Edit";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const user = localStorage.getItem("user");
  // // const User = JSON.parse(user);
  // const User = user ? JSON.parse(user) : null;

  // useEffect(() => {
  //   if (!User?._id) {
  //     navigate("/");
  //   }
  // }, [location, User]);

  // Get user from localStorage
  //  const user = localStorage.getItem("user");

  //  useEffect(() => {
  //    if (user && user !== "undefined") {
  //      const User = JSON.parse(user);

  //      if (!User._id) {
  //        navigate("/dashboard");  // If _id doesn't exist, navigate to dashboard
  //      } else {
  //        navigate("/");  // If _id exists, navigate to dashboard
  //      }
  //    } else {
  //      console.log("User data is not available.");
  //      navigate("/login");  // If no user data, go to login page
  //    }
  //  }, [user, navigate]);

  return (
    <div className="flex bg-background w-[100vw] h-full relative min-h-screen">
      <div className="min-h-screen relative top-0 bg-accent/40">
        <Sidebar className="min-h-full" />
      </div>
      <main className="w-full flex-1 overflow-hidden ">
        {location.pathname === "/dashboard" && <Dashboardcomponent />}
        {location.pathname === "/suppliers" && <Suppliers />}
        {location.pathname === "/suppliers/add" && <SuppliersAdd />}
        {location.pathname === "/suppliers/edit/:id" && <SuppliersEdit />}
      </main>
    </div>
  );
};

export default Dashboard;
