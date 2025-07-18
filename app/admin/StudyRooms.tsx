"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"  // Asegúrate de tener el componente Switch
import { dataService } from "@/lib/data-service"
import { Plus } from "lucide-react"

export default function StudyRooms() {
  type StudyRoom = {
    id: string
    name: string
    status: string
    occupiedBy: string | null
    occupiedUntil: string | null
    requestedBy?: string | null
  }

  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([])
  const [dueDate, setDueDate] = useState<{ [roomId: string]: string }>({})
  const [newRoomName, setNewRoomName] = useState("")

  const loadRooms = async () => {
    const roomsData = await dataService.getStudyRooms()
    setStudyRooms(roomsData.map((room: any) => ({
      id: room.id,
      name: room.name ?? "",
      status: room.status ?? "Available",
      occupiedBy: room.occupiedBy ?? null,
      occupiedUntil: room.occupiedUntil ?? null,
      requestedBy: room.requestedBy ?? null,
    })))
  }

  useEffect(() => {
    loadRooms()
  }, [])

  const handleApproveRequest = async (room: StudyRoom) => {
    if (!dueDate[room.id]) {
      alert("Please enter an end date.");
      return;
    }
    await dataService.approveStudyRoomRequest(
      room.id,
      room.requestedBy!,
      dueDate[room.id]
    );
    await loadRooms();
  };

  const handleToggleStatus = async (room: StudyRoom) => {
    const newStatus = room.status === "Available" ? "Occupied" : "Available"
    await dataService.updateRoomStatus(room.id, newStatus)
    await loadRooms()
  }

  const handleSetDueDate = async (roomId: string, date: string) => {
    setDueDate({ ...dueDate, [roomId]: date })
    await dataService.setOccupiedUntil(roomId, date)
    await loadRooms()
  }

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) return
    await dataService.addStudyRoom({ name: newRoomName, status: "Available", occupiedBy: null, occupiedUntil: null })
    setNewRoomName("")
    await loadRooms()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Study Room Management</h2>

      {/* Add New Room */}
      <div className="flex space-x-2 mb-4">
        <Input
          placeholder="Enter new room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <Button onClick={handleAddRoom}>
          <Plus className="mr-1 h-4 w-4" />
          Add Room
        </Button>
      </div>

      {/* Rooms as Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studyRooms.map((room) => (
          <Card key={room.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {room.name}
                <Badge variant={room.status === "Available" ? "default" : "destructive"}>
                  {room.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Toggle */}
              <div className="flex justify-between items-center">
                <span>{room.status === "Available" ? "Mark as Busy" : "Mark as Available"}</span>
                <Switch
                  checked={room.status === "Occupied"}
                  onCheckedChange={() => handleToggleStatus(room)}
                />
              </div>

              {/* Hour of Delivery */}
              <div>
                <label className="text-sm font-semibold text-gray-700">Occupied Until:</label>
                <Input
                  type="datetime-local"
                  value={dueDate[room.id] || room.occupiedUntil || ""}
                  onChange={(e) => handleSetDueDate(room.id, e.target.value)}
                />
              </div>

              {/* Occupied By */}
              {room.occupiedBy && (
                <p><strong>Occupied By:</strong> {room.occupiedBy}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
