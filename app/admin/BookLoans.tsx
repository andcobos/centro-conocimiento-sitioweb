"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { dataService } from "@/lib/data-service"

export default function BookLoans() {
  const [bookLoans, setBookLoans] = useState<any[]>([])

  useEffect(() => {
    const loadBookLoans = async () => {
      const loansData = await dataService.getBookLoans()
      setBookLoans(loansData)
    }
    loadBookLoans()
  }, [])

  const handleAcceptLoan = async (loanId: string) => {
    const dueDate = prompt("Enter due date (YYYY-MM-DD):")
    if (dueDate) {
      await dataService.setLoanDueDate(loanId, dueDate)
      await dataService.updateLoanStatus(loanId, "In Use")
      const updatedLoans = await dataService.getBookLoans()
      setBookLoans(updatedLoans)
    }
  }

  const handleUpdateLoanStatus = async (loanId: string, status: string) => {
    await dataService.updateLoanStatus(loanId, status)
    const updatedLoans = await dataService.getBookLoans()
    setBookLoans(updatedLoans)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Book Loans</h2>

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
                        onClick={() => handleAcceptLoan(loan.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Accept Loan
                      </Button>
                    )}
                    {loan.status === "In Use" && (
                      <>
                        <Button
                          onClick={() => handleUpdateLoanStatus(loan.id, "Returned")}
                          variant="outline"
                        >
                          Mark Returned
                        </Button>
                        <Button
                          onClick={() => handleUpdateLoanStatus(loan.id, "Late Return")}
                          variant="destructive"
                        >
                          Mark Late
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
