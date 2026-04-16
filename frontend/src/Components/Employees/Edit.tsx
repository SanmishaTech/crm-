import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { toast } from "sonner";
import { useGetData } from "@/lib/HTTP/GET";
import { usePutData } from "@/lib/HTTP/PUT";
import {
  Card,
  CardContent,
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
import axios from "axios";

interface Department {
  id: number;
  department_name: string;
}

// Form validation schema
const formSchema = z.object({
  employee_name: z
    .string()
    .min(2, { message: "Name field must have at least 2 characters." })
    .max(100, {
      message: "Supplier field must have no more than 100 characters.",
    })
    .nonempty({ message: "Name field is required." }),
  department_id: z.coerce
    .number()
    .min(1, { message: "Department field is required." }),
  role_name: z.string().min(1, "Role field is required"),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .nonempty("Email is required."),
  password: z
    .string()
    .min(6, { message: "Password field must have at least 6 characters." })
    .optional()
    .or(z.literal("")),
  mobile: z
    .string()
    .regex(/^\d{10}$/, { message: "Mobile number must be exactly 10 digits" })
    .nonempty({ message: "Mobile number field is required." }),
  joining_date: z.string().optional(),
  designation: z
    .string()
    .min(2, "Designation field must have at least 2 characters"),
  active: z.coerce.number().optional(),
});

// Move FormValues type definition outside the component
type FormValues = z.infer<typeof formSchema>;

export default function EditEmployeePage() {
  const { id } = useParams();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDepartmentLoading, setIsDepartmentLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_name: "",
      email: "",
      mobile: "",
      department_id: 0,
      joining_date: "",
      designation: "",
      password: "",
      active: 1,
      role_name: "",
    },
  });

  // Move the usePutData hook before any conditional returns
  const fetchData = usePutData({
    endpoint: `/api/employees/${id}`,
    params: {
      onSuccess: (data) => {
        console.log("editdata", data);
        queryClient.invalidateQueries({ queryKey: ["editemployee"] });
        queryClient.invalidateQueries({ queryKey: ["editemployee", id] });
        toast.success("Employee updated successfully");
        navigate("/employees");
      },
      onError: (error: any) => {
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
            setError("Failed to update employee"); // For any other errors
          }
        } else {
          setError("Failed to update employee");
        }
      },
    },
  });

  const {
    data: editData,
    isLoading,
    isError,
  } = useGetData({
    endpoint: `/api/employees/${id}`,
    params: {
      queryKey: ["editemployee", id],
      retry: 1,
      onSuccess: (data) => {
        console.log("data", data);
      },
      onError: (error: any) => {
        if (error.message && error.message.includes("duplicate supplier")) {
          toast.error("Supplier name is duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to fetch supplier data. Please try again.");
        }
      },
      enabled: !!id,
    },
  });

  useEffect(() => {
  }, [editData]);

  useEffect(() => {
    if (editData?.data.Employee) {
      const newData = editData.data.Employee;
      const activee = editData.data.User.active;
      form.reset({
        employee_name: newData.employee_name || "",
        email: newData.email || "",
        mobile: newData.mobile || "",
        designation: newData.designation || "",
        joining_date: newData.joining_date || "",
        department_id: newData.department_id || "",
        password: "", // Keep password field blank initially
        active: activee,
        role_name: newData.role_name || "",
      });
    }
  }, [editData, form]);

  const onSubmit = (data: FormValues) => {
    fetchData.mutate(data);
    queryClient.invalidateQueries({ queryKey: ["employees"] });
    queryClient.invalidateQueries({ queryKey: ["employees", id] });
  };

  if (isLoading || isDepartmentLoading) {
    return (
      <div className="p-6 mx-auto">
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
              <p className="text-xs mb-9 text-muted-foreground">
                Edit/Update the employee.
              </p>
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
                {/* Skeleton loader for fields */}
                <div className="flex justify-center space-x-6 grid grid-cols-1 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                </div>
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
                <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
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
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    );
  }
  if (isError) {
    return <div>Error fetching data. Please try again.</div>;
  }

  return (
    <div className="p-6 mx-auto">
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
            <p className="text-xs mb-9 text-muted-foreground">
              Update employee details.
            </p>
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
                              <SelectItem key="loading" value="loading" disabled>Loading...</SelectItem>
                            ) : (
                              departments.map((department) => (
                                <SelectItem key={department.id} value={String(department.id)}>
                                  {department.department_name}
                                </SelectItem>
                              ))
                            )}
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
                          type="text"
                          maxLength={10}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
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
                  render={({ field }) => {
                    const formattedDate = field.value
                      ? field.value.split("T")[0]
                      : "";

                    return (
                      <FormItem>
                        <FormLabel>Joining Date</FormLabel>
                        <FormControl>
                          {/* Set the formatted date */}
                          <Input type="date" {...field} value={formattedDate} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    );
                  }}
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

              <div className="flex justify-center space-x-6 grid grid-cols-2 gap-4 mb-5">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          value={String(field.value)}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <SelectTrigger className="">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key="active" value="1">Active</SelectItem>
                            <SelectItem key="inactive" value="0">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel key="roles-label">Roles</SelectLabel>
                              <SelectItem key="admin" value="admin">Admin</SelectItem>
                              <SelectItem key="enquiry" value="Enquiry">Enquiry</SelectItem>
                              <SelectItem key="follow-up" value="Follow up">Follow up</SelectItem>
                              <SelectItem key="payment" value="Payment">Payment</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
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
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            placeholder="Enter password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
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
