"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoutButton } from "@/components/logout-button";
import { User2, Mail, Contact, Phone, Users, GraduationCap } from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  department?: string;
  rollNumber?: string;
  studentContact?: string;
  parentName?: string;
  parentContact?: string;
  className?: string;
}

export default function ProfilePage() {
  const { data: session } = useSession({ required: true });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfileData(data);
      setFormData(data);
    } catch (error) {
      toast.error("Failed to load profile data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedData = await response.json();
      setProfileData(updatedData);
      setFormData(updatedData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-xl rounded-2xl p-8 animate-pulse">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64 bg-gray-200" />
            <Skeleton className="h-6 w-48 bg-gray-200" />
          </div>
          <div className="mt-8 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-32 bg-gray-200" />
                <Skeleton className="h-12 w-full bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <User2 className="text-white w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{profileData?.name}</h1>
              <p className="text-white/80">{session?.user?.role?.replace("_", " ")}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="flex items-center space-x-2 mb-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData?.email || ""}
                disabled
                className="bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label className="flex items-center space-x-2 mb-2">
                <Contact className="w-5 h-5 text-gray-500" />
                <span>Name</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData?.name || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`${isEditing
                  ? "border-blue-500 focus:ring-blue-500"
                  : "bg-gray-100 border-gray-300"
                  }`}
              />
            </div>

            {session?.user?.role === "STUDENT" && (
              <>
                <div>
                  <Label className="flex items-center space-x-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-gray-500" />
                    <span>Roll Number</span>
                  </Label>
                  <Input
                    id="rollNumber"
                    name="rollNumber"
                    value={formData?.rollNumber || ""}
                    disabled
                    className="bg-gray-100 border-gray-300"
                  />
                </div>

                <div>
                  <Label className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span>Class</span>
                  </Label>
                  <Input
                    id="className"
                    name="className"
                    value={formData?.className || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`${isEditing
                      ? "border-blue-500 focus:ring-blue-500"
                      : "bg-gray-100 border-gray-300"
                      }`}
                  />
                </div>

                <div>
                  <Label className="flex items-center space-x-2 mb-2">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span>Contact Number</span>
                  </Label>
                  <Input
                    id="studentContact"
                    name="studentContact"
                    value={formData?.studentContact || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`${isEditing
                      ? "border-blue-500 focus:ring-blue-500"
                      : "bg-gray-100 border-gray-300"
                      }`}
                  />
                </div>

                <div>
                  <Label className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span>Parent&apos;s Name</span>
                  </Label>
                  <Input
                    id="parentName"
                    name="parentName"
                    value={formData?.parentName || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`${isEditing
                      ? "border-blue-500 focus:ring-blue-500"
                      : "bg-gray-100 border-gray-300"
                      }`}
                  />
                </div>

                <div>
                  <Label className="flex items-center space-x-2 mb-2">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span>Parent&apos;s Contact</span>
                  </Label>
                  <Input
                    id="parentContact"
                    name="parentContact"
                    value={formData?.parentContact || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`${isEditing
                      ? "border-blue-500 focus:ring-blue-500"
                      : "bg-gray-100 border-gray-300"
                      }`}
                  />
                </div>
              </>
            )}

            {(session?.user?.role === "PROGRAM_COORDINATOR" ||
              session?.user?.role === "HOD") && (
                <div>
                  <Label className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span>Department</span>
                  </Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData?.department || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`${isEditing
                      ? "border-blue-500 focus:ring-blue-500"
                      : "bg-gray-100 border-gray-300"
                      }`}
                  />
                </div>
              )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="hover:bg-gray-100 transition-colors p-2"
                  onClick={() => {
                    setFormData(profileData);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 transition-colors p-2 text-white"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 transition-colors p-2 text-white"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </form>

        <div className="p-6 border-t border-gray-200">
          <LogoutButton variant="destructive" className="w-full" />
        </div>
      </div>
    </div>
  );
}