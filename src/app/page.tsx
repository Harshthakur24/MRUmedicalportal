"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, FileText, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'PROGRAM_COORDINATOR' ||
    session?.user?.role === 'HOD' ||
    session?.user?.role === 'DEAN_ACADEMICS';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="bg-[#004a7c] text-white py-4 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image
              src="/mru.jpeg"
              alt="College Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
            <h2 className="text-2xl font-bold tracking-tight">
              MRU Medical Compliance Portal
            </h2>
          </div>
          <nav className="space-x-6 flex items-center">
            <Link href="/auth/login" className="hover:text-blue-200 transition">Login</Link>
            {session?.user?.role === 'STUDENT' && <Link href="/auth/register" className="hover:text-blue-200 transition">Register</Link>}
            {session?.user?.role === 'STUDENT' && (
              <>
                <Link href="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
                <Link href="/submit-report" className="hover:text-blue-200 transition">Submit Report</Link>
              </>
            )}
            {isAdmin && (
              <Link href="/dashboard/reports" className="hover:text-blue-200 transition">Dashboard</Link>
            )}
            <Link href="/help" className="hover:text-blue-200 transition">Help</Link>
            <Link
              href="/profile"
              className="ml-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
            >
              <Image
                src="/avatar-image.jpg"
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-[#004a7c]/10 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Medical Compliance
              <span className="block text-[#004a7c] mt-2">Student Health Portal</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Streamlined medical report submission and tracking for university students and health administrators.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              {session?.user?.role === 'STUDENT' && (
                <Link href="/submit-report">
                  <Button className="bg-[#007bff] hover:bg-[#0056b3] px-10 py-5 text-lg font-semibold rounded-3xl text-white hover:scale-105 transition duration-50">
                    Submit Medical Report
                  </Button>
                </Link>
              )}
              {session?.user && (
                <Link href={isAdmin ? "/dashboard/reports" : "/dashboard"}>
                  <Button variant="outline" className="border-[#004a7c] text-[#004a7c] hover:bg-gray-100 px-10 py-5 text-lg font-semibold rounded-3xl hover:scale-105 transition duration-50">
                    View Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Use Our Portal?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our secure platform ensures easy, compliant, and confidential medical report management for students.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="bg-white border-2 border-[#004a7c]/10 hover:shadow-xl transition-all duration-300 hover:border-[#004a7c]/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#004a7c] text-white mb-4 mx-auto">
                  <FileText className="h-8 w-8" />
                </div>
                <CardTitle className="text-center text-xl text-[#004a7c]">
                  Simplified Submission
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Intuitive interface allows quick and secure medical report uploads with minimal effort.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-[#004a7c]/10 hover:shadow-xl transition-all duration-300 hover:border-[#004a7c]/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#004a7c] text-white mb-4 mx-auto">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-center text-xl text-[#004a7c]">
                  Complete Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Advanced security protocols ensure your sensitive medical information remains confidential.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-[#004a7c]/10 hover:shadow-xl transition-all duration-300 hover:border-[#004a7c]/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#004a7c] text-white mb-4 mx-auto">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <CardTitle className="text-center text-xl text-[#004a7c]">
                  Academic Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Seamless connection with university systems for efficient record management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#004a7c] to-[#003a61] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm opacity-90">
            © 2024 University Medical Compliance Portal. All Rights Reserved.
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/privacy" className="hover:text-blue-200 transition-colors duration-200">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-200 transition-colors duration-200">Terms of Service</Link>
            <Link href="/contact" className="hover:text-blue-200 transition-colors duration-200">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
