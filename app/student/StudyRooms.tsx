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
import { MapPin, Clock, Users, XCircle, Info, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header y botón */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Study Rooms</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
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
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleRequest}>
                  Confirm Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estado de solicitud */}
        {studentRequest ? (
          <Alert className="bg-blue-50 border-blue-300 text-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-5 h-5 text-blue-600" />
              <AlertTitle>Status</AlertTitle>
            </div>
            <AlertDescription>
              {studentRequest.status === "Pending"
                ? `Your room request is pending approval for room ${studentRequest.roomName || studentRequest.id}.`
                : `You currently have assigned room ${studentRequest.roomName || studentRequest.id}.`}
            </AlertDescription>

            {studentRequest.status === "Occupied" && (
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleReleaseRoom}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Release Room
                </Button>
              </div>
            )}
          </Alert>
        ) : (
          <Alert className="bg-yellow-50 border-yellow-300 text-yellow-900">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <AlertTitle>No Room Assigned</AlertTitle>
            </div>
            <AlertDescription>
              You have no active or assigned room.
            </AlertDescription>
          </Alert>
        )}

        {/* Tarjetas de salas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyRooms.map((room) => {
            const expired = isRoomExpired(room);

            return (
              <Card
                key={room.id}
                className={`shadow-sm rounded-xl border ${
                  expired
                    ? "border-red-200 bg-red-50"
                    : room.status === "Available"
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-800">
                    {room.name}
                    <span
                      className={`text-sm font-bold ${
                        expired
                          ? "text-red-600"
                          : room.status === "Available"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
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
                    <div className="flex items-center text-sm text-green-700 font-medium">
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
    </div>
  );
}
