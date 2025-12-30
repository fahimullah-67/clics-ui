"use client"

import { useState } from "react"

export function Checkbox({ id, checked, onCheckedChange, className = "" }) {
  const [isChecked, setIsChecked] = useState(checked || false)

  const handleChange = (e) => {
    const newValue = e.target.checked
    setIsChecked(newValue)
    if (onCheckedChange) {
      onCheckedChange(newValue)
    }
  }

  return (
    <input
      id={id}
      type="checkbox"
      checked={checked !== undefined ? checked : isChecked}
      onChange={handleChange}
      className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 ${className}`}
    />
  )
}
