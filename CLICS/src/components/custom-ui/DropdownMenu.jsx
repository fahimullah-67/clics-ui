"use client"

import { useState, useRef, useEffect } from "react"

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block text-left">
      {typeof children === "function" ? children({ isOpen, setIsOpen }) : children}
    </div>
  )
}

export function DropdownMenuTrigger({ children, asChild, onClick }) {
  if (asChild && children) {
    return <div onClick={onClick}>{children}</div>
  }
  return children
}

export function DropdownMenuContent({ children, align = "center", open, onClose, className = "" }) {
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose && onClose()
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onClose])

  if (!open) return null

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 ${alignmentClasses[align]} ${className}`}
    >
      {children}
    </div>
  )
}

export function DropdownMenuLabel({ children, className = "" }) {
  return <div className={`px-2 py-1.5 text-sm font-semibold ${className}`}>{children}</div>
}

export function DropdownMenuItem({ children, asChild, onClick, className = "" }) {
  if (asChild && children) {
    return <div onClick={onClick}>{children}</div>
  }

  return (
    <div
      onClick={onClick}
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
    >
      {children}
    </div>
  )
}

export function DropdownMenuSeparator({ className = "" }) {
  return <div className={`-mx-1 my-1 h-px bg-gray-200 dark:bg-gray-800 ${className}`} />
}
