"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { BookOpen, LogOut, Plus, Search, History } from "lucide-react"
import { dataService } from "@/lib/data-service"

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false)
  const [newStudentId, setNewStudentId] = useState("")
  const [newStudentName, setNewStudentName] = useState("")
  const [newBookTitle, setNewBookTitle] = useState("")
  const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false)
  const [newBookId, setNewBookId] = useState("")
  const [newBookAuthor, setNewBookAuthor] = useState("")


  type Student = {
    id: string;
    name: string;
    email: string;
    status: string;
  };

  const [students, setStudents] = useState<Student[]>([])
  type StudyRoom = {
    id: number;
    name: string;
    status: string;
    occupiedBy: string | null;
    occupiedUntil: string | null;
  };

  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([])
  type Fine = {
    studentId: string;
    reason: string;
    amount: string;
    status: string;
    date: string;
  };
  const [fines, setFines] = useState<Fine[]>([])
  type ActivityLog = {
    timestamp: string;
    action: string;
    user: string;
    details: string;
  };

  const [books, setBooks] = useState<any[]>([])
  const [bookLoans, setBookLoans] = useState<any[]>([])

  useEffect(() => {
    const loadBooks = async () => {
      const booksData = await dataService.getBooksCatalog();
      setBooks(booksData);
    };
    const loadBookLoans = async () => {
      const loansData = await dataService.getBookLoans();
      setBookLoans(loansData);
    };
    loadBooks();
    loadBookLoans();
  }, []);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsData, roomsData, finesData, logsData] = await Promise.all([
          dataService.getStudents(),
          dataService.getStudyRooms(),
          dataService.getFines(),
          dataService.getActivityLogs(),
        ])
        setStudents(
          studentsData.map((student: any) => ({
            id: student.id,
            name: student.name ?? "",
            email: student.email ?? "",
            status: student.status ?? "Active",
          }))
        )
        setStudyRooms(
          roomsData.map((room: any) => ({
            id: typeof room.id === "number" ? room.id : Number(room.id),
            name: room.name ?? "",
            status: room.status ?? "Available",
            occupiedBy: room.occupiedBy ?? null,
            occupiedUntil: room.occupiedUntil ?? null,
          }))
        )
        setFines(
          finesData.map((fine: any) => ({
            studentId: fine.studentId ?? fine.id ?? "",
            reason: fine.reason ?? "",
            amount: fine.amount ?? "",
            status: fine.status ?? "Not Paid",
            date: fine.date ?? "",
          }))
        )
        setActivityLogs(
          logsData.map((log: any) => ({
            timestamp: log.timestamp ?? "",
            action: log.action ?? "",
            user: log.user ?? "",
            details: log.details ?? "",
          }))
        )
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }
    loadData()
  }, [])

  const filteredStudents = students.filter(
    (student) =>
      student.id.includes(searchTerm) ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = async () => {
    if (!newStudentId || !newStudentName) {
      alert("Please enter both ID and Name.");
      return;
    }

    try {
      const newStudent = {
        id: newStudentId,
        name: newStudentName, // Ahora sí usas el nombre
        email: `${newStudentId}@university.edu`,
        status: "Active",
      };
      await dataService.addStudent(newStudent);

      const updatedStudents = await dataService.getStudents();
      setStudents(
        updatedStudents.map((student: any) => ({
          id: student.id,
          name: student.name ?? "",
          email: student.email ?? "",
          status: student.status ?? "Active",
        }))
      );

      setIsAddStudentDialogOpen(false);
      setNewStudentId("");
      setNewStudentName(""); // Limpiar nombre también
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleAddBook = async () => {
    if (!newBookTitle) {
      alert("Please enter the book title.");
      return;
    }

    const newBook = {
      bookId: newBookId,
      title: newBookTitle,
      author: newBookAuthor,
    };

    await dataService.addBookToCatalog(newBook);

    const booksData = await dataService.getBooksCatalog();
    setBooks(booksData);

    setIsAddBookDialogOpen(false);
    setNewBookId("");
    setNewBookTitle("");
    setNewBookAuthor("");
  };


  const handleRoomAction = (roomId: number, action: string) => {
    // Handle room management actions
    console.log(`${action} room ${roomId}`)
  }

  const handleMarkFinePaid = (studentId: string) => {
    // Handle marking fine as paid
    console.log(`Mark fine paid for student ${studentId}`)
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  const handleAcceptLoan = async (loanId: string) => {
    const dueDate = prompt("Enter due date (YYYY-MM-DD):");
    if (dueDate) {
      await dataService.setLoanDueDate(loanId, dueDate);
      await dataService.updateLoanStatus(loanId, "In Use");

      // Opcional: refrescar lista de préstamos
      const loans = await dataService.getBookLoans();
      setBookLoans(loans);
    }
  };

  const handleUpdateLoanStatus = async (bookId: string, status: string) => {
    await dataService.updateLoanStatus(bookId, status);
    const booksData = await dataService.getBooksCatalog();
    setBooks(booksData);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Knowledge Center - Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, Administrator
              </span>
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
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="rooms">Study Rooms</TabsTrigger>
            <TabsTrigger value="fines">Fines</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
            <TabsTrigger value="library">Library (Catalog)</TabsTrigger>
            <TabsTrigger value="loans">Book Loans</TabsTrigger>
          </TabsList>

          {/* Students Management Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Student Management
              </h2>
              <Dialog
                open={isAddStudentDialogOpen}
                onOpenChange={setIsAddStudentDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student ID
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                      Register a new student in the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="newStudentId">Student ID (Carnet)</Label>
                      <Input
                        id="newStudentId"
                        placeholder="Enter student ID"
                        value={newStudentId}
                        onChange={(e) => setNewStudentId(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newStudentName">Student Name</Label>
                      <Input
                        id="newStudentName"
                        placeholder="Enter full name"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddStudentDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddStudent}>Add Student</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students by ID or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.id}
                        </TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.status === "Active"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Study Rooms Management Tab */}
          <TabsContent value="rooms" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Study Room Management
            </h2>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Occupied By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studyRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">
                          {room.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              room.status === "Available"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {room.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{room.occupiedBy || "—"}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {room.status === "Available" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleRoomAction(room.id, "occupy")
                                }
                              >
                                Mark Occupied
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleRoomAction(room.id, "free")
                                }
                              >
                                Free Room
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fines Management Tab */}
          <TabsContent value="fines" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Fines Management
            </h2>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fines.map((fine, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {fine.studentId}
                        </TableCell>
                        <TableCell>{fine.reason}</TableCell>
                        <TableCell>{fine.amount}</TableCell>
                        <TableCell>{fine.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              fine.status === "Paid" ? "default" : "destructive"
                            }
                          >
                            {fine.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {fine.status === "Not Paid" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkFinePaid(fine.studentId)}
                            >
                              Mark Paid
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Library*/}
          <TabsContent value="library" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Library Catalog
            </h2>

            <Card>
              <CardContent className="pt-6">
                <Dialog
                  open={isAddBookDialogOpen}
                  onOpenChange={setIsAddBookDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Book
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Book</DialogTitle>
                      <DialogDescription>
                        Register a new book in the catalog.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Book ID</Label>
                        <Input
                          placeholder="Enter book ID"
                          value={newBookId}
                          onChange={(e) => setNewBookId(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input
                          placeholder="Enter book title"
                          value={newBookTitle}
                          onChange={(e) => setNewBookTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Author</Label>
                        <Input
                          placeholder="Enter author name"
                          value={newBookAuthor}
                          onChange={(e) => setNewBookAuthor(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddBookDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddBook}>Add Book</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book) => (
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
          </TabsContent>

          {/* Book Loans Tab */}
          <TabsContent value="loans" className="space-y-6">
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
                        <TableCell>
                          {loan.status === "Pending" && (
                            <Button
                              onClick={() => handleAcceptLoan(loan.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Accept Loan
                            </Button>
                          )}
                          {loan.status === "In Use" && (
                            <Button
                              onClick={() =>
                                handleUpdateLoanStatus(loan.id, "Returned")
                              }
                            >
                              Mark Returned
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Activity Logs</h2>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  System-wide activity and transaction logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {log.timestamp}
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
