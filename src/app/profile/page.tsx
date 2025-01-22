"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoutButton } from "@/components/logout-button";

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
      <div className="container max-w-2xl mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData?.email || ""}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData?.name || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          {session?.user?.role === "STUDENT" && (
            <>
              <div>
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  name="rollNumber"
                  value={formData?.rollNumber || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="className">Class</Label>
                <Input
                  id="className"
                  name="className"
                  value={formData?.className || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="studentContact">Contact Number</Label>
                <Input
                  id="studentContact"
                  name="studentContact"
                  value={formData?.studentContact || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="parentName">Parent&apos;s Name</Label>
                <Input
                  id="parentName"
                  name="parentName"
                  value={formData?.parentName || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="parentContact">Parent&apos;s Contact</Label>
                <Input
                  id="parentContact"
                  name="parentContact"
                  value={formData?.parentContact || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </>
          )}

          {(session?.user?.role === "PROGRAM_COORDINATOR" ||
            session?.user?.role === "HOD") && (
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={formData?.department || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData(profileData);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </form>

      <LogoutButton variant="destructive" />
    </div>
  );
}
