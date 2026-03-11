"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useState, useEffect } from "react";
import { sidebarItems } from "@/data/sidebarItems";
import { ChevronDown } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsCollapsed((prev) => !prev);
    window.addEventListener("toggleSidebar", handleToggle);
    return () => window.removeEventListener("toggleSidebar", handleToggle);
  }, []);

  const canAccess = (item: any) => {
    if (item.requireAdmin && !user?.isSuperAdmin) return false;
    if (item.requirePremium && !user?.isVerifiedCustomer) return false;
    if (item.requireAuth && !user) return false;
    return true;
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: any) =>
    pathname === item.href ||
    item.children?.some((c: any) => pathname === c.href);

  return (
    <aside
      className={`bg-white min-h-screen shadow-sm border-r border-gray-100 transition-all duration-300 overflow-hidden flex-shrink-0 ${
        isCollapsed ? "w-16" : "w-56"
      }`}>
      <nav className="pt-5 pb-4">
        {sidebarItems.map((item) => {
          const accessible = canAccess(item);
          const parentActive = isParentActive(item);
          const hasChildren = item.children && item.children.length > 0;
          // expand when parent or any child is active, or sidebar is open
          const showChildren = !isCollapsed && hasChildren;

          return (
            <div key={item.href}>
              {/* Parent item */}
              <div className="px-2">
                <Link
                  href={accessible ? item.href : "#"}
                  onClick={(e) => { if (!accessible) e.preventDefault(); }}
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 ${
                    parentActive
                      ? "bg-[#27a0c9]/10 text-[#27a0c9]"
                      : accessible
                      ? "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      : "text-gray-300 cursor-not-allowed"
                  } ${isCollapsed ? "justify-center" : ""}`}>
                  <span className={`flex-shrink-0 ${parentActive ? "text-[#27a0c9]" : ""}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 truncate">{item.name}</span>
                      {hasChildren && (
                        <ChevronDown
                          size={13}
                          className={`flex-shrink-0 transition-transform duration-200 text-gray-400 ${
                            parentActive ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </>
                  )}
                </Link>
              </div>

              {/* Children — slide in/out */}
              {showChildren && (
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    parentActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                  {item.children.map((child: any) => {
                    const childAccessible = canAccess(child);
                    return (
                      <div key={child.href} className="pl-5 pr-2">
                        <Link
                          href={childAccessible ? child.href : "#"}
                          onClick={(e) => { if (!childAccessible) e.preventDefault(); }}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm transition-all duration-150 ${
                            isActive(child.href)
                              ? "bg-[#27a0c9]/10 text-[#27a0c9] font-medium"
                              : childAccessible
                              ? "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                              : "text-gray-300 cursor-not-allowed"
                          }`}>
                          <span className="flex-shrink-0">{child.icon}</span>
                          <span className="truncate">{child.name}</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
