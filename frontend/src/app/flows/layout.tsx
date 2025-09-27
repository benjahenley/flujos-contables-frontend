"use client";

import Layout from "@/components/layouts/Home";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import UnifiedBreadcrumb from "@/components/ui/UnifiedBreadcrumb";

export default function FlowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <Layout>
          <div className="max-w-6xl w-full mx-auto space-y-8 py-16">
            <UnifiedBreadcrumb />
            {children}
          </div>
        </Layout>
      </div>
    </div>
  );
}
