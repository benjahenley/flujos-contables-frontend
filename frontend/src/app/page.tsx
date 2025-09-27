"use client";

import Layout from "@/components/layouts/Home";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import HomePage from "@/components/pages/Home";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Layout>
          <HomePage />
        </Layout>
      </div>
    </div>
  );
}
