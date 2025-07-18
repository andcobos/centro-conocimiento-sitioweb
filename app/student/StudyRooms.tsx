"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { dataService } from "@/lib/data-service"


useEffect(() => {
  const loadStudentRequest = async () => {
    const requests = await dataService.getStudentRoomRequest("12345")  // Usa su ID real
    setStudentRequest(requests[0])  // Si solo puede tener una solicitud activa
  }
  loadStudentRequest()
}, [])

export function StudyRoomSection({ studyRooms, onRequest }: { studyRooms: any[], onRequest: (ids: string) => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [requestStudentIds, setRequestStudentIds] = useState("")

  const handleRequest = () => {
    onRequest(requestStudentIds)
    setIsDialogOpen(false)
    setRequestStudentIds("")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Study Rooms</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                Enter student IDs of participants.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Label>Student IDs (comma-separated)</Label>
              <Input
                placeholder="e.g., 12345, 67890"
                value={requestStudentIds}
                onChange={(e) => setRequestStudentIds(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleRequest}>Confirm</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyRooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {room.name}
                <span
                  className={
                    room.status === "Available"
                      ? "text-green-600 font-bold"
                      : "text-gray-600"
                  }
                >
                  {room.status}
                </span>
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
          You are currently in queue for a study room. Estimated wait: 15 mins.
        </AlertDescription>
      </Alert>
    </div>
  );
}
function setStudentRequest(arg0: any) {
    throw new Error("Function not implemented.")
}

