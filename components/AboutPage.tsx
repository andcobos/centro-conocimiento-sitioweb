'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, Users, Wifi, Coffee, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"


export function AboutPage() {
  useEffect(() => {
    const bgDiv = document.querySelector(".custom-cursor-bg") as HTMLElement | null;
    if (!bgDiv) return; // 🔐 Seguridad

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top } = bgDiv.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      bgDiv.style.setProperty("--x", `${x}px`);
      bgDiv.style.setProperty("--y", `${y}px`);
    };

    bgDiv.addEventListener("mousemove", handleMouseMove);

    return () => {
      bgDiv.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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
                Centro de Conocimiento ESEN
              </h1>
            </div>
            <div className="flex items-center">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-700 text-white relative overflow-hidden custom-cursor-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              CENTRO DE CONOCIMIENTO ESEN
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Your gateway to academic resources, collaborative study spaces,
              and comprehensive library services. Empowering students and
              faculty with the tools they need to succeed.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About CC</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                The University Knowledge Center serves as the heart of academic
                life on campus, providing students and faculty with access to
                extensive library resources, collaborative study spaces, and
                cutting-edge technology.
              </p>
              <p>
                Our mission is to foster learning, research, and intellectual
                growth by creating an environment that supports both individual
                study and collaborative work. We believe that knowledge sharing
                and community learning are essential to academic success.
              </p>
              <p>
                With state-of-the-art facilities, comprehensive digital
                resources, and dedicated support staff, we're committed to
                helping every member of our university community achieve their
                academic goals.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/esencampus.jpg?height=400&width=500"
              alt="Knowledge Center Interior"
              className="rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-200 ease-in-out"
            />
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center transition-transform transform hover:scale-105 hover:shadow-xl duration-200 ease-in-out">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Library Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access to thousands of books, journals, and digital resources
                  across all academic disciplines.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center transition-transform transform hover:scale-105 hover:shadow-xl duration-200 ease-in-out">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Study Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Private and group study rooms equipped with modern technology
                  for collaborative learning.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center transition-transform transform hover:scale-105 hover:shadow-xl duration-200 ease-in-out">
              <CardHeader>
                <Wifi className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Digital Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  High-speed internet, computer workstations, and access to
                  online databases and e-books.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hours and Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Monday - Thursday:</span>
                <span>7:00 AM - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Friday:</span>
                <span>7:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>12:00 PM - 10:00 PM</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Get in touch with our support team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>help@university-kc.edu</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Building A, Floor 2, University Campus</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Additional Amenities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Coffee className="h-8 w-8 text-blue-600 mb-2" />
              <h4 className="font-semibold">Café Area</h4>
              <p className="text-sm text-gray-600">
                Refreshments and light meals available
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <h4 className="font-semibold">Group Collaboration</h4>
              <p className="text-sm text-gray-600">
                Spaces designed for team projects
              </p>
            </div>
            <div className="flex flex-col items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
              <h4 className="font-semibold">Research Support</h4>
              <p className="text-sm text-gray-600">
                Librarian assistance and research guidance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
