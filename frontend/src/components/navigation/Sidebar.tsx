"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useState, useEffect } from "react";
import { sidebarItems } from "@/data/sidebarItems";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Listen for toggle events from navbar
  useEffect(() => {
    const handleToggle = () => {
      setIsCollapsed((prev) => !prev);
    };

    window.addEventListener("toggleSidebar", handleToggle);
    return () => window.removeEventListener("toggleSidebar", handleToggle);
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const shouldShowItem = (item: any) => {
    if (item.requireAdmin && !user?.isSuperAdmin) return false;
    if (item.requirePremium && !user?.isVerifiedCustomer) return false;
    if (item.requireAuth && !user) return false;
    return true;
  };

  return (
    <div
      className={`bg-white min-h-screen shadow-lg transition-all duration-300 overflow-hidden ${
        isCollapsed ? "w-20" : "w-90"
      }`}>
      <nav className="mt-4 w-full">
        {sidebarItems.map((item) => {
          const canAccess = shouldShowItem(item);

          return (
            <div key={item.name} className="relative px-2">
              <Link
                href={canAccess ? item.href : "#"}
                className={`flex items-center ${
                  isCollapsed ? "px-4" : "px-8"
                } py-3 text-sm transition-colors rounded-lg mb-1 overflow-hidden ${
                  isActive(item.href)
                    ? "bg-brand-primary text-white"
                    : canAccess
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                onClick={(e) => {
                  if (!canAccess) {
                    e.preventDefault();
                  }
                }}
                title={isCollapsed ? item.name : undefined}>
                <span
                  className={`text-lg transition-all duration-200 ${
                    isCollapsed ? "mx-auto" : "mr-3"
                  }`}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <>
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1">
                      {item.name}
                    </span>
                  </>
                )}
                <div className="flex items-center justify-center bg-white h-1 w-1 rounded-full opacity-20"></div>
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
