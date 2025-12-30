"use client"

import { useState } from "react"

export function Tabs({ children, defaultValue, className = "" }) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <div className={className}>{typeof children === "function" ? children({ activeTab, setActiveTab }) : children}</div>
  )
}

export function TabsList({ children, className = "" }) {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 dark:bg-gray-800 ${className}`}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, onClick, active, className = "" }) {
  return (
    <button
      type="button"
      onClick={() => onClick && onClick(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
        active
          ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100"
          : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, activeValue, children, className = "" }) {
  if (value !== activeValue) return null

  return <div className={`mt-2 ${className}`}>{children}</div>
}
