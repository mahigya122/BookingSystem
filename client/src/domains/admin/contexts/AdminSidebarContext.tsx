/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AdminSidebarContextType {
    open: boolean;
    setOpen: (open: boolean) => void;
    toggle: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined);

export const AdminSidebarProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(prev => !prev);

    return (
        <AdminSidebarContext.Provider value={{ open, setOpen, toggle }}>
            {children}
        </AdminSidebarContext.Provider>
    );
};

export const useAdminSidebar = () => {
    const context = useContext(AdminSidebarContext)
    if (!context) {
        throw new Error("useAdminSidebar must be used within AdminSidebarProvider");
    }
    return context;
};
