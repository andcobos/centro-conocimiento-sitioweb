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
import LoansAndRequests from "./LoansAndRequests"
import StudentHeroPage from "./HeroPage"

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
          <div className="flex flex-wrap items-center justify-between h-16">
            
            {/* Logo + Title */}
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <Image
                src="/esenlogo.png"
                alt="ESEN Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 leading-tight">
                CC ESEN - STUDENT
              </h1>
            </div>

            {/* User + Logout */}
            <div className="flex items-center space-x-3 text-sm sm:text-base">
              <span className="hidden sm:inline text-gray-600">
                Welcome, {user?.id}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-blue-700 border border-blue-700 hover:bg-blue-100"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>

          </div>
        </div>
      </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Tabs defaultValue="rooms" className="space-y-6">
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-5 w-full gap-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="rooms">Study Rooms</TabsTrigger>
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="fines">Fines</TabsTrigger>
              <TabsTrigger value="loansandrequests">Loans & Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <StudentHeroPage/>
            </TabsContent>

            <TabsContent value="rooms">
              <StudyRoomSection studyRooms={studyRooms} />
            </TabsContent>

            <TabsContent value="books">
              <StudentLibraryCatalog />
            </TabsContent>

            <TabsContent value="fines">
              <FinesSection fines={fines} />
            </TabsContent>

            <TabsContent value="loansandrequests">
              <LoansAndRequests/>
            </TabsContent>
          </Tabs>
        </div>
        
    </div>
  );
}
