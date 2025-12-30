"use client"

import { useState } from "react"

export function Switch({ checked, onCheckedChange, className = "" }) {
  const [isChecked, setIsChecked] = useState(checked || false)

  const handleToggle = () => {
    const newValue = !isChecked
    setIsChecked(newValue)
    if (onCheckedChange) {
      onCheckedChange(newValue)
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked !== undefined ? checked : isChecked}
      onClick={handleToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        (checked !== undefined ? checked : isChecked) ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
      } ${className}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          (checked !== undefined ? checked : isChecked) ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}
