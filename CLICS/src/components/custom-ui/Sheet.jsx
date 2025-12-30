"use client"

import { useEffect } from "react"

export function Sheet({ children, open, onOpenChange }) {
  return <div>{typeof children === "function" ? children({ open, onOpenChange }) : children}</div>
}

export function SheetTrigger({ children, asChild, onClick }) {
  if (asChild && children) {
    return <div onClick={onClick}>{children}</div>
  }
  return children
}

export function SheetContent({ children, side = "right", open, onClose, className = "" }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Sheet */}
      <div
        className={`fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out dark:bg-gray-900 ${
          side === "right"
            ? "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm"
            : side === "left"
              ? "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm"
              : side === "top"
                ? "inset-x-0 top-0 max-h-screen"
                : "inset-x-0 bottom-0 max-h-screen"
        } ${className}`}
      >
        {children}
      </div>
    </>
  )
}
