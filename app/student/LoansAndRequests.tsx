"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { dataService } from "@/lib/data-service"

export default function LoansAndRequests() {
  const { user, loading } = useAuth()
  const studentId = user?.id

  const [requests, setRequests] = useState<any[]>([])
  const [loanHistory, setLoanHistory] = useState<any[]>([])

  useEffect(() => {
    if (studentId) {
      loadRequests()
      loadLoanHistory()
    }
  }, [studentId])

  const loadRequests = async () => {
    if (!studentId) return
    const studentRequests = await dataService.getStudentBookRequests(studentId)
    setRequests(studentRequests)
  }

  const loadLoanHistory = async () => {
    if (!studentId) return
    const history = await dataService.getLoanHistory(studentId)
    setLoanHistory(history)
  }

  const activeRequests = requests.filter(
    (loan) => loan.status === "Pending" || loan.status === "On Time"
  )

  const pastLoans = loanHistory.filter(
    (loan) => loan.status !== "Pending" && loan.status !== "On Time"
  )

  if (loading) return <p>Loading...</p>
  if (!studentId) return <p>Please log in as a student.</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Loans & Requests</h2>

      {/* Active Requests */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">My Active Book Requests</h3>
        {activeRequests.length === 0 ? (
          <p className="text-gray-500">You have no active book requests.</p>
        ) : (
          activeRequests.map((loan) => (
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

      {/* Loan History */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 mt-8">My Loan History</h3>
        {pastLoans.length === 0 ? (
          <p className="text-gray-500">You have no previous loans.</p>
        ) : (
          pastLoans.map((loan) => (
            <Alert key={loan.id}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {loan.title} — Status: {loan.status}
              </AlertDescription>
            </Alert>
          ))
        )}
      </div>
    </div>
  )
}
