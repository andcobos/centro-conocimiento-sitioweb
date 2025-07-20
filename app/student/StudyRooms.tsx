"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Users, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTitle } from "@/components/ui/alert";
import { dataService } from "@/lib/data-service";
import { useAuth } from "@/contexts/auth-context";

export function StudyRoomSection({ studyRooms }: { studyRooms: any[] }) {
  const { user, loading } = useAuth();
  const studentId = user?.id;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [studentRequest, setStudentRequest] = useState<any>(null);

  useEffect(() => {
    if (!studentId) return;
    loadStudentRequest();
  }, [studentId]);

  const loadStudentRequest = async () => {
    if (!studentId) return;
    const requests = await dataService.getStudentRoomRequest(studentId);
    setStudentRequest(requests[0] || null);
  };

  const handleRequest = async () => {
    if (!studentId) return;

    const firstAvailableRoom = studyRooms.find(
      (room) => room.status === "Available"
    );

    if (!firstAvailableRoom) {
      alert("No available rooms at the moment.");
      return;
    }

    await dataService.requestStudyRoom(firstAvailableRoom.id, studentId);
    await loadStudentRequest();
    setIsDialogOpen(false);
  };

  const handleReleaseRoom = async () => {
    if (!studentRequest) return;
    await dataService.releaseStudyRoom(studentRequest.id);
    await loadStudentRequest();
  };

  const isRoomExpired = (room: any) => {
    if (!room.occupiedUntil) return false;
    return new Date(room.occupiedUntil) < new Date();
  };

  if (loading) {
    return <p className="text-center py-4">Loading...</p>;
  }

  if (!studentId) {
    return (
      <p className="text-center py-4 text-red-500">
        Student not authenticated. Please login.
      </p>
    );
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
                You’ll be assigned the first available room.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRequest}>Confirm Request</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estado actual de la solicitud */}
      {studentRequest ? (
        <Alert>
          <AlertTitle className="h-4 w-4" />
          <AlertDescription>
            {studentRequest.status === "Pending"
              ? `Your room request is pending approval for room ${studentRequest.roomName || studentRequest.id}.`
              : `You currently have assigned room ${studentRequest.roomName || studentRequest.id}.`}
          </AlertDescription>

          {studentRequest.status === "Occupied" && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="destructive"
                onClick={handleReleaseRoom}
                className="flex items-center"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Release Room
              </Button>
            </div>
          )}
        </Alert>
      ) : (
        <Alert>
          <AlertTitle className="h-4 w-4" />
          <AlertDescription>
            You have no active or assigned room.
          </AlertDescription>
        </Alert>
      )}

      {/* Renderizado de las salas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyRooms.map((room) => {
          const expired = isRoomExpired(room);

          return (
            <Card key={room.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {room.name}
                  <span
                    className={
                      expired
                        ? "text-red-600 font-bold"
                        : room.status === "Available"
                        ? "text-green-600 font-bold"
                        : "text-gray-600"
                    }
                  >
                    {expired ? "Room Expired" : room.status}
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
          );
        })}
      </div>
    </div>
  );
}
