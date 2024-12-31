//@ts-nocheck
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGetData } from "@/lib/HTTP/GET";

import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { usePostData } from "@/lib/HTTP/POST";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
// Get QueryClient from the context
// Form Schema
const FormSchema = z.object({
  employee_name: z
    .string()
    .min(2, { message: "Name field must have at least 2 characters." })
    .max(100, {
      message: "Supplier field must have no more than 100 characters.",
    })
    .nonempty({ message: "Name field is required." }),
  department_id: z.string().min(1, "Department field is required"),

  email: z
    .string()
    .email("Please enter a valid email address.")
    .nonempty("Email is required."),
  password: z
    .string()
    .min(6, { message: "Password field must have at least 6 characters." }),
  mobile: z.coerce.number().min(10, { message: "mobile field is required." }),
  joining_date: z.string().optional(),
  designation: z
    .string()
    .min(2, "Designation field must have at least 2 characters"),
});

export default function InputForm() {
  const [error, setError] = useState<string | null>(null);
  const [isDepartmentLoading, setIsDepartmentLoading] = useState(true);

  const [departments, setDepartments] = useState([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      employee_name: "",
      email: "",
      mobile: null,
      department_id: "",
      joining_date: "",
      designation: "",
      password: "",
    },
  });
  const queryClient = useQueryClient();

  const navigate = useNavigate(); // Use For Navigation

  // Fetch Products
  const fetchDepartments = () => {
    axios
      .get("/api/all_departments", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDepartments(response.data.data.Departments);
        setIsDepartmentLoading(false);
      })
      .catch(() => {
        toast.error("Faild to load departments");
        setIsDepartmentLoading(false);
      });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  type FormValues = z.infer<typeof FormSchema>;
  const formData = usePostData({
    endpoint: "/api/employees",
    params: {
      onSuccess: (data) => {
        console.log("data", data);
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        navigate("/employees");
      },
      onError: (error) => {
        console.log("error", error);

        if (error.response && error.response.data.errors) {
          const serverStatus = error.response.data.status;
          const serverErrors = error.response.data.errors;
          // Assuming the error is for the department_name field
          if (serverStatus === false) {
            if (serverErrors.email) {
              form.setError("email", {
                type: "manual",
                message: serverErrors.email[0], // The error message from the server
              });
            }
            if (serverErrors.mobile) {
              form.setError("mobile", {
                type: "manual",
                message: serverErrors.mobile[0], // The error message from the server
              });
            }
          } else {
            setError("Failed to add employee"); // For any other errors
          }
        } else {
          setError("Failed to add employee");
        }
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    formData.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-12">
      <div className="flex items-center justify-between w-full">
        <div className="mb-7">
          <Button
            onClick={() => navigate("/employees")}
            variant="ghost"
            className="mr-4"
            type="button"
          >
            <ChevronLeft />
            Back
          </Button>
        </div>

        <div className="flex-1 mr-9 text-center">
          <div className="-ml-4">
            <h2 className="text-2xl font-semibold">Employee Form</h2>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center space-x-6 grid grid-cols-1 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="employee_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employee name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="department_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Select
                          value={String(field.value)}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="">
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {isDepartmentLoading ? (
                              <SelectItem disabled>Loading...</SelectItem>
                            ) : (
                              departments.map((department) => (
                                <SelectItem
                                  key={department.id}
                                  value={String(department.id)}
                                >
                                  {department.department_name}
                                </SelectItem>
                              ))
                            )}
                            <div className="px-5 py-1">
                              {/* <AddProductCategory
                                fetchProductCategories={fetchProductCategories}
                              /> */}
                            </div>
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter mobile number"
                          {...field}
                          type="number"
                          inputMode="numeric"
                          pattern="\d{10}"
                          maxLength={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="joining_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Joining Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter designation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/40">
            <CardHeader className="text- justify-between space-y-0 pb-2">
              <CardTitle className=" text-xl  font-semibold">
                Login Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          placeholder="Enter email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          placeholder="Enter password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => navigate("/employees")}
              className="align-self-center"
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" className="align-self-center hover:pointer">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
