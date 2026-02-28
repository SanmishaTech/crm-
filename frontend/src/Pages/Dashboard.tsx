import React, { useEffect, useState } from "react";
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
import EventsAdd from "@/Components/Events/Add";
import EventsEdit from "@/Components/Events/Edit";
import Events from "@/Components/Events/Index";
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
import PurchaseView from "@/Components/Purchase/View";
import Replacements from "@/Components/Replacement/Index";
import ReplacementsADD from "@/Components/Replacement/Add";
import ReplacementsEDIT from "@/Components/Replacement/Edit";
import Challans from "@/Components/Challans/Index";
import ChallansADD from "@/Components/Challans/Add";
import ChallansEDIT from "@/Components/Challans/Edit";
import ExpenseHeads from "@/Components/ExpenseHead/Index";
import ExpenseHeadsADD from "@/Components/ExpenseHead/AddDepartment";
import ExpenseHeadsEDIT from "@/Components/ExpenseHead/DepartmentDialog";
import Expense from "@/Components/Expense/Index";
import ExpenseADD from "@/Components/Expense/Add";
import ExpenseEDIT from "@/Components/Expense/Edit";
import Notepad from "@/Components/Notepad/Index";
import NotepadADD from "@/Components/Notepad/Add";
import NotepadEDIT from "@/Components/Notepad/Edit";
import Roles from "@/Components/Roles/index";
import RolesEDIT from "@/Components/Roles/Update";
import Permissions from "@/Components/Permissions/index";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>("");

  // Function to check if the current user role has access to a specific module
  const hasAccess = (module: string) => {
    const role = (localStorage.getItem("role") || "").trim().toLowerCase();
    const adminOnlyModules = ["roles", "permissions", "departments", "employees"];

    if (adminOnlyModules.includes(module)) {
      return role === "admin";
    }

    return true;
  };

  // Function to check if current path is accessible
  const checkPathAccess = () => {
    const path = location.pathname;

    // Extract the base module from the path
    let module = path.split('/')[1];

    // Handle special cases for edit routes
    if (path.includes('/edit/') || path.includes('/view/') ||
      path.includes('/add') || /\/roles\/\d+\/edit/.test(path) ||
      /\/followUps\/\d+/.test(path) || /\/generateQuotation\/\d+/.test(path) ||
      /\/generateInvoice\/\d+/.test(path)) {
      module = path.split('/')[1]; // Get the base module
    }

    // If the user doesn't have access to this module, redirect to dashboard
    if (!hasAccess(module)) {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // Get user role from localStorage
    const role = localStorage.getItem("role") || "";
    setUserRole(role.toLowerCase());
  }, [navigate]);

  // Check path access whenever location or userRole changes
  useEffect(() => {
    if (userRole) {
      checkPathAccess();
    }
  }, [location.pathname, userRole]);

  return (
    <div className="flex bg-background w-[100vw] h-full relative min-h-screen overflow-x-hidden">
      <div className="min-h-screen relative top-0 bg-accent/40">
        {/* <Sidebar className="min-h-full" />   */}
      </div>
      <main className="w-full flex-1 overflow-hidden pt-[5rem]  ">
        {<Navbar />}
        {location.pathname === "/dashboard" && hasAccess("dashboard") && <Dashboardcomponent />}
        {location.pathname === "/suppliers" && hasAccess("suppliers") && <Suppliers />}
        {location.pathname === "/suppliers/add" && hasAccess("suppliers") && <SuppliersAdd />}
        {/\/suppliers\/edit\/\d+/.test(location.pathname) && hasAccess("suppliers") && <SuppliersEdit />}
        {location.pathname === "/contacts" && hasAccess("contacts") && <Contacts />}
        {location.pathname === "/contacts/add" && hasAccess("contacts") && <ContactsAdd />}
        {/\/contacts\/edit\/\d+/.test(location.pathname) && hasAccess("contacts") && <ContactsEdit />}

        {location.pathname === "/clients" && hasAccess("clients") && <Clients />}
        {location.pathname === "/clients/add" && hasAccess("clients") && <ClientsAdd />}
        {/\/clients\/edit\/\d+/.test(location.pathname) && hasAccess("clients") && <ClientsEdit />}

        {location.pathname === "/leads" && hasAccess("leads") && <Leads />}
        {location.pathname === "/leads/add" && hasAccess("leads") && <LeadsAdd />}
        {/\/leads\/edit\/\d+/.test(location.pathname) && hasAccess("leads") && <LeadsEdit />}
        {/\/followUps\/\d+/.test(location.pathname) && hasAccess("leads") && <FollowUps />}

        {location.pathname === "/events" && hasAccess("events") && <Events />}
        {location.pathname === "/events/add" && hasAccess("events") && <EventsAdd />}
        {/\/events\/edit\/\d+/.test(location.pathname) && hasAccess("events") && <EventsEdit />}
        {/\/generateQuotation\/\d+/.test(location.pathname) && hasAccess("leads") && <Leads />}
        {/\/generateInvoice\/\d+/.test(location.pathname) && hasAccess("leads") && <Leads />}

        {location.pathname === "/departments" && hasAccess("departments") && <Departments />}
        {location.pathname === "/departments/add" && hasAccess("departments") && (
          <DepartmentsDialog
            loading={false}
            setLoading={() => { }}
            open={true}
            setOpen={() => { }}
            form={{}}
            editDepartment={null}
            setError={() => { }}
            setEditDepartment={() => { }}
            fetchDepartments={() => { }}
            handleInvalidateQuery={() => { }}
          />
        )}
        {location.pathname === "/productCategories" && hasAccess("productCategories") && <ProductCategories />}
        {location.pathname === "/productCategories/add" && hasAccess("productCategories") && (
          <ProductCategoryDialog
            open={true}
            form={{}}
            setOpen={() => { }}
            editProductCategory={null}
            setError={() => { }}
            setEditProductCategory={() => { }}
            loading={false}
            setLoading={() => { }}
            handleProductCategoryInvalidateQuery={() => { }}
          />
        )}
        {location.pathname === "/products" && hasAccess("products") && <Products />}
        {location.pathname === "/products/add" && hasAccess("products") && <ProductsAdd />}
        {/\/products\/edit\/\d+/.test(location.pathname) && hasAccess("products") && <ProductsEdit />}
        {location.pathname === "/invoices" && hasAccess("invoices") && <InvoiceComponent />}
        {/\/invoices\/edit\/\d+/.test(location.pathname) && hasAccess("invoices") && <InvoicesEdit />}
        {location.pathname === "/employees" && hasAccess("employees") && <Employees />}
        {location.pathname === "/employees/add" && hasAccess("employees") && <EmployeesAdd />}
        {/\/employees\/edit\/\d+/.test(location.pathname) && hasAccess("employees") && <EmployeesEdit />}

        {location.pathname === "/inventory" && hasAccess("inventory") && <Inventory />}
        {location.pathname === "/inventory/add" && hasAccess("inventory") && <InventoryAdd />}

        {location.pathname === "/vendors" && hasAccess("vendors") && <Vendors />}
        {location.pathname === "/vendors/add" && hasAccess("vendors") && <VendorAdd />}
        {/\/vendors\/edit\/\d+/.test(location.pathname) && hasAccess("vendors") && <VendorEdit />}

        {location.pathname === "/purchase" && hasAccess("purchase") && <Purchase />}
        {location.pathname === "/purchase/add" && hasAccess("purchase") && <PurchaseAdd />}
        {/\/purchase\/view\/\d+/.test(location.pathname) && hasAccess("purchase") && <PurchaseView />}

        {location.pathname === "/replacements" && hasAccess("replacements") && <Replacements />}
        {location.pathname === "/replacements/add" && hasAccess("replacements") && <ReplacementsADD />}
        {/\/replacements\/edit\/\d+/.test(location.pathname) && hasAccess("replacements") && (
          <ReplacementsEDIT />
        )}
        {location.pathname === "/challans" && hasAccess("challans") && <Challans />}
        {location.pathname === "/challans/add" && hasAccess("challans") && <ChallansADD />}
        {/\/challans\/edit\/\d+/.test(location.pathname) && hasAccess("challans") && <ChallansEDIT />}
        {location.pathname === "/expense_heads" && hasAccess("expense_heads") && <ExpenseHeads />}
        {location.pathname === "/expense_heads/add" && hasAccess("expense_heads") && <ExpenseHeadsADD />}
        {/\/expense_heads\/edit\/\d+/.test(location.pathname) && hasAccess("expense_heads") && (
          <ExpenseHeadsEDIT />
        )}
        {location.pathname === "/expense" && hasAccess("expense") && <Expense />}
        {location.pathname === "/expense/add" && hasAccess("expense") && <ExpenseADD />}
        {/\/expense\/edit\/\d+/.test(location.pathname) && hasAccess("expense") && <ExpenseEDIT />}

        {location.pathname === "/notepad" && hasAccess("notepad") && <Notepad />}
        {location.pathname === "/notepad/add" && hasAccess("notepad") && <NotepadADD />}
        {/\/notepad\/edit\/\d+/.test(location.pathname) && hasAccess("notepad") && <NotepadEDIT />}

        {location.pathname === "/roles" && hasAccess("roles") && <Roles />}
        {/\/roles\/\d+\/edit/.test(location.pathname) && hasAccess("roles") && <RolesEDIT />}
        {location.pathname === "/permissions" && hasAccess("permissions") && <Permissions />}
      </main>
    </div>
  );
};

export default Dashboard;
