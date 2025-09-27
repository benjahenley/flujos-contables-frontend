export default function Button({
  children,
  isLoading = false,
  onClick = () => {},
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  isLoading: boolean;
  onClick: (any: any) => void;
  type: "button" | "submit" | "reset";
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={isLoading}
      className={`w-full max-w-xs bg-primary hover:bg-primary-dark text-white font-medium px-5 py-2 rounded-lg transition-colors shadow-soft disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed ${className}`}>
      {isLoading ? "Cargando..." : children}
    </button>
  );
}
