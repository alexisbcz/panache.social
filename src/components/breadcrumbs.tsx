"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbsProps {
  items?: {
    label: string;
    href: string;
    icon?: React.ElementType;
  }[];
}

export function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  const breadcrumbs = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    ...items,
  ];

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const Icon = item.icon;

        return (
          <div key={item.href} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            {isLast ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground hover:underline"
              >
                {Icon ? <Icon className="h-4 w-4" /> : item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
