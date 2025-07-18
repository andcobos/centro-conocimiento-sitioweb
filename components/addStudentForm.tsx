"use client"

import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddStudentForm() {
  const [studentId, setStudentId] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState<string | null>(null)

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!studentId || !name) {
      setMessage("Please fill in both fields.")
      return
    }

    try {
      await setDoc(doc(db, "students", studentId), {
        name: name,
        status: "Active",
      })

      setMessage(`Student ${name} (${studentId}) successfully registered.`)
      setStudentId("")
      setName("")
    } catch (error) {
      console.error("Error adding student:", error)
      setMessage("Error adding student. Try again.")
    }
  }

  return (
    <form onSubmit={handleAddStudent} className="space-y-4">
      <div className="space-y-2">
        <Label>Student ID (Carnet)</Label>
        <Input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Enter student ID"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Student Name</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter full name"
          required
        />
      </div>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
        Register Student
      </Button>

      {message && (
        <p className="text-sm text-center text-blue-600 mt-2">{message}</p>
      )}
    </form>
  )
}
