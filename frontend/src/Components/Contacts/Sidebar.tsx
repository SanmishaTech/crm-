import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { create } from "zustand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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

// Sidebar Store
interface SidebarStore {
  isMinimized: boolean;
  toggle: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  client: string;
  setClient: (client: string) => void;
  productIds: string;
  setProductIds: (productIds: string) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isMinimized: true,
  toggle: () => set((state) => ({ isMinimized: !state.isMinimized })),
  searchTerm: "",
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  leadStatus: "",
  setLeadStatus: (leadStatus: string) => set({ leadStatus }),
  productIds: "",
  setProductIds: (productIds: string) => set({ productIds }),
}));

// Component Props
type SidebarProps = {
  className?: string;
  onFilterChange: (filters: { status: string; productIds: string }) => void;
};

export default function Sidebar({ className, onFilterChange }: SidebarProps) {
  const {
    isMinimized,
    searchTerm,
    setSearchTerm,
    client,
    setClient,
    productIds,
  } = useSidebar();

  // State to control the dropdown and store fetched contacts
  const [openDropdown, setOpenDropdown] = useState(false);
  const [clientOptions, setClientOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const queryClient = useQueryClient();

  // Fetch contacts when the component mounts
  useEffect(() => {
    async function fetchContacts() {
      try {
        const response = await axios.get("/api/contacts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        // Extract contacts from the nested response: response.data.data.Contact
        const contacts = response.data.data.Contact;
        console.log("Contacts fetched:", contacts);

        // Map each contact's client_name into an option for the dropdown
        const options = contacts.map((contact: any) => ({
          value: contact.client_name,
          label: contact.client_name,
        }));
        setClientOptions(options);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    }
    fetchContacts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleReset = () => {
    setClient("");
    setSearchTerm("");
    onFilterChange({
      status: "",
      productIds: "",
    });
  };

  return (
    <aside
      className={cn(
        `hidden min-h-screen flex-none bg-light transition-all duration-500 md:block sticky ease-in-out rounded`,
        !isMinimized
          ? "w-72 opacity-100 block bg-accent/70"
          : "w-1 opacity-0 bg-white hidden",
        className
      )}
    >
      <div className="p-2 space-x-2 mt-7 justify-items-center">
        <div>
          <h3 className="text-lg font-semibold">Contacts Filter</h3>
        </div>
        {/* Search Input */}
        <div className="mt-2">
          <Input
            placeholder="Search Contacts..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        {/* Contacts Dropdown */}
        <div className="mt-2">
          <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openDropdown ? "true" : "false"}
                className="w-[200px] justify-between"
              >
                {client
                  ? clientOptions.find((option) => option.value === client)
                      ?.label
                  : "Select contact..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search contact..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No contacts found.</CommandEmpty>
                  <CommandGroup>
                    {clientOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(currentValue) => {
                          const newValue =
                            currentValue === client ? "" : currentValue;
                          setClient(newValue);
                          // Here we use 'status' as the key; update the table's handleFilterChange accordingly.
                          onFilterChange({ status: newValue, productIds });
                          setOpenDropdown(false);
                        }}
                      >
                        {option.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            client === option.value
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
        {/* Reset Filters Button */}
        <div className="mt-4">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </aside>
  );
}
