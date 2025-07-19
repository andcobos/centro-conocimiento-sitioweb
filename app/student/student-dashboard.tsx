"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut } from "lucide-react"
import { dataService } from "@/lib/data-service"
import { StudyRoomSection } from "./StudyRooms"
import { FinesSection } from "./FinesSection"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import StudentLibraryCatalog from "./LibraryCatalog"

type StudyRoom = {
  id: string
  name: string
  status: string
  occupiedBy: string | null
  occupiedUntil: string | null
}

type BookLoan = {
  id: string
  title: string
  dueDate?: string
  status: string
}

type LoanHistory = {
  id: string
  title: string
  borrowDate: string
  returnDate: string
}

type Fine = {
  id: string
  reason: string
  amount: string
  date: string
  status: string
}

export function StudentDashboard() {
  const { user } = useAuth()
  const studentId = user?.id

  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([])
  const [borrowedBooks, setBorrowedBooks] = useState<BookLoan[]>([])
  const [fines, setFines] = useState<Fine[]>([])
  const [loanHistory, setLoanHistory] = useState<LoanHistory[]>([])

  useEffect(() => {
    if (!studentId) return

    const loadData = async () => {
      const [roomsRaw, booksRaw, finesRaw, historyRaw] = await Promise.all([
        dataService.getStudyRooms(),
        dataService.getBorrowedBooks(studentId),
        dataService.getFines(studentId),
        dataService.getLoanHistory(studentId),
      ])

      const rooms = roomsRaw.map((room: any) => ({
        id: room.id,
        name: room.name ?? "Unnamed Room",
        status: room.status ?? "Available",
        occupiedBy: room.occupiedBy ?? null,
        occupiedUntil: room.occupiedUntil ?? null,
      }))
      setStudyRooms(rooms)

      const books = booksRaw.map((book: any) => ({
        id: book.id,
        title: book.title ?? "Untitled",
        dueDate: book.dueDate ?? null,
        status: book.status ?? "Unknown",
      }))
      setBorrowedBooks(books)

      const fines = finesRaw.map((fine: any) => ({
        id: fine.id,
        reason: fine.reason ?? "Unknown Reason",
        amount: fine.amount ?? "0",
        status: fine.status ?? "Not Paid",
        date: fine.date ?? "",
      }))
      setFines(fines)

      const history = historyRaw.map((entry: any) => ({
        id: entry.id,
        title: entry.title ?? "Untitled",
        borrowDate: entry.borrowDate ?? "",
        returnDate: entry.returnDate ?? "",
      }))
      setLoanHistory(history)
    }

    loadData()
  }, [studentId])

  const handleRoomRequest = (ids: string) => {
    console.log("Request study room for:", ids)
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  if (!studentId) {
    return (
      <div className="p-8 text-center text-red-500">
        Student not authenticated. Please log in.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/esenlogo.png"
                alt="ESEN Logo"
                width={32}
                height={32}
                className="mr-3 rounded"
              />
              <h1 className="text-xl font-semibold text-gray-900">
                Centro de Conocimiento ESEN - STUDENT
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.id}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rooms">Study Rooms</TabsTrigger>
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="fines">Fines</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms">
            <StudyRoomSection studyRooms={studyRooms} />
          </TabsContent>

          <TabsContent value="books">
            {/* 📚 Catálogo de libros */}
            <StudentLibraryCatalog />
          </TabsContent>

          <TabsContent value="fines">
            <FinesSection fines={fines} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
