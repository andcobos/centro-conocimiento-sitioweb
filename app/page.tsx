'use client'

import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import { AboutPage } from "@/components/AboutPage"

export default function HomePage() {
  return (
    <>
      <AboutPage />
      
      <div className="flex justify-center my-8">
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Iniciar sesión
          </Button>
        </Link>
      </div>
    </>
  )
}
