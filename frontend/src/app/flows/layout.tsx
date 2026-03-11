"use client";

import Layout from "@/components/layouts/Home";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import { usePathname } from "next/navigation";

export default function FlowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <Layout>
          <div className="max-w-screen-2xl w-full mx-auto">{children}</div>
        </Layout>
      </div>
    </div>
  );
}
