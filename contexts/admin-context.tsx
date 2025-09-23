"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdminContextType {
  isAdmin: boolean
  toggleAdmin: () => void
  login: (password: string) => boolean
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check localStorage for admin status on mount
    const adminStatus = localStorage.getItem("isAdmin") === "true"
    setIsAdmin(adminStatus)
  }, [])

  const toggleAdmin = () => {
    if (isAdmin) {
      logout()
    } else {
      // Simple password prompt for demo purposes
      const password = prompt("Digite a senha de administrador:")
      if (password === "admin123") {
        login(password)
      } else if (password !== null) {
        alert("Senha incorreta!")
      }
    }
  }

  const login = (password: string): boolean => {
    // Simple password check for demo - in real app this would be proper authentication
    if (password === "admin123") {
      setIsAdmin(true)
      localStorage.setItem("isAdmin", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    localStorage.removeItem("isAdmin")
  }

  return <AdminContext.Provider value={{ isAdmin, toggleAdmin, login, logout }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
