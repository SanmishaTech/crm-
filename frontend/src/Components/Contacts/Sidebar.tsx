import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { create } from "zustand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
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
import { useGetData } from "@/lib/HTTP/GET";

// Sidebar Store
interface SidebarStore {
  isMinimized: boolean;
  toggle: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clientId: string;
  setClientId: (clientId: string) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isMinimized: true,
  toggle: () => set((state) => ({ isMinimized: !state.isMinimized })),
  searchTerm: "",
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  clientId: "",
  setClientId: (clientId: string) => set({ clientId }),
}));

// Sidebar Component
type SidebarProps = {
  className?: string;
  onFilterChange: (filters: { clientId: string }) => void;
};

export default function Sidebar({ className, onFilterChange }: SidebarProps) {
  const {
    isMinimized,
    toggle,
    searchTerm,
    setSearchTerm,
    clientId,
    setClientId,
  } = useSidebar();

  const [openClientSelect, setOpenClientSelect] = React.useState(false);
  const [clients, setClients] = useState<{ value: string; label: string }[]>([]);
  const queryClient = useQueryClient();

  // Fetch clients
  const { data: clientsData } = useGetData({
    endpoint: `/api/all_clients`,
    params: {
      queryKey: ["clients"],
      retry: 1,
      onSuccess: (data) => {
        if (data?.data?.Client) {
          const formattedClients = data.data.Client.map((client: any) => ({
            value: client.id.toString(),
            label: client.client,
          }));
          setClients(formattedClients);
        }
      },
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleReset = () => {
    setClientId("");
    setSearchTerm("");
    onFilterChange({
      clientId: "",
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
        {/* Client Filter */}
        <div className="mt-2">
          <Popover open={openClientSelect} onOpenChange={setOpenClientSelect}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openClientSelect ? "true" : "false"}
                className="w-[200px] justify-between"
              >
                {clientId
                  ? clients.find((client) => client.value === clientId)?.label
                  : "Select client..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search client..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No client found.</CommandEmpty>
                  <CommandGroup>
                    {clients.map((client) => (
                      <CommandItem
                        key={client.value}
                        value={client.value}
                        onSelect={(currentValue) => {
                          const newValue =
                            currentValue === clientId ? "" : currentValue;
                          setClientId(newValue);
                          onFilterChange({ clientId: newValue });
                          setOpenClientSelect(false);
                        }}
                      >
                        {client.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            clientId === client.value
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
