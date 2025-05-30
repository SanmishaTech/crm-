import React from "react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { UseFormHook } from "@/components/ui/HookFormcomp";
import background from "@/images/LightBackground.jpeg";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/darktheme/CustomTheme";
import darkBackground from "@/images/Darkbackground.jpeg";

const Login = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  React.useEffect(() => {
    const handleTabClose = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, []);

  const defaultValues = {
    email: "",
    password: "",
  };
  const onSubmit = async (data: Record<string, any>) => {
    const userId = localStorage.getItem("userId") || "defaultUserId";

    const loginData = {
      ...data,
      userId,
    };

    try {
      const response = await axios.post("/api/login", loginData);

      console.log(response.data);
      if (response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        const roleName = response.data.data.user?.role?.name || 'default_role';
        localStorage.setItem("role", roleName);
        navigate("/dashboard");
        toast.success("Successfully Logged In");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Failed to log in. Check your credentials.");
    }
  };

  const typeofschema = {
    email: {
      name: "Email",
      type: "email",
      required: true,
      message: "Please enter your email",
      placeholder: "Enter your email...",
      className:
        "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      validation: {
        required: true,
        message: "Please enter your email",
        type: "email",
      },
      componentType: "Input",
      componentProps: {
        type: "email",
        placeholder: "Enter your email...",
        className:
          "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    password: {
      type: "string",
      required: true,
      message: "Please enter your password",
      className:
        "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      componentProps: {
        type: "password",
        placeholder: "Enter your password...",
        className:
          "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
      validation: {
        required: true,
        message: "Please enter your password",
        type: "password",
      },
    },
  };

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        to="/examples/authentication"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 hidden md:right-8 md:top-8"
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex  ">
        <div
          style={{
            backgroundImage: `url(${
              theme === "dark" ? darkBackground : background
            })`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "bottom",
          }}
          className="absolute inset-0 "
        />
        <div className="relative z-20 flex items-center text-lg font-medium text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6 text-white"
          >
            <path
              className="text-white"
              d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
            />
          </svg>
          Logo
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg text-white font-bold">Welcome To Website</p>
            <footer className="text-sm text-white">
              Customer Relationship Management (CRM){" "}
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8 drop-shadow-md">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <UseFormHook
            schema={typeofschema}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
          />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              to="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
