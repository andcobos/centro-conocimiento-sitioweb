"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

interface User {
  id: string
  role: "student" | "admin"
  name: string
}

interface AuthContextType {
  user: User | null
  login: (userId: string, password?: string, role?: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const ADMIN_ID = "admin"
  const ADMIN_PASSWORD = "admin123"

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const login = async (userId: string, password?: string, role?: string) => {
    if (role === "admin") {
      // 🔐 Solo este ID y contraseña permiten entrar como administrador
      if (userId === ADMIN_ID && password === ADMIN_PASSWORD) {
        setUser({
          id: ADMIN_ID,
          role: "admin",
          name: "Administrator",
        })
        return
      } else {
        throw new Error("Invalid administrator credentials.")
      }
    }

    if (role === "student") {
      // 🔒 Solo permite el acceso si el carnet existe en Firestore
      const studentRef = doc(db, "students", userId)
      const studentSnap = await getDoc(studentRef)

      if (studentSnap.exists()) {
        const studentData = studentSnap.data()
        setUser({
          id: userId,
          role: "student",
          name: studentData.name || "Student",
        })
      } else {
        throw new Error("Student not found in the database.")
      }

      return
    }

    throw new Error("Invalid role.")
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
