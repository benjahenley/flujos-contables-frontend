import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface FlowBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function FlowBreadcrumb({ items }: FlowBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-primary transition-colors duration-200">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="text-gray-400">/</span>}
        </div>
      ))}
    </nav>
  );
}
