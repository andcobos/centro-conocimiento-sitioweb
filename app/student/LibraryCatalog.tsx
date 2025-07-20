"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { dataService } from "@/lib/data-service"

export default function StudentLibraryCatalog() {
  const { user, loading } = useAuth()
  const studentId = user?.id

  const [books, setBooks] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    if (studentId) loadRequests()
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

  const activeRequests = requests.filter(
    (loan) => loan.status === "Pending" || loan.status === "On Time"
  )

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
          const existingRequest = activeRequests.find(
            (loan) => loan.bookId === book.bookId
          )

          return (
            <Card key={book.id}>
              <CardHeader>
                <div className="flex justify-center">
                  {book.imageUrl && (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="w-32 h-40 object-cover rounded"
                    />
                  )}
                </div>
                <CardTitle className="text-center mt-2">{book.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">
                  Author: {book.author}
                </p>
                {existingRequest ? (
                  <p className="text-green-600 font-bold mt-2 text-center">
                    {existingRequest.status === "Pending"
                      ? "Request Pending"
                      : "Book Borrowed"}
                  </p>
                ) : (
                  <div className="flex justify-center">
                    <Button
                      className="mt-2 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleBorrow(book)}
                    >
                      Request Book
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
