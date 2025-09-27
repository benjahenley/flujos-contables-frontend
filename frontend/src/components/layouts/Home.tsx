export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 w-full">
      {children}
    </div>
  );
}
