"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function FinesSection({ fines }: { fines: any[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Fines & Penalties</h2>
      <div className="grid grid-cols-1 gap-4">
        {fines.map((fine, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="font-medium">{fine.reason}</p>
                  <p className="text-sm text-gray-600">Date: {fine.date}</p>
                  <p className="text-lg font-semibold text-red-600">{fine.amount}</p>
                </div>
                <Badge variant={fine.status === "Paid" ? "default" : "destructive"}>{fine.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
