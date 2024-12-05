import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Check, ChevronsUpDown, MoveLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { accountsConfig } from "./accountsConfig";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import { Checkbox } from "@/components/ui/checkbox";
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
  rating: z.string().optional(),
  accountName: z.string().optional(),
  mobile: z.string().optional(),
  accountSite: z.string().optional(),
  fax: z.string().email().optional(),
  parentAccount: z.string().email().optional(),
  website: z.string().optional(),
  accountNumber: z.string().optional(),
  tickerSymbol: z.string().optional(),
  accountType: z.string().optional(),
  ownership: z.string().optional(),
  industry: z.string().optional(),
  employees: z.string().optional(),
  annual: z.string().optional(),
  sic: z.string().optional(),
  billingStreet: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingCode: z.string().optional(),
  billingCountry: z.string().optional(),
  shippingStreet: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingCode: z.string().optional(),
  shippingCountry: z.string().optional(),
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCopyBillingToShipping = () => {
    form.setValue("shippingStreet", form.getValues("billingStreet"));
    form.setValue("shippingCity", form.getValues("billingCity"));
    form.setValue("shippingState", form.getValues("billingState"));
    form.setValue("shippingCode", form.getValues("billingCode"));
    form.setValue("shippingCountry", form.getValues("billingCountry"));
  };

  const handleCopyShippingToBilling = () => {
    form.setValue("billingStreet", form.getValues("shippingStreet"));
    form.setValue("billingCity", form.getValues("shippingCity"));
    form.setValue("billingState", form.getValues("shippingState"));
    form.setValue("billingCode", form.getValues("shippingCode"));
    form.setValue("billingCountry", form.getValues("shippingCountry"));
  };

  async function onSubmit(data: ProfileFormValues) {
    // console.log("Sas", data);
     // Implement actual profile update logic here
    await axios.post(`/api/associatemaster`, data).then((res) => {
       toast.success("Associate Master Created Successfully");
      navigate("/contacts");
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          {/* <FormField
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
                <FormDescription>Select Owner.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <Popover open={open} onOpenChange={setOpen}>
            <div className="flex flex-col">
              <FormLabel htmlFor="leadSource" className="mb-3 text-sm">
                Lead Source
              </FormLabel>
              <PopoverTrigger asChild>
                <Button
                  id="leadSource"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? accountsConfig.find(
                        (framework) => framework.value === value
                      )?.label
                    : "None"}{" "}
                  {/* Display 'None' if no value is selected */}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
            </div>

            <PopoverContent className="w-[200px] h-[300px] overflow-y-auto p-0">
              <Command>
                <CommandInput
                  placeholder="Search Account Type..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No account found.</CommandEmpty>
                  <CommandGroup>
                    {accountsConfig.map((framework) => (
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
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name..." {...field} />
                </FormControl>
                <FormDescription>What is your First Name?</FormDescription>
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
                  <Input placeholder="Last Name..." {...field} />
                </FormControl>
                <FormDescription>
                  What is your name of Last Name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input placeholder="Account Name..." {...field} />
                </FormControl>
                <FormDescription>What is your Account Name?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vendorname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor Name</FormLabel>
                <FormControl>
                  <Input placeholder="Vendor Name..." {...field} />
                </FormControl>
                <FormDescription>What is your Vendor Name.</FormDescription>
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title..." {...field} />
                </FormControl>
                <FormDescription>What is your Title </FormDescription>
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
                <FormDescription>What is your Mobile...</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="Department..." {...field} />
                </FormControl>
                <FormDescription>What is your Department ...</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            className="flex-1"
            control={form.control}
            name="otherPhone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Other Phone</FormLabel>
                <Input placeholder="Other Phone ..." {...field} />
                <FormDescription>What is your Other Phone.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="homePhone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Home Phone</FormLabel>
                <Input
                  placeholder="Home Phone 
 ..."
                  {...field}
                />
                <FormDescription>What is your Home Phone .</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            className="flex-1"
            control={form.control}
            name="fax"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Fax</FormLabel>
                <Input placeholder="Fax..." {...field} />
                <FormDescription>What is your Fax.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="assistant"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Assistant</FormLabel>
                <Input placeholder="Assistant..." {...field} />
                <FormDescription>What is your Assistant.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Date Of Birth</FormLabel>
                <Input placeholder="Date Of Birth..." {...field} />
                <FormDescription>What is your Date Of Birth.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="asstPhone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Asst Phone</FormLabel>
                <Input placeholder="Asst Phone..." {...field} />
                <FormDescription>What is your Asst Phone.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="emailOTP"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email OTP Out</FormLabel>
                <Checkbox className="space-x-2" {...field} />
                <FormDescription>What is your Email OTP Out.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="skype"
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
          <FormField
            className="flex-1"
            control={form.control}
            name="reportingTo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Reporting To</FormLabel>
                <Input placeholder="Reporting To..." {...field} />
                <FormDescription>What is your Reporting To.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <h5 className="text-2xl font-bold">Address Information</h5>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Copy Addresses</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-30">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleCopyBillingToShipping}>
                  Copy Billing to Shipping
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyShippingToBilling}>
                  Copy Shipping to Billing
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-full p-4">
            {/* Billing Fields */}
            <div className="flex flex-col gap-4">
              <FormField
                className="flex-1"
                control={form.control}
                name="mailingStreet"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Mailing Street</FormLabel>
                    <Input placeholder="Mailing Street..." {...field} />
                    <FormDescription>
                      What is your Mailing Street.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="mailingCity"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Mailing City</FormLabel>
                    <Input placeholder="Mailing City..." {...field} />
                    <FormDescription>
                      What is your Mailing City.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="mailingState"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Mailing State</FormLabel>
                    <Input placeholder="Mailing State..." {...field} />
                    <FormDescription>
                      What is your Mailing State.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="mailingCode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Mailing Code</FormLabel>
                    <Input placeholder="Mailing Code..." {...field} />
                    <FormDescription>
                      What is your Mailing Code.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="mailingCountry"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Mailing Country</FormLabel>
                    <Input placeholder="Mailing Country..." {...field} />
                    <FormDescription>
                      What is your Mailing Country.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Other Fields */}
            <div className="flex flex-col gap-4">
              <FormField
                className="flex-1"
                control={form.control}
                name="otherStreet"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Other Street</FormLabel>
                    <Input placeholder="Other Street..." {...field} />
                    <FormDescription>
                      What is your Other Street.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="otherCity"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Other City</FormLabel>
                    <Input placeholder="Other City..." {...field} />
                    <FormDescription>What is your Other City.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="otherState"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Other State</FormLabel>
                    <Input placeholder="Other State..." {...field} />
                    <FormDescription>What is your Other State.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="otherCode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Other Code</FormLabel>
                    <Input placeholder="Other Code..." {...field} />
                    <FormDescription>What is your Other Code.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="otherCountry"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Other Country</FormLabel>
                    <Input placeholder="Other Country..." {...field} />
                    <FormDescription>
                      What is your Other Country.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
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
        onClick={() => navigate("/contacts")}
        className="ml-4 flex gap-2 m-8 mb-4"
      >
        <MoveLeft className="w-5 text-white" />
        Back
      </Button>

      <CardHeader>
        <CardTitle>Contacts</CardTitle>
        <CardDescription>Contacts</CardDescription>
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
