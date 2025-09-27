"use client";

import Layout from "@/components/layouts/Home";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import Dashboard from "@/components/pages/Dashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <Layout>
          <Dashboard />
        </Layout>
      </div>
    </div>
  );
}
