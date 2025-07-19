"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface User {
  id: string;
  role: "student" | "admin";
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (userId: string, password?: string, role?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_ID = "admin";
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userId: string, password?: string, role?: string) => {
    if (role === "admin") {
      if (userId === ADMIN_ID && password === ADMIN_PASSWORD) {
        const newUser: User = {
          id: ADMIN_ID,
          role: "admin",
          name: "Administrator",
        };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        return;
      } else {
        throw new Error("Invalid administrator credentials.");
      }
    }

    if (role === "student") {
      const studentRef = doc(db, "students", userId);
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
        const studentData = studentSnap.data();
        const newUser: User = {
          id: userId,
          role: "student",
          name: studentData.name || "Student",
        };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        throw new Error("Student not found in the database.");
      }

      return;
    }

    throw new Error("Invalid role.");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
