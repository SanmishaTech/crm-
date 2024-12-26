// src/components/Sidebar.tsx (no change needed)
import React from "react";
import { cn } from "@/lib/utils";
import { create } from "zustand";
import { Input } from "@/components/ui/input";

// Sidebar Store with `searchTerm` state
interface SidebarStore {
  isMinimized: boolean;
  toggle: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isMinimized: false,
  toggle: () => set((state) => ({ isMinimized: !state.isMinimized })),
  searchTerm: "",
  setSearchTerm: (term: string) => set({ searchTerm: term }), // Add method to update searchTerm
}));

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle, searchTerm, setSearchTerm } = useSidebar();

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
      <div className="flex justify-center p-2 space-x-2 mt-6">
        <h3 className="text-lg  font-semibold">Supplier Filter </h3>
      </div>
      <div className="flex-1 space-x-2 p-4 ">
        {/* Search bar in Sidebar */}
        <Input
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm using the store's setSearchTerm method
        />
      </div>
    </aside>
  );
}
