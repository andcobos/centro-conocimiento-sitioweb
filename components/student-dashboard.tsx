"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Clock, Users, AlertTriangle, LogOut, MapPin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { dataService } from "@/lib/data-service"
import { useEffect } from "react"

export function StudentDashboard() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [requestStudentIds, setRequestStudentIds] = useState("")

  // Mock data
  const [studyRooms, setStudyRooms] = useState([])
  const [borrowedBooks, setBorrowedBooks] = useState([])
  const [fines, setFines] = useState([])
  const [loanHistory, setLoanHistory] = useState([]) // Declare loanHistory variable

  useEffect(() => {
    const loadData = async () => {
      try {
        const [roomsData, booksData, finesData, historyData] = await Promise.all([
          dataService.getStudyRooms(),
          dataService.getBorrowedBooks("12345"), // Replace with actual student ID
          dataService.getFines("12345"),
          dataService.getLoanHistory("12345"), // Fetch loan history data
        ])
        setStudyRooms(roomsData)
        setBorrowedBooks(booksData)
        setFines(finesData)
        setLoanHistory(historyData) // Set loan history data
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }
    loadData()
  }, [])

  const handleRoomRequest = () => {
    // Handle room request logic
    setIsRequestDialogOpen(false)
    setRequestStudentIds("")
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Knowledge Center</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Student</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rooms">Study Rooms</TabsTrigger>
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="fines">Fines</TabsTrigger>
          </TabsList>

          {/* Study Rooms Tab */}
          <TabsContent value="rooms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Study Rooms</h2>
              <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <MapPin className="h-4 w-4 mr-2" />
                    Request Study Room
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Study Room</DialogTitle>
                    <DialogDescription>
                      Enter the student IDs of all participants who will use the study room.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="studentIds">Student IDs (comma-separated)</Label>
                      <Input
                        id="studentIds"
                        placeholder="e.g., 12345, 67890, 11111"
                        value={requestStudentIds}
                        onChange={(e) => setRequestStudentIds(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleRoomRequest}>Confirm Request</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyRooms.map((room) => (
                <Card key={room.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {room.name}
                      <Badge variant={room.status === "Available" ? "default" : "secondary"}>{room.status}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {room.status === "Occupied" && room.occupiedUntil && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Occupied until {room.occupiedUntil}
                      </div>
                    )}
                    {room.status === "Available" && (
                      <div className="flex items-center text-sm text-green-600">
                        <Users className="h-4 w-4 mr-2" />
                        Ready for use
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You are currently in queue for a study room. Estimated wait time: 15 minutes.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Books Tab */}
          <TabsContent value="books" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Books</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Borrowed Books */}
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
                        <Badge variant={book.status === "Active" ? "default" : "destructive"}>{book.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Loan History */}
              <Card>
                <CardHeader>
                  <CardTitle>Loan History</CardTitle>
                  <CardDescription>Previously borrowed books</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book Title</TableHead>
                        <TableHead>Borrowed</TableHead>
                        <TableHead>Returned</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loanHistory.map((loan, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{loan.title}</TableCell>
                          <TableCell>{loan.borrowDate}</TableCell>
                          <TableCell>{loan.returnDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fines Tab */}
          <TabsContent value="fines" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Fines & Penalties</h2>

            <div className="grid grid-cols-1 gap-4">
              {fines.map((fine, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p className="font-medium">{fine.reason}</p>
                        <p className="text-sm text-gray-600">Date: {fine.date}</p>
                        <p className="text-lg font-semibold text-red-600">{fine.amount}</p>
                      </div>
                      <Badge variant={fine.status === "Paid" ? "default" : "destructive"}>{fine.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
