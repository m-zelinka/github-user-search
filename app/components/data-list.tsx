import type { ReactNode } from 'react'

export function DataList({ children }: { children: ReactNode }) {
  return <dl className="divide-y divide-gray-100">{children}</dl>
}

export function DataListItem({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-5 text-sm/6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      {children}
    </div>
  )
}

export function DataListLabel({ children }: { children: ReactNode }) {
  return <dt className="font-medium text-gray-900">{children}</dt>
}

export function DataListValue({ children }: { children: ReactNode }) {
  return <dd className="text-gray-700 max-sm:mt-1 sm:col-span-2">{children}</dd>
}
