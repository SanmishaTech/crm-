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
  leadStatus: string;
  setLeadStatus: (leadStatus: string) => void;
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

// Sidebar Component
type SidebarProps = {
  className?: string;
  onFilterChange: (filters: { status: string; productIds: string }) => void;
};

const leadStatusOptions = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Quotation", label: "Quotation" },
  { value: "Deal", label: "Deal" },
  { value: "Close", label: "Close" },
];

export default function Sidebar({ className, onFilterChange }: SidebarProps) {
  const {
    isMinimized,
    toggle,
    searchTerm,
    setSearchTerm,
    leadStatus,
    setLeadStatus,
    productIds,
    setProductIds,
  } = useSidebar();

  const [openLeadStatus, setOpenLeadStatus] = React.useState(false);
  const queryClient = useQueryClient();

  // State to store fetched products
  const [productOptions, setProductOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleReset = () => {
    setLeadStatus("");
    setProductIds("");
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
          <h3 className="text-lg font-semibold">Leads Filter</h3>
        </div>
        {/* Search Input */}
        <div className="mt-2">
          <Input
            placeholder="Search Leads..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        {/* Lead Status Filter */}
        <div className="mt-2">
          <Popover open={openLeadStatus} onOpenChange={setOpenLeadStatus}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openLeadStatus ? "true" : "false"}
                className="w-[200px] justify-between"
              >
                {leadStatus
                  ? leadStatusOptions.find(
                      (status) => status.value === leadStatus
                    )?.label
                  : "Select status..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search status..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No status found.</CommandEmpty>
                  <CommandGroup>
                    {leadStatusOptions.map((status) => (
                      <CommandItem
                        key={status.value}
                        value={status.value}
                        onSelect={(currentValue) => {
                          const newValue =
                            currentValue === leadStatus ? "" : currentValue;
                          setLeadStatus(newValue);
                          onFilterChange({ status: newValue, productIds });
                          setOpenLeadStatus(false); // Close the popover
                        }}
                      >
                        {status.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            leadStatus === status.value
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
