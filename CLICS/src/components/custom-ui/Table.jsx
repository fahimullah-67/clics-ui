export function Table({ children, className = "" }) {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>{children}</table>
    </div>
  )
}

export function TableHeader({ children, className = "" }) {
  return <thead className={`border-b ${className}`}>{children}</thead>
}

export function TableBody({ children, className = "" }) {
  return <tbody className={`[&_tr:last-child]:border-0 ${className}`}>{children}</tbody>
}

export function TableRow({ children, className = "" }) {
  return (
    <tr className={`border-b transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${className}`}>{children}</tr>
  )
}

export function TableHead({ children, className = "" }) {
  return (
    <th className={`h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 ${className}`}>
      {children}
    </th>
  )
}

export function TableCell({ children, className = "" }) {
  return <td className={`p-4 align-middle ${className}`}>{children}</td>
}
