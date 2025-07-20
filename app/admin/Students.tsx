"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Pencil, Trash } from "lucide-react"
import { Label } from "@/components/ui/label"
import { dataService } from "@/lib/data-service"

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any | null>(null)
  const [formId, setFormId] = useState("")
  const [formName, setFormName] = useState("")

  const loadStudents = async () => {
    const studentsData = await dataService.getStudents()
    setStudents(studentsData)
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const openAddStudent = () => {
    setEditingStudent(null)
    setFormId("")
    setFormName("")
    setIsDialogOpen(true)
  }

  const openEditStudent = (student: any) => {
    setEditingStudent(student)
    setFormId(student.id)
    setFormName(student.name)
    setIsDialogOpen(true)
  }

  const handleSaveStudent = async () => {
    if (!formId || !formName) return alert("Complete both fields")

    const studentData = {
      id: formId,
      name: formName,
      email: `${formId}@esen.edu.sv`,
      status: "Active",
    }

    if (editingStudent) {
      // Update
      await dataService.updateStudent(formId, studentData)
    } else {
      // Add new
      await dataService.addStudent(studentData)
    }

    await loadStudents()
    setIsDialogOpen(false)
  }

  const handleDeleteStudent = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await dataService.deleteStudent(id)
      await loadStudents()
    }
  }

  const filtered = students.filter(
    (s) => s.id.includes(searchTerm) || s.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <Button onClick={openAddStudent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.id}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>
                <Badge variant={student.status === "Active" ? "default" : "destructive"}>
                  {student.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditStudent(student)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteStudent(student.id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Student ID</Label>
            <Input
              value={formId}
              onChange={(e) => setFormId(e.target.value)}
              disabled={!!editingStudent}
              placeholder="ID"
            />
            <Label>Full Name</Label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Name"
            />
            <Button onClick={handleSaveStudent}>
              {editingStudent ? "Update Student" : "Add Student"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
