"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, BookOpen } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const { login } = useAuth()
  const [role, setRole] = useState<string>("")
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await login(userId, password, role)

      if (role === "student") {
        window.location.href = "/student"
      } else if (role === "admin") {
        window.location.href = "/admin"
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Invalid credentials. Please try again.")
    }
  }

  return (
    <Card className=" shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <BookOpen className="h-12 w-12 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Access Portal</CardTitle>
        <CardDescription>Sign in to access the Knowledge Center services</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Access Level</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">
              {role === "admin" ? "Admin ID" : "Student ID (Carnet)"}
            </Label>
            <Input
              id="userId"
              type="text"
              placeholder={role === "admin" ? "Enter Admin ID" : "Enter your student ID"}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          {role === "admin" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Sign In
          </Button>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full mt-2">
              ← Back
            </Button>
          </Link>
        </form>

        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access to the Knowledge Center is restricted to registered students and authorized personnel only. Contact
            the library administration if you need assistance.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
