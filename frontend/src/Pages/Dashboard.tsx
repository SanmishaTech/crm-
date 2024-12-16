import React, { useEffect } from "react";
import Sidebar from "@/Dashboard/Sidebar";
import Dashboardcomponent from "@/Components/Dashboard/Dashboard";
import { useLocation } from "react-router-dom";
import Suppliers from "@/Components/Suppliers/Index";
import SuppliersAdd from "@/Components/Suppliers/Add";
import SuppliersEdit from "@/Components/Suppliers/Edit";
import Contacts from "@/Components/Contacts/Index";
import ContactsAdd from "@/Components/Contacts/Add";
import ContactsEdit from "@/Components/Contacts/Edit";
import Clients from "@/Components/Clients/Index";
import ClientsAdd from "@/Components/Clients/Add";
import ClientsEdit from "@/Components/Clients/Edit";
import Leads from "@/Components/Leads/Index";
import LeadsAdd from "@/Components/Leads/Add";
import LeadsEdit from "@/Components/Leads/Edit";
import Departments from "@/Components/Departments/Index";
import DepartmentsDialog from "@/Components/Departments/DepartmentDialog";
import ProductCategories from "@/Components/ProductCategories/Index";
import ProductCategoryDialog from "@/Components/ProductCategories/ProductCategoryDialog";
import Products from "@/Components/Products/Index";
import ProductsAdd from "@/Components/Products/Add";
import ProductsEdit from "@/Components/Products/Edit";
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
        {location.pathname === "/contacts" && <Contacts />}
        {location.pathname === "/contacts/add" && <ContactsAdd />}
        {location.pathname === "/contacts/edit/:id" && <ContactsEdit />}
        {location.pathname === "/clients" && <Clients />}
        {location.pathname === "/clients/add" && <ClientsAdd />}
        {location.pathname === "/clients/edit/:id" && <ClientsEdit />}
        {location.pathname === "/leads" && <Leads />}
        {location.pathname === "/leads/add" && <LeadsAdd />}
        {location.pathname === "/leads/edit/:id" && <LeadsEdit />}
        {location.pathname === "/departments" && <Departments />}
        {location.pathname === "/departments/add" && <DepartmentsDialog />}
        {location.pathname === "/productCategories" && <ProductCategories />}
        {location.pathname === "/productCategories/add" && (
          <ProductCategoryDialog />
        )}
        {location.pathname === "/products" && <Products />}
        {location.pathname === "/products/add" && <ProductsAdd />}
        {location.pathname === "/products/edit/:id" && <ProductsEdit />}
      </main>
    </div>
  );
};

export default Dashboard;
