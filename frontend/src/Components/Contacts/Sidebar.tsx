import React from "react";
import { cn } from "@/lib/utils";
import { create } from "zustand";
import { Input } from "@/components/ui/input";

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
        `hidden min-h-screen flex-none bg-light transition-all duration-500 md:block sticky ease-in-out rounded`,
        !isMinimized
          ? "w-72 block bg-accent/70 "
          : " w-1 opacity-0 bg-white hidden",
        // "animate-side-drawer"
        className
      )}
    >
      <div className="p-2 space-x-2 mt-6 justify-items-center">
        <div>
          <h3
            className={
              !isMinimized
                ? setTimeout(() => {
                    return "text-lg font-semibold";
                  }, 1000)
                : "text-sm font-semibold"
            }
          >
            Contacts Filter
          </h3>
        </div>
        <div className="mt-2">
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-4"></div>
      </div>
    </aside>
  );
}
