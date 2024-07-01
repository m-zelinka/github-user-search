import type { ReactNode } from "react";

export function StackedList({ children }: { children: ReactNode }) {
  return <ul className="divide-y divide-gray-100">{children}</ul>;
}

export function StackedListItem({ children }: { children: ReactNode }) {
  return (
    <li className="group relative px-4 py-5 hover:bg-gray-50 sm:px-6">
      {children}
    </li>
  );
}
