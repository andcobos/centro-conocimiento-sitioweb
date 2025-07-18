"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { dataService } from "@/lib/data-service"

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

  useEffect(() => {
    const loadFines = async () => {
      const finesData = await dataService.getFines();
      setFines(
        finesData.map((fine: any) => ({
          id: fine.id ?? "",
          studentId: fine.studentId ?? "",
          reason: fine.reason ?? "",
          amount: fine.amount ?? "",
          status: fine.status ?? "Not Paid",
          date: fine.date ?? "",
        }))
      );
    };
    loadFines();
  }, []);

  const handleMarkFinePaid = async (fineId: string) => {
    await dataService.markFinePaid(fineId);
    const updatedFines = await dataService.getFines();
    setFines(
      updatedFines.map((fine: any) => ({
        id: fine.id ?? "",
        studentId: fine.studentId ?? "",
        reason: fine.reason ?? "",
        amount: fine.amount ?? "",
        status: fine.status ?? "Not Paid",
        date: fine.date ?? "",
      }))
    );
  };


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Fines Management</h2>

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
                    <Badge variant={fine.status === "Paid" ? "default" : "destructive"}>
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
  )
}
