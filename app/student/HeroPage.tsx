"use client";

import {
  BookOpen,
  Users,
  Library,
  FileText,
  TabletSmartphone,
} from "lucide-react";
import Image from "next/image";

export default function StudentHeroPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] flex items-center justify-center text-center bg-blue-900">
    <Image
        src="/centrodeconocimiento2.jpg"
        alt="Knowledge Center"
        fill
        className="object-cover opacity-80"
        priority
    />
    <div className="relative bg-white/80 p-4 sm:p-6 rounded-lg shadow-lg max-w-sm sm:max-w-md md:max-w-lg mx-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2 leading-snug">
        Welcome to Centro de Conocimiento ESEN
        </h1>
        <p className="text-sm sm:text-base text-gray-700">
        Explore all academic resources available to you as a student: study rooms,
        digital books, collaborative spaces, and more.
        </p>
    </div>
    </div>


      {/* Azul Separador */}
      <div className="my-12">
        {/* Separador modernizado */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 py-3 text-center text-white font-semibold text-xl shadow-sm tracking-wider rounded-full mx-auto w-fit px-6 mb-8">
            Available Resources
        </div>

        {/* Cards Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
                { title: "Study Rooms", icon: <Users className="w-10 h-10 text-blue-600 mx-auto mb-2" />, description: "Reserve private or group study rooms to focus or collaborate with classmates." },
                { title: "Library Catalog", icon: <Library className="w-10 h-10 text-blue-600 mx-auto mb-2" />, description: "Browse physical and digital books available at the Knowledge Center." },
                { title: "Study Groups", icon: <Users className="w-10 h-10 text-blue-600 mx-auto mb-2" />, description: "Join or create study groups to collaborate on projects and share knowledge." },
                { title: "E-Books", icon: <TabletSmartphone className="w-10 h-10 text-blue-600 mx-auto mb-2" />, description: "Access a wide variety of electronic books to study anytime, anywhere." },
                { title: "Magazines", icon: <FileText className="w-10 h-10 text-blue-600 mx-auto mb-2" />, description: "Keep up with the latest academic journals and magazines across disciplines." },
                { title: "Additional Resources", icon: <BookOpen className="w-10 h-10 text-blue-600 mx-auto mb-2" />, description: "Discover extra learning materials, workshops, and academic tools to support your success." },
            ].map((resource, index) => (
                <div
                key={index}
                className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 p-6 border border-gray-200"
                >
                {resource.icon}
                <h3 className="font-bold text-xl text-gray-800 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm">{resource.description}</p>
                </div>
            ))}
            </div>
        </div>
        </div>


        {/* Gallery Section */}
        <div className="my-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Gallery
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
            {[
              "/gallery/centrodeconocimiento1.jpg",
              "/gallery/centrodeconocimiento3.jpg",
              "/gallery/centrodeconocimiento4.jpg",
              "/gallery/centrodeconocimiento5.jpg",
              "/gallery/centrodeconocimiento6.jpg",
              "/gallery/centrodeconocimiento7.jpg",
            ].map((src, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg shadow-md group"
              >
                <img
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-60 object-cover transform transition duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}
