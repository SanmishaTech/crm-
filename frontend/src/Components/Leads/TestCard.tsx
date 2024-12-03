import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Check, ChevronsUpDown, MoveLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { frameworksConfig, industriesConfig } from "./leadsConfig";

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
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Label } from "recharts";

const profileFormSchema = z.object({
  ownerName: z.string().optional(),
  company: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  title: z.string().optional(),
  email: z.string().email().optional(),
  mobile: z.string().optional(),
  fax: z.string().optional(),
  telephone: z.string().optional(),
  website: z.string().optional(),
  leadSource: z.string().optional(),
  leadStatus: z.string().optional(),
  industry: z.string().optional(),
  employees: z.string().optional(),
  annual: z.string().optional(),
  rating: z.string().optional(),
  skypeID: z.string().optional(),
  secondaryEmail: z.string().optional(),
  twitter: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  description: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {};

function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [industryOpen, setIndustryOpen] = React.useState(false);

  async function onSubmit(data: ProfileFormValues) {
    // console.log("Sas", data);
    console.log("ppappappa");
    // Implement actual profile update logic here
    await axios.post(`/api/associatemaster`, data).then((res) => {
      console.log("ppappappa", res.data);
      toast.success("Associate Master Created Successfully");
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Owner Name</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="w-full"
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Associate type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="clinic">Owner 1</SelectItem>
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
                <FormDescription>What is your last name?</FormDescription>
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
                <FormDescription>What is your title...</FormDescription>
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
                <FormDescription>What is your email...</FormDescription>
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
                <FormDescription>What is your name of Mobile.</FormDescription>
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
                <FormDescription>What is your Fax.</FormDescription>
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
                <FormDescription>
                  What is your name of Telephone
                </FormDescription>
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
                <FormDescription>What is your Website Address</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {value
                  ? frameworksConfig.find(
                      (framework) => framework.value === value
                    )?.label
                  : "Select Lead Source..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search Lead Source..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {frameworksConfig.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        {framework.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === framework.value
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

          <FormField
            className="flex-1"
            control={form.control}
            name="leadStatus"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Lead Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value}
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
                <FormDescription>How should ?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Popover open={industryOpen} onOpenChange={setIndustryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={industryOpen}
                className="w-[200px] justify-between"
              >
                {industry
                  ? industriesConfig.find((item) => item.value === industry)
                      ?.label
                  : "Select Industry..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search Industry..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No industry found.</CommandEmpty>
                  <CommandGroup>
                    {industriesConfig.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={(currentValue) => {
                          setIndustry(
                            currentValue === industry ? "" : currentValue
                          );
                          setIndustryOpen(false);
                        }}
                      >
                        {item.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            industry === item.value
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

          <FormField
            className="flex-1"
            control={form.control}
            name="employees"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>No. of Employees</FormLabel>
                <Input placeholder="No. of Employees ..." {...field} />
                <FormDescription>
                  What is your No. of Employees.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="annual"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Annual Revenue</FormLabel>
                <Input
                  placeholder="Annual Revenue 
 ..."
                  {...field}
                />
                <FormDescription>What is your Annual Revenue .</FormDescription>
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
                <FormLabel>Ratings</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
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
                <FormDescription>Select Ratings ?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="skypeID"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Skype ID</FormLabel>
                <Input placeholder="Skype ID..." {...field} />
                <FormDescription>What is your Skype ID.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="secondaryEmail"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Secondary Email</FormLabel>
                <Input placeholder="Secondary Email..." {...field} />
                <FormDescription>What is your Secondary Email.</FormDescription>
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
        <Separator />
        <h5 className="text-2xl font-bold">Address Information</h5>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-full p-4">
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
        <CardDescription>Leads</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 ">
          <Separator />
          <ProfileForm />
        </div>
      </CardContent>
      {/* <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter> */}
    </Card>
  );
}
