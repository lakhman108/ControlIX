"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "../_components/EditProfileModal";
import { Pencil, Mail, Github } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/_lib/store";

const ProfilePage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Get user data from Redux store
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const handleSaveProfile = (data: {
    name: string;
    bio: string;
    githubProfile: string;
  }) => {
    // TODO: Implement profile update logic
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="md:flex items-start gap-6">
            {/* Left Column - Avatar */}
            <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center md:block">
              <div className="relative group w-32 md:w-full max-w-[200px]">
                <img
                  className="aspect-square rounded-full border-4 border-white shadow-md object-cover"
                  src={
                    userInfo?.profilePicture ||
                    `https://api.dicebear.com/9.x/lorelei/svg?seed=${userInfo?.email}`
                  }
                  alt="User Avatar"
                />
              </div>
            </div>

            {/* Right Column - Profile Info */}
            <div className="md:w-3/4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    {userInfo?.name}
                  </h1>
                  {userInfo?.isPremiumUser && (
                    <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
                      Premium User
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Pencil className="h-4 w-4" />
                  Edit profile
                </Button>
              </div>

              <div className="space-y-4 mt-8">
                <h2 className="text-lg font-semibold border-b pb-2">
                  Contact Information
                </h2>
                <div className="grid gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <span>{userInfo?.email}</span>
                    {userInfo?.isEmailVerified && (
                      <span className="text-green-600 text-xs">(Verified)</span>
                    )}
                  </div>
                  {userInfo?.githubProfile && (
                    <div className="flex items-center gap-3 text-sm">
                      <Github className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Github:</span>
                      <a
                        href={userInfo.githubProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {userInfo.githubProfile}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <h2 className="text-lg font-semibold border-b pb-2">About</h2>
                <p className="text-sm text-muted-foreground">
                  {userInfo?.bio || "No bio provided yet."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={{
          name: userInfo?.name || "",
          bio: userInfo?.bio || "",
          githubProfile: userInfo?.githubProfile || "",
        }}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfilePage;
