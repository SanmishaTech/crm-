import React from "react";
import { cn } from "@/lib/utils";
import { create } from "zustand";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SidebarStore {
  isMinimized: boolean;
  toggle: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  leadStatus: string;
  setLeadStatus: (leadStatus: string) => void;
  filters: { [key: string]: boolean };
  setFilter: (filter: string, value: boolean) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isMinimized: true,
  toggle: () => set((state) => ({ isMinimized: !state.isMinimized })),
  searchTerm: "",
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  leadStatus: "Open",
  setLeadStatus: (leadStatus: string) => set({ leadStatus }),
  filters: { streetAddress: false, area: false, city: false },
  setFilter: (filter: string, value: boolean) =>
    set((state) => ({
      filters: { ...state.filters, [filter]: value },
    })),
}));

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const {
    isMinimized,
    toggle,
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    leadStatus,
    setLeadStatus,
  } = useSidebar();

  return (
    <aside
      className={cn(
        `hidden min-h-screen flex-none bg-light transition-all duration-500 md:block sticky ease-in-out rounded`,
        !isMinimized
          ? "w-72 opacity-100 block bg-accent/70"
          : " w-1 opacity-0 bg-white hidden",
        className
      )}
    >
      <div className="p-2  space-x-2 mt-7 justify-items-center">
        <div>
          <h3 className="text-lg font-semibold">Leads Filter</h3>
        </div>
        <div className="mt-2">
          <Input
            placeholder="Search Leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select onValueChange={setLeadStatus} value={leadStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lead Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Lead Status</SelectLabel>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Quotation">Quotation</SelectItem>
                <SelectItem value="Deal">Deal</SelectItem>
                <SelectItem value="Close">Close</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4"></div>
      </div>
    </aside>
  );
}
