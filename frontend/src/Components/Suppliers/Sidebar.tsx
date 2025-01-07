import React from "react";
import { cn } from "@/lib/utils";
import { create } from "zustand";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarStore {
  isMinimized: boolean;
  toggle: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: { [key: string]: boolean };
  setFilter: (filter: string, value: boolean) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isMinimized: true,
  toggle: () => set((state) => ({ isMinimized: !state.isMinimized })),
  searchTerm: "",
  setSearchTerm: (term: string) => set({ searchTerm: term }),
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
  const { isMinimized, toggle, searchTerm, setSearchTerm, filters, setFilter } =
    useSidebar();

  return (
    <aside
      className={cn(
        `min-h-screen flex-none bg-light transition-all duration-500 md:block sticky ease-in-out rounded`,
        !isMinimized
          ? "w-72 opacity-100 block bg-accent/70"
          : "w-1 opacity-0 bg-white hidden",
        className
      )}
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Supplier Filter</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="hover:bg-accent block md:hidden"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <div>
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          {Object.entries(filters).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setFilter(key, e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm capitalize">{key}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
