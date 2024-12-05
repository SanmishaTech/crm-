import React, {  useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { MoveLeft, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { frameworksConfig, industriesConfig } from "./leadsConfig";
import { Check } from "lucide-react";

const profileFormSchema = z.object({
  
  ownerName: z.any().optional(),
  company: z.any().optional(),
  firstName: z.any().optional(),
  lastName: z.any().optional(),
  title: z.any().optional(),
  email: z.any().optional(),
  mobile: z.any().optional(),
  fax: z.any().optional(),
  telephone: z.any().optional(),
  website: z.any().optional(),
  leadSource: z.any().optional(),
  leadStatus: z.any().optional(),
  industry: z.any().optional(),
  employees: z.any().optional(),
  annual: z.any().optional(),
  rating: z.any().optional(),
  skypeID: z.any().optional(),
  secondaryEmail: z.any().optional(),
  twitter: z.any().optional(),
  street: z.any().optional(),
  city: z.any().optional(),
  state: z.any().optional(),
  zipCode: z.any().optional(),
  country: z.any().optional(),
  description: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.

function ProfileForm({ formData }) {
  // console.log("This is formData", formData);
  const defaultValues: Partial<ProfileFormValues> = formData;
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [industryOpen, setIndustryOpen] = React.useState(false);


  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const { id } = useParams();

  const { reset } = form;

  // Reset form values when formData changes
  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  const navigate = useNavigate();

  async function onSubmit(data: ProfileFormValues) {
     await axios.put(`/api/leads/${id}`, data, {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      toast.success("Leads Updated Successfully");
      navigate("/leads");
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 pb-[2rem]"
      >
        {" "}
        <h5 className="text-2xl font-bold">Account Information</h5>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Owner Name</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  className="w-full"
                >
                  <FormControl className="w-full">
                    <SelectTrigger value={field.value}>
                      {" "}
                      <SelectValue placeholder="Select Owner type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="owner">Owner 1 </SelectItem>
                    <SelectItem value="doctor">Owner 2</SelectItem>
                    <SelectItem value="hospital">Owner 3</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  This is the type of Associate you are selecting.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Company..." {...field} />
                </FormControl>
                <FormDescription>What is your Company?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name..." {...field} />
                </FormControl>
                <FormDescription>What is your first name?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name..." {...field} />
                </FormControl>
                <FormDescription>What is your Last name?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title..." {...field} />
                </FormControl>
                <FormDescription>What is your Title?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email..." {...field} />
                </FormControl>
                <FormDescription>What is your Email?</FormDescription>
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
                  <Input placeholder="Mobile..." {...field} />
                </FormControl>
                <FormDescription>What is your Mobile?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fax</FormLabel>
                <FormControl>
                  <Input placeholder="Fax..." {...field} />
                </FormControl>
                <FormDescription>What is your Fax?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telephone</FormLabel>
                <FormControl>
                  <Input placeholder="Telephone..." {...field} />
                </FormControl>
                <FormDescription>What is your Telephone?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="Website..." {...field} />
                </FormControl>
                <FormDescription>What is your Website?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
  control={form.control}
  name="leadSource"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="leadSource" className="mb-3 text-sm">
        Lead Source
      </FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="lead-source"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {field.value
              ? frameworksConfig.find((fw) => fw.value === field.value)?.label
              : "None"}{" "}
            {/* Display 'None' if no value is selected */}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] h-[300px] overflow-y-auto">
          <Command>
            <CommandInput placeholder="Search Lead Source..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworksConfig.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      field.onChange(currentValue); // Sync with form field
                      setOpen(false);
                    }}
                  >
                    {framework.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        field.value === framework.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormDescription>
        Select the source of the lead.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

           
          <FormField
            className="flex-1"
            control={form.control}
            name="leadStatus"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Lead Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="attemptedToContact">
                      Attempted to Contact
                    </SelectItem>
                    <SelectItem value="contactInFuture">
                      Contact in Future
                    </SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="junkLeads">Junk Leads</SelectItem>
                    <SelectItem value="notContacted">Not Contacted</SelectItem>
                    <SelectItem value="preQualified">Pre Qualified</SelectItem>
                    <SelectItem value="notQualified">Not Qualified</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How should we address you?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

<FormField
  control={form.control}
  name="industry"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="industry" className="mb-3 text-sm">
        Industry
      </FormLabel>
      <div>
      <Popover open={industryOpen} onOpenChange={setIndustryOpen}>
        <PopoverTrigger asChild>
          <Button
            id="industry"
            variant="outline"
            role="combobox"
            aria-expanded={industryOpen}
            className="w-[200px] justify-between"
          >
            {field.value
              ? industriesConfig.find((fw) => fw.value === field.value)?.label
              : "None"}{" "}
            {/* Display 'None' if no value is selected */}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] h-[300px] overflow-y-auto">
          <Command>
            <CommandInput placeholder="Search Industry..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {industriesConfig.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      field.onChange(currentValue); // Sync with form field
                      setIndustryOpen(false);
                    }}
                  >
                    {framework.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        field.value === framework.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      </div>
      <FormDescription>
        Select the source of the industry.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>


          <FormField
            control={form.control}
            name="employees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. of Employees</FormLabel>
                <FormControl>
                  <Input placeholder="No. of Employees..." {...field} />
                </FormControl>
                <FormDescription>
                  What is your No. of Employees?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="annual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Revenue</FormLabel>
                <FormControl>
                  <Input placeholder="Annual Revenue..." {...field} />
                </FormControl>
                <FormDescription>
                  What is your name of Annual Revenue
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            className="flex-1"
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Rating</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Rating" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="acquired">Acquired</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="marketFailed">Market Failed</SelectItem>
                    <SelectItem value="projectCancelled">
                      Project Cancelled
                    </SelectItem>
                    <SelectItem value="shutDown">Shut Down</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>What is your country?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skypeID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skype ID</FormLabel>
                <FormControl>
                  <Input placeholder="Skype ID..." {...field} />
                </FormControl>
                <FormDescription>What is your name of Skype ID</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondaryEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Email</FormLabel>
                <FormControl>
                  <Input placeholder="Secondary Email..." {...field} />
                </FormControl>
                <FormDescription>
                  What is your name of Secondary Email
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Twitter ID</FormLabel>
                <Input
                  placeholder="Twitter ID..."
                  {...field}
                  value={
                    field.value
                      ? field.value.startsWith("@")
                        ? field.value
                        : "@" + field.value
                      : ""
                  }
                  onChange={(e) => field.onChange(e.target.value)}
                />
                <FormDescription>What is your Twitter ID.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <h5 className="text-2xl font-bold">Address Information</h5>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Street</FormLabel>
                <Input placeholder="Street..." {...field} />
                <FormDescription>What is your Street.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            className="flex-1"
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>City</FormLabel>
                <Input placeholder="City..." {...field} />
                <FormDescription>What is your City.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            className="flex-1"
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>State</FormLabel>
                <Input placeholder="State..." {...field} />
                <FormDescription>What is your State.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            className="flex-1"
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Zip Code</FormLabel>
                <Input placeholder="Zip Code..." {...field} />
                <FormDescription>What is your Zip Code.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            className="flex-1"
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Country</FormLabel>
                <Input placeholder="Country..." {...field} />
                <FormDescription>What is your Country.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <h5 className="text-2xl font-bold">Contact Information</h5>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <Textarea placeholder="Description..." {...field} />
                <FormDescription>What is your Description.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end w-full ">
          <Button className="self-center mr-8" type="submit">
            Update profile
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function SettingsProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<any>({});
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/leads/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data);
      setFormData(response.data.data.Lead);
    };
    if (id) {
      fetchData();
    }
    return () => {
      setFormData({});
    };
  }, [id]);
  return (
    <Card className="min-w-[350px] overflow-auto bg-light shadow-md pt-4 ">
      <Button
        onClick={() => navigate("/leads")}
        className="ml-4 flex gap-2 m-8 mb-4"
      >
        <MoveLeft className="w-5 text-white" />
        Back
      </Button>

      <CardHeader>
        <CardTitle>Leads</CardTitle>
        <CardDescription>Update The Leads Here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 ">
          <Separator />
          <ProfileForm formData={formData} />
        </div>
      </CardContent>
      {/* <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter> */}
    </Card>
  );
}
