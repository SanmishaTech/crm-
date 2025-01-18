import React, { useEffect } from "react";
import Sidebar from "@/Dashboard/Sidebar";
import Dashboardcomponent from "@/Components/Dashboard/Dashboard";
import { useLocation, useNavigate } from "react-router-dom";
import Suppliers from "@/Components/Suppliers/Index";
import SuppliersAdd from "@/Components/Suppliers/Add";
import SuppliersEdit from "@/Components/Suppliers/Edit";
import Employees from "@/Components/Employees/Index";
import EmployeesAdd from "@/Components/Employees/Add";
import EmployeesEdit from "@/Components/Employees/Edit";
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
import FollowUps from "@/Components/FollowUps/Add";
import InvoiceComponent from "@/Components/Invoices/Index";
import InvoicesEdit from "@/Components/Invoices/Edit";
import Inventory from "@/Components/Inventory/Index";
import InventoryAdd from "@/Components/Inventory/Add";
import Navbar from "@/Components/Navbar/Navbarcomp";
import Vendors from "@/Components/Vendors/Index";
import VendorAdd from "@/Components/Vendors/Add";
import VendorEdit from "@/Components/Vendors/Edit";
import Purchase from "@/Components/Purchase/Index";
import PurchaseAdd from "@/Components/Purchase/Add";
import PurchaseEdit from "@/Components/Purchase/Edit";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex bg-background w-[100vw] h-full relative min-h-screen overflow-x-hidden">
      <div className="min-h-screen relative top-0 bg-accent/40">
        {/* <Sidebar className="min-h-full" />   */}
      </div>
      <main className="w-full flex-1 overflow-hidden pt-[5rem]  ">
        {<Navbar />}
        {location.pathname === "/dashboard" && <Dashboardcomponent />}
        {location.pathname === "/suppliers" && <Suppliers />}
        {location.pathname === "/suppliers/add" && <SuppliersAdd />}
        {/\/suppliers\/edit\/\d+/.test(location.pathname) && <SuppliersEdit />}
        {location.pathname === "/contacts" && <Contacts />}
        {location.pathname === "/contacts/add" && <ContactsAdd />}
        {/\/contacts\/edit\/\d+/.test(location.pathname) && <ContactsEdit />}

        {location.pathname === "/clients" && <Clients />}
        {location.pathname === "/clients/add" && <ClientsAdd />}
        {/\/clients\/edit\/\d+/.test(location.pathname) && <ClientsEdit />}

        {location.pathname === "/leads" && <Leads />}
        {location.pathname === "/leads/add" && <LeadsAdd />}
        {/\/leads\/edit\/\d+/.test(location.pathname) && <LeadsEdit />}
        {/\/followUps\/\d+/.test(location.pathname) && <FollowUps />}
        {/\/generateQuotation\/\d+/.test(location.pathname) && <Leads />}
        {/\/generateInvoice\/\d+/.test(location.pathname) && <Leads />}

        {location.pathname === "/departments" && <Departments />}
        {location.pathname === "/departments/add" && (
          <DepartmentsDialog
            loading={false}
            setLoading={() => {}}
            open={true}
            setOpen={() => {}}
            form={{}}
            editDepartment={null}
            setError={() => {}}
            setEditDepartment={() => {}}
            fetchDepartments={() => {}}
            handleInvalidateQuery={() => {}}
          />
        )}
        {location.pathname === "/productCategories" && <ProductCategories />}
        {location.pathname === "/productCategories/add" && (
          <ProductCategoryDialog
            open={true}
            form={{}}
            setOpen={() => {}}
            editProductCategory={null}
            setError={() => {}}
            setEditProductCategory={() => {}}
            loading={false}
            setLoading={() => {}}
            handleProductCategoryInvalidateQuery={() => {}}
          />
        )}
        {location.pathname === "/products" && <Products />}
        {location.pathname === "/products/add" && <ProductsAdd />}
        {/\/products\/edit\/\d+/.test(location.pathname) && <ProductsEdit />}
        {location.pathname === "/invoices" && <InvoiceComponent />}
        {/\/invoices\/edit\/\d+/.test(location.pathname) && <InvoicesEdit />}
        {location.pathname === "/employees" && <Employees />}
        {location.pathname === "/employees/add" && <EmployeesAdd />}
        {/\/employees\/edit\/\d+/.test(location.pathname) && <EmployeesEdit />}

        {location.pathname === "/inventory" && <Inventory />}
        {location.pathname === "/inventory/add" && <InventoryAdd />}

        {location.pathname === "/vendors" && <Vendors />}
        {location.pathname === "/vendors/add" && <VendorAdd />}
        {/\/vendors\/edit\/\d+/.test(location.pathname) && <VendorEdit />}

        {location.pathname === "/purchase" && <Purchase />}
        {location.pathname === "/purchase/add" && <PurchaseAdd />}
        {/\/purchase\/edit\/\d+/.test(location.pathname) && <PurchaseEdit />}
      </main>
    </div>
  );
};

export default Dashboard;
