import React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { create } from "zustand";

// Zustand store for managing the sidebar state
interface SidebarStore {
  isMinimized: boolean;
  toggle: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isMinimized: false,
  toggle: () => set((state) => ({ isMinimized: !state.isMinimized })),
}));

// Sidebar component that uses the Zustand store
type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
  };

  return (
    <aside
      className={cn(
        `hidden min-h-screen flex-none bg-light transition-[width] duration-500 md:block sticky`,
        !isMinimized ? "w-72" : "w-[72px]",
        className
      )}
    >
      <ChevronLeft
        className={cn(
          "absolute -right-3 top-10 z-50 cursor-pointer rounded-full border bg-primary text-black text-3xl",
          isMinimized && "rotate-180"
        )}
        onClick={handleToggle}
      />

      <div className="space-y-4 py-4 h-full">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">dss</div>
        </div>
      </div>
    </aside>
  );
}
