"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { dataService } from "@/lib/data-service"

export default function AddBookForm({ onBookAdded }: { onBookAdded: () => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [bookId, setBookId] = useState("")
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")

  const handleAddBook = async () => {
    if (!title) {
      alert("Please enter the book title.")
      return
    }

    const newBook = { bookId, title, author }
    await dataService.addBookToCatalog(newBook)
    onBookAdded()
    setIsDialogOpen(false)
    setBookId("")
    setTitle("")
    setAuthor("")
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Book
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>Register a new book in the catalog.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Book ID</Label>
            <Input
              placeholder="Enter book ID"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
            />
          </div>
          <div>
            <Label>Title</Label>
            <Input
              placeholder="Enter book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label>Author</Label>
            <Input
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBook}>Add Book</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
