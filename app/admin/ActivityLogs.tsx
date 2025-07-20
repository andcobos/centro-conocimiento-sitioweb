"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History } from "lucide-react"
import { dataService } from "@/lib/data-service"

export default function ActivityLogs() {
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [actionFilter, setActionFilter] = useState<string>("")
  const [userFilter, setUserFilter] = useState<string>("")

  useEffect(() => {
    const loadLogs = async () => {
      const logsData = await dataService.getActivityLogs()
      setActivityLogs(logsData)
    }
    loadLogs()
  }, [])

  const filteredLogs = activityLogs.filter(
    (log) =>
      (actionFilter !== "all" ? log.action === actionFilter : true) &&
      (userFilter
        ? log.user.toLowerCase().includes(userFilter.toLowerCase())
        : true)
  );


  return (
    <div className="space-y-6">
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

        <CardContent className="space-y-4">
          {/* Resumen + Filtros */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <p>Total Records: {filteredLogs.length}</p>

            <Input
              placeholder="Search by user ID..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-52"
            />

            <Select onValueChange={(value) => setActionFilter(value)}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Filter by action..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>{" "}
                {/* ✅ Ya no es "" */}
                <SelectItem value="Book Loan Created">
                  Book Loan Created
                </SelectItem>
                <SelectItem value="Fine Added">Fine Added</SelectItem>
                <SelectItem value="Room Requested">Room Requested</SelectItem>
                <SelectItem value="Login">Login</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabla */}
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
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.action.includes("Fine") ? "destructive" : "default"
                      }
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No matching logs found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
