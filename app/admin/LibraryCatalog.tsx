"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import AddBookForm from "@/components/AddBookForm"
import { dataService } from "@/lib/data-service"

export default function LibraryCatalog() {
  const [books, setBooks] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const loadBooks = async () => {
    const booksData = await dataService.getBooksCatalog()
    setBooks(booksData)
  }

  useEffect(() => {
    loadBooks()
  }, [])

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Library Catalog</h2>

      <Input
        placeholder="Search books by title or author..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <CardContent className="pt-6">
          <AddBookForm onBookAdded={loadBooks} />

          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Book ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.bookId}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
