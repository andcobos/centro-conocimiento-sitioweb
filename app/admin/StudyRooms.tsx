"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { dataService } from "@/lib/data-service"

export default function StudyRooms() {
  type StudyRoom = {
    id: number;
    name: string;
    status: string;
    occupiedBy: string | null;
    occupiedUntil: string | null;
  }

  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([])

  useEffect(() => {
    const loadRooms = async () => {
      const roomsData = await dataService.getStudyRooms();
      setStudyRooms(
        roomsData.map((room: any) => ({
          id: typeof room.id === "number" ? room.id : Number(room.id ?? 0),
          name: room.name ?? "",
          status: room.status ?? "Available",
          occupiedBy: room.occupiedBy ?? null,
          occupiedUntil: room.occupiedUntil ?? null,
        }))
      );
    };
    loadRooms();
  }, []);

  const handleRoomAction = async (
    roomId: string,
    action: "occupy" | "free"
  ) => {
    const newStatus = action === "occupy" ? "Occupied" : "Available";
    await dataService.updateRoomStatus(roomId, newStatus);
    const roomsData = await dataService.getStudyRooms();
    setStudyRooms(
      roomsData.map((room: any) => ({
        id: typeof room.id === "number" ? room.id : Number(room.id ?? 0),
        name: room.name ?? "",
        status: room.status ?? "Available",
        occupiedBy: room.occupiedBy ?? null,
        occupiedUntil: room.occupiedUntil ?? null,
      }))
    );
  };


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Study Room Management</h2>

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
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>
                    <Badge variant={room.status === "Available" ? "default" : "secondary"}>
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
                          onClick={() => handleRoomAction(String(room.id), "occupy")}
                        >
                          Mark Occupied
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRoomAction(String(room.id), "free")}
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
    </div>
  )
}
