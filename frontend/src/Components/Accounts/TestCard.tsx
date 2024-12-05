import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Check, ChevronsUpDown, MoveLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { accountsConfig, industriesConfig } from "./accountsConfig";

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
      navigate("/accounts");
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
                <FormDescription>Select Owner.</FormDescription>
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
            name="accountSite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Site</FormLabel>
                <FormControl>
                  <Input placeholder="Account Site..." {...field} />
                </FormControl>
                <FormDescription>What is your Account Site?</FormDescription>
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
            name="parentAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Account</FormLabel>
                <FormControl>
                  <Input placeholder="Parent Account..." {...field} />
                </FormControl>
                <FormDescription>What is your Parent Account?</FormDescription>
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
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="Account Number..." {...field} />
                </FormControl>
                <FormDescription>
                  What is your Account Number...
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tickerSymbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticker Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="Ticker Symbol..." {...field} />
                </FormControl>
                <FormDescription>
                  What is your Ticker Symbol ...
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Popover open={open} onOpenChange={setOpen}>
            <div className="flex flex-col">
              <FormLabel htmlFor="accountType" className="mb-3 text-sm">
                Account Type
              </FormLabel>
              <PopoverTrigger asChild>
                <Button
                  id="accountType"
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
            className="flex-1"
            control={form.control}
            name="ownership"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Ownership</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Ownership" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="subsidiary">Subsidiary</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="privatelyHeld">
                      Privately Held
                    </SelectItem>
                    <SelectItem value="publicCompany">
                      Public Company
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select Ratings ?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Popover open={industryOpen} onOpenChange={setIndustryOpen}>
            <div className="flex flex-col">
              <FormLabel htmlFor="industry" className="mb-3 text-sm">
                Industry
              </FormLabel>
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
                    : "None"}
                  {""}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
            </div>
            <PopoverContent className="w-[200px] h-[300px] overflow-y-auto p-0">
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
            name="sic"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>SIC Code</FormLabel>
                <Input placeholder="SIC Code..." {...field} />
                <FormDescription>What is your SIC Code.</FormDescription>
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
                name="billingStreet"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Billing Street</FormLabel>
                    <Input placeholder="Billing Street..." {...field} />
                    <FormDescription>
                      What is your Billing Street.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="billingCity"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Billing City</FormLabel>
                    <Input placeholder="Billing City..." {...field} />
                    <FormDescription>
                      What is your Billing City.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="billingState"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Billing State</FormLabel>
                    <Input placeholder="Billing State..." {...field} />
                    <FormDescription>
                      What is your Billing State.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="billingCode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Billing Code</FormLabel>
                    <Input placeholder="Billing Code..." {...field} />
                    <FormDescription>
                      What is your Billing Code.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="billingCountry"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Billing Country</FormLabel>
                    <Input placeholder="Billing Country..." {...field} />
                    <FormDescription>
                      What is your Billing Country.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Shipping Fields */}
            <div className="flex flex-col gap-4">
              <FormField
                className="flex-1"
                control={form.control}
                name="shippingStreet"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Shipping Street</FormLabel>
                    <Input placeholder="Shipping Street..." {...field} />
                    <FormDescription>
                      What is your Shipping Street.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="shippingCity"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Shipping City</FormLabel>
                    <Input placeholder="Shipping City..." {...field} />
                    <FormDescription>
                      What is your Shipping City.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="shippingState"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Shipping State</FormLabel>
                    <Input placeholder="Shipping State..." {...field} />
                    <FormDescription>
                      What is your Shipping State.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="shippingCode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Shipping Code</FormLabel>
                    <Input placeholder="Shipping Code..." {...field} />
                    <FormDescription>
                      What is your Shipping Code.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                className="flex-1"
                control={form.control}
                name="shippingCountry"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Shipping Country</FormLabel>
                    <Input placeholder="Shipping Country..." {...field} />
                    <FormDescription>
                      What is your Shipping Country.
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
        onClick={() => navigate("/accounts")}
        className="ml-4 flex gap-2 m-8 mb-4"
      >
        <MoveLeft className="w-5 text-white" />
        Back
      </Button>

      <CardHeader>
        <CardTitle>Accounts</CardTitle>
        <CardDescription>Accounts</CardDescription>
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
