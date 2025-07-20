"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AddBookForm from "@/components/AddBookForm"
import { dataService } from "@/lib/data-service"
import { Pencil, Trash } from "lucide-react"

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

  const handleEditBook = async (book: any) => {
    const newTitle = prompt("New Title:", book.title)
    const newAuthor = prompt("New Author:", book.author)

    if (!newTitle || !newAuthor) {
      alert("Both title and author are required.")
      return
    }

    await dataService.updateBook(book.id, {
      title: newTitle,
      author: newAuthor
    })

    alert("Book updated successfully.")
    await loadBooks()
  }

  const handleDeleteBook = async (bookId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this book?")
    if (!confirmDelete) return

    await dataService.deleteBook(bookId)
    alert("Book deleted.")
    await loadBooks()
  }

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
                <TableHead>Image</TableHead>
                <TableHead>Book ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <img
                      src={
                        book.imageUrl ||
                        "https://via.placeholder.com/80x100?text=No+Image"
                      }
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>{book.bookId}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBook(book)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
