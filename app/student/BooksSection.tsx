"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function BooksSection({ borrowedBooks, loanHistory }: { borrowedBooks: any[], loanHistory: any[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Books</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Currently Borrowed</CardTitle>
            <CardDescription>Books you currently have checked out</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {borrowedBooks.map((book, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-gray-600">Due: {book.dueDate}</p>
                  </div>
                  <Badge>{book.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan History</CardTitle>
            <CardDescription>Previously borrowed books</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Borrowed</TableHead>
                  <TableHead>Returned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loanHistory.map((loan, index) => (
                  <TableRow key={index}>
                    <TableCell>{loan.title}</TableCell>
                    <TableCell>{loan.borrowDate}</TableCell>
                    <TableCell>{loan.returnDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
