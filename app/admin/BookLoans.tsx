"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar" // Asegúrate de tener un componente Calendar
import { format } from "date-fns"
import { BookLoan, dataService } from "@/lib/data-service"


export default function BookLoans() {
  const [bookLoans, setBookLoans] = useState<BookLoan[]>([])
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const loadBookLoans = async () => {
    const loansData = await dataService.getBookLoans()

    // Actualiza automáticamente el estado a "Expired" si la fecha ya pasó
    const today = new Date()
    for (const loan of loansData) {
      if (loan.status === "On Time" && loan.dueDate) {
        const dueDate = new Date(loan.dueDate)
        if (dueDate < today) {
          await dataService.updateLoanStatus(loan.id, "Expired")
        }
      }
    }

    const refreshedLoans = await dataService.getBookLoans()
    setBookLoans(refreshedLoans)
  }

  useEffect(() => {
    loadBookLoans()
  }, [])

  const handleApproveLoan = async (loanId: string) => {
    setSelectedLoanId(loanId)
  }

  const handleSetDueDate = async () => {
    if (selectedLoanId && selectedDate) {
      const dueDateStr = format(selectedDate, "yyyy-MM-dd")
      await dataService.setLoanDueDate(selectedLoanId, dueDateStr)
      await dataService.updateLoanStatus(selectedLoanId, "On Time")
      setSelectedLoanId(null)
      setSelectedDate(undefined)
      await loadBookLoans()
    }
  }

  const handleUpdateLoanStatus = async (loanId: string, status: string) => {
    await dataService.updateLoanStatus(loanId, status)
    await loadBookLoans()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Book Loans</h2>

      {selectedLoanId && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <p className="font-semibold">Select Due Date:</p>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
            <Button
              disabled={!selectedDate}
              onClick={handleSetDueDate}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm Due Date
            </Button>
            <Button variant="outline" onClick={() => setSelectedLoanId(null)}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book ID</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.bookId}</TableCell>
                  <TableCell>{loan.studentId}</TableCell>
                  <TableCell>{loan.status}</TableCell>
                  <TableCell>{loan.dueDate || "—"}</TableCell>
                  <TableCell className="space-x-2">
                    {loan.status === "Pending" && (
                      <Button
                        onClick={() => handleApproveLoan(loan.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve Loan
                      </Button>
                    )}
                    {loan.status === "On Time" && (
                      <>
                        <Button
                          onClick={() => handleUpdateLoanStatus(loan.id, "Handled")}
                          variant="outline"
                        >
                          Mark Handled
                        </Button>
                        <Button
                          onClick={() => handleUpdateLoanStatus(loan.id, "Expired")}
                          variant="destructive"
                        >
                          Mark Expired
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
