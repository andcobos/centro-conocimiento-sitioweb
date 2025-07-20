"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { dataService } from "@/lib/data-service"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function Fines() {
  type Fine = {
    id: string
    studentId: string
    reason: string
    amount: string
    status: string
    date: string
  }

  const [fines, setFines] = useState<Fine[]>([])
  const [fineCreated, setFineCreated] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [showCalendar, setShowCalendar] = useState(false)


  const [newFine, setNewFine] = useState({
    studentId: "",
    reason: "",
    amount: "",
    date: "",
    status: "Not Paid"
  })

  const loadFines = async () => {
    const finesData = await dataService.getFines()
    setFines(
      finesData.map((fine: any) => ({
        id: fine.id ?? "",
        studentId: fine.studentId ?? "",
        reason: fine.reason ?? "",
        amount: fine.amount ?? "",
        status: fine.status ?? "Not Paid",
        date: fine.date ?? "",
      }))
    )
  }

  useEffect(() => {
    loadFines()
  }, [])

  const handleAddFine = async () => {
    if (
      !newFine.studentId ||
      !newFine.reason ||
      !newFine.amount ||
      !newFine.date
    ) {
      alert("All fields are required.");
      return;
    }

    await dataService.addFine(newFine);

    await dataService.logActivity(
      "Fine Added",
      newFine.studentId, // ✅ Carnet del estudiante
      `Added fine of $${newFine.amount} to student ${newFine.studentId} for "${newFine.reason}".`
    );

    setFineCreated(true);
    setNewFine({
      studentId: "",
      reason: "",
      amount: "",
      date: "",
      status: "Not Paid",
    });
    setSelectedDate(undefined);
    await loadFines();
  };

  const handleMarkFinePaid = async (fineId: string) => {
    await dataService.markFinePaid(fineId);

    await dataService.logActivity(
      "Mark Fine Paid",
      "Admin",
      `Marked fine ${fineId} as paid.`
    );

    await loadFines();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Fines Management</h2>

      {/* Alerta de éxito */}
      {fineCreated && (
        <Alert className="bg-green-100 border-green-500 text-green-700">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Fine successfully added.</AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => setFineCreated(false)}
          >
            OK
          </Button>
        </Alert>
      )}

      {/* Formulario para nueva multa */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold text-lg">Add New Fine</h3>

          <Input
            placeholder="Student ID (carnet)"
            value={newFine.studentId}
            onChange={(e) =>
              setNewFine({ ...newFine, studentId: e.target.value })
            }
          />

          <Input
            placeholder="Reason"
            value={newFine.reason}
            onChange={(e) => setNewFine({ ...newFine, reason: e.target.value })}
          />

          <Input
            placeholder="Amount ($)"
            value={newFine.amount}
            onChange={(e) => setNewFine({ ...newFine, amount: e.target.value })}
          />

          {/* Control para mostrar calendario */}
          <div className="space-y-2">
            <p className="font-medium">Fine Date:</p>

            <Button
              variant="outline"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {selectedDate ? newFine.date : "Select Fine Date"}
            </Button>

            {showCalendar && (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (date) {
                    setNewFine({
                      ...newFine,
                      date: date.toISOString().split("T")[0],
                    });
                    setShowCalendar(false); // Cierra el calendario después de seleccionar
                  }
                }}
              />
            )}
          </div>

          <Button
            onClick={handleAddFine}
            className="bg-green-600 hover:bg-green-700"
          >
            Add Fine
          </Button>
        </CardContent>
      </Card>

      {/* Tabla de multas */}
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
              {fines.map((fine) => (
                <TableRow key={fine.id}>
                  <TableCell>{fine.studentId}</TableCell>
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
                        onClick={() => handleMarkFinePaid(fine.id)}
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
    </div>
  );
}
