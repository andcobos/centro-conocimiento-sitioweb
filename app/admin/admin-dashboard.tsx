"use client"

import { BookOpen, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Students from "@/app/admin/Students"
import StudyRooms from "@/app/admin/StudyRooms"
import Fines from "@/app/admin/Fines"
import LibraryCatalog from "@/app/admin/LibraryCatalog"
import BookLoans from "@/app/admin/BookLoans"
import ActivityLogs from "@/app/admin/ActivityLogs"
import Image from "next/image"

export function AdminDashboard() {

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
              <Image
                src="/esenlogo.png"
                alt="ESEN Logo"
                width={32}
                height={32}
                className="mr-3 rounded"
              />
              <h1 className="text-xl font-semibold text-gray-900">
                Centro de Conocimiento ESEN - ADMIN
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, ADMIN</span>
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
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="loans">Book Loans</TabsTrigger>
          </TabsList>

          {/* pantallas específicas */}
          <TabsContent value="students">
            <Students />
          </TabsContent>

          <TabsContent value="rooms">
            <StudyRooms />
          </TabsContent>

          <TabsContent value="fines">
            <Fines />
          </TabsContent>

          <TabsContent value="logs">
            <ActivityLogs />
          </TabsContent>

          <TabsContent value="library">
            <LibraryCatalog />
          </TabsContent>

          <TabsContent value="loans">
            <BookLoans />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
