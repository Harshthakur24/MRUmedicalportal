"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, FileText, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { LogoutButton } from "@/components/logout-button";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const isAdmin =
    session?.user?.role === "PROGRAM_COORDINATOR" ||
    session?.user?.role === "HOD" ||
    session?.user?.role === "DEAN_ACADEMICS";

  const mainAdmin = session?.user?.role === "ADMIN";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Grid Background Pattern - Added as a fixed position element */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#004a7c]/5">
          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        </div>
      </div>

      {/* Header Section - Added backdrop blur */}
      <header className="bg-[#004a7c]/95 backdrop-blur-sm text-white py-2 md:py-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Image
                src="/mru.jpeg"
                alt="College Logo"
                width={40}
                height={40}
                className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-[60px] md:h-[60px]"
              />
              <h2 className="text-sm sm:text-lg md:text-2xl font-bold tracking-tight">
                MRU Medical Portal
              </h2>
            </div>

            {/* Mobile Menu Button with larger touch target */}
            <button
              className="md:hidden p-3 -mr-2 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 items-center">
              <Link href="/auth/login" className="hover:text-blue-200 transition">
                Login
              </Link>
              {session?.user?.role === "STUDENT" && (
                <Link
                  href="/auth/register"
                  className="hover:text-blue-200 transition"
                >
                  Register
                </Link>
              )}
              {session?.user?.role != "STUDENT" && !isAdmin && (
                <Link
                  href="/auth/register"
                  className="hover:text-blue-200 transition"
                >
                  Register
                </Link>
              )}
              {session?.user?.role === "STUDENT" && (
                <>
                  <Link
                    href="/dashboard"
                    className="hover:text-blue-200 transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/submit-report"
                    className="hover:text-blue-200 transition"
                  >
                    Submit Report
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  href={mainAdmin ? "/admin/dashboard" : "/dashboard/reports"}
                  className="hover:text-blue-200 transition"
                >
                  Dashboard
                </Link>
              )}
              <Link href="/help" className="hover:text-blue-200 transition">
                Help
              </Link>
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
              <LogoutButton
                className="text-red-500 hover:text-red-600"
              />
            </nav>
          </div>

          {/* Mobile Navigation - Full width dropdown */}
          {isMenuOpen && (
            <div className="md:hidden absolute left-0 right-0 top-full bg-[#003a61] shadow-lg">
              <nav className="flex flex-col px-4">
                <Link
                  href="/auth/login"
                  className="py-3 border-b border-white/10 hover:bg-[#004a7c] px-2 rounded-lg"
                >
                  Login
                </Link>
                {session?.user?.role === "STUDENT" && (
                  <>
                    <Link
                      href="/auth/register"
                      className="py-3 border-b border-white/10 hover:bg-[#004a7c] px-2 rounded-lg"
                    >
                      Register
                    </Link>
                    <Link
                      href="/dashboard"
                      className="py-3 border-b border-white/10 hover:bg-[#004a7c] px-2 rounded-lg"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/submit-report"
                      className="py-3 border-b border-white/10 hover:bg-[#004a7c] px-2 rounded-lg"
                    >
                      Submit Report
                    </Link>
                  </>
                )}
                <Link
                  href="/help"
                  className="py-3 border-b border-white/10 hover:bg-[#004a7c] px-2 rounded-lg"
                >
                  Help
                </Link>
                <LogoutButton
                  className="py-3 text-red-400 hover:bg-[#004a7c] px-2 rounded-lg text-left"
                />
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Updated with glass effect and animations */}
      <div className="relative bg-gradient-to-b from-[#004a7c]/10 to-transparent z-10">
        <div className="absolute inset-0 bg-grid-white-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-24">
          <div className="text-center relative">
            <div className="animate-fade-in-up">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                Medical Compliance
                <span className="block text-[#004a7c] mt-1 sm:mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[#004a7c] to-[#0056b3]">
                  Student Health Portal
                </span>
              </h1>
              <p className="mt-4 max-w-md mx-auto text-sm sm:text-base lg:text-xl text-gray-600 px-4">
                Streamlined medical report submission and tracking for university students.
              </p>
            </div>
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center gap-4 px-4 animate-fade-in-up animation-delay-200">
              {session?.user?.role === "STUDENT" && (
                <Link href="/submit-report" className="w-full sm:w-auto group">
                  <Button className="bg-[#007bff] hover:bg-[#0056b3] px-10 py-8 text-lg font-semibold rounded-3xl text-white hover:scale-105 transition duration-50">
                    Submit Medical Report

                  </Button>
                </Link>
              )}
              {session?.user && (
                <Link href={mainAdmin ? "/admin/dashboard" : isAdmin ? "/dashboard/reports" : "/dashboard"} className="w-full sm:w-auto group">
                  <Button
                    variant="outline"
                    className="border-[#004a7c] text-[#004a7c] hover:bg-gray-100 px-10 py-8 text-lg font-semibold rounded-3xl hover:scale-105 transition duration-50"
                  >
                    View Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Updated with glass morphism */}
      <div className="py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Use Our Portal?
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Our secure platform ensures easy, compliant, and confidential medical report management.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 px-4">
            {/* Updated Feature Cards with glass morphism */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/90">
              <CardHeader className="pb-2 space-y-2">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#004a7c] to-[#0056b3] text-white mb-4 mx-auto transform transition-transform duration-300 hover:rotate-12">
                  <FileText className="h-8 w-8" />
                </div>
                <CardTitle className="text-center text-xl text-[#004a7c] font-bold">
                  Simplified Submission
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-base text-gray-600">
                  Quick and secure medical report uploads with minimal effort.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/90">
              <CardHeader className="pb-2 space-y-2">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#004a7c] to-[#0056b3] text-white mb-4 mx-auto transform transition-transform duration-300 hover:rotate-12">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-center text-xl text-[#004a7c] font-bold">
                  Complete Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-base text-gray-600">
                  Advanced security protocols ensure your sensitive medical
                  information remains confidential.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/90">
              <CardHeader className="pb-2 space-y-2">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#004a7c] to-[#0056b3] text-white mb-4 mx-auto transform transition-transform duration-300 hover:rotate-12">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <CardTitle className="text-center text-xl text-[#004a7c] font-bold">
                  Academic Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-base text-gray-600">
                  Seamless connection with university systems for efficient
                  record management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer - Updated with gradient and blur */}
      <footer className="bg-gradient-to-b from-[#004a7c]/95 to-[#003a61] backdrop-blur-sm text-white py-8 md:py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm md:text-base opacity-90 text-center">
            © 2024 University Medical Compliance Portal
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
            <Link
              href="/privacy"
              className="text-sm md:text-base hover:text-blue-200 transition-colors duration-200 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm md:text-base hover:text-blue-200 transition-colors duration-200 hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-sm md:text-base hover:text-blue-200 transition-colors duration-200 hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
