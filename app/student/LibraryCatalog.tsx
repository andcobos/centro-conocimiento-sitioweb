"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { dataService } from "@/lib/data-service"

export default function StudentLibraryCatalog() {
  const { user, loading } = useAuth()
  const studentId = user?.id

  const [books, setBooks] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    if (studentId) {
      loadRequests()
    }
    loadBooks()
  }, [studentId])

  const handleBorrow = async (book: any) => {
    if (!studentId) {
      alert("You must be logged in to request a book.")
      return
    }

    await dataService.createBookLoan({
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      studentId,
      status: "Pending",
    })

    await loadRequests()
    alert(`You have requested: ${book.title}`)
  }

  const loadBooks = async () => {
    const booksData = await dataService.getBooksCatalog()
    setBooks(booksData)
  }

  const loadRequests = async () => {
    if (!studentId) return
    const studentRequests = await dataService.getStudentBookRequests(studentId)
    setRequests(studentRequests)
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <p>Loading...</p>
  if (!studentId) return <p>Please log in as a student.</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Library Catalog</h2>

      <Input
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => {
          const existingRequest = requests.find(
            (loan) =>
              loan.bookId === book.bookId &&
              (loan.status === "Pending" || loan.status === "On Time")
          )

          return (
            <Card key={book.id}>
              <CardHeader>
                <CardTitle>{book.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Author: {book.author}</p>
                {existingRequest ? (
                  <p className="text-green-600 font-bold mt-2">
                    {existingRequest.status === "Pending"
                      ? "Request Pending"
                      : "Book Borrowed"}
                  </p>
                ) : (
                  <Button
                    className="mt-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleBorrow(book)}
                  >
                    Request Book
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Sección de solicitudes pendientes / activas */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 mt-8">
          My Book Requests
        </h3>

        {requests.length === 0 ? (
          <p className="text-gray-500">You have no book requests.</p>
        ) : (
          requests.map((loan) => (
            <Alert key={loan.id}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {loan.title} —{" "}
                {loan.status === "Pending"
                  ? "Request Pending Approval"
                  : `Borrowed, due on ${loan.dueDate || "N/A"}`}
              </AlertDescription>
            </Alert>
          ))
        )}
      </div>
    </div>
  )
}
