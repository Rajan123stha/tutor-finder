import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { tutorAPI } from "@/api";
import TutorProfileImage from "@/components/profile/TutorProfileImage";

interface ProfileData {
  subjects: string[];
  experience: number;
  availability: string;
  monthlyRate: number;
  education: string[];
  about: string;
  profilePic?: string;
}

const TutorProfile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    subjects: [],
    experience: 0,
    availability: "",
    monthlyRate: 0,
    education: [],
    about: "",
  });
  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);

  const [formState, setFormState] = useState({
    subjects: "",
    experience: "0",
    availability: "",
    monthlyRate: "0",
    education: "",
    about: "",
  });

  useEffect(() => {
    // Load tutor profile data from user context
    if (user) {
      // Set profile pic from either user or tutorProfile
      setProfilePic(user.profilePic || user?.tutorProfile?.profilePic);

      if (user.tutorProfile) {
        const { tutorProfile } = user;

        setProfileData({
          subjects: tutorProfile.subjects || [],
          experience: tutorProfile.experience || 0,
          availability: tutorProfile.availability || "",
          monthlyRate: tutorProfile.monthlyRate || 0,
          education: tutorProfile.education || [],
          about: tutorProfile.about || "",
        });

        // Set form state for editing
        setFormState({
          subjects: tutorProfile.subjects?.join(", ") || "",
          experience: tutorProfile.experience?.toString() || "0",
          availability: tutorProfile.availability || "",
          monthlyRate: tutorProfile.monthlyRate?.toString() || "0",
          education: tutorProfile.education?.join(", ") || "",
          about: tutorProfile.about || "",
        });
      }
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Format data for API call
      const updateData = {
        subjects: formState.subjects.split(",").map((s) => s.trim()),
        experience: parseInt(formState.experience, 10),
        availability: formState.availability,
        monthlyRate: parseInt(formState.monthlyRate, 10),
        education: formState.education.split(",").map((e) => e.trim()),
        about: formState.about,
      };

      // Call API to update profile
      await tutorAPI.updateTutorProfile(updateData);

      // Update local state
      setProfileData(updateData);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileImageUpdate = (newImageUrl: string) => {
    setProfilePic(newImageUrl);
    toast.success("Profile picture updated successfully");
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "tutor") {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Not Authorized</CardTitle>
            <CardDescription>
              You must be logged in as a tutor to view this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tutor Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Summary */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
            <CardDescription>How students will see you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <TutorProfileImage
              currentImage={profilePic}
              name={user.name || ""}
              onImageUpdate={handleProfileImageUpdate}
            />

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium">Subjects</h4>
                <p>{profileData.subjects.join(", ")}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Experience</h4>
                <p>{profileData.experience} years</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Monthly Rate</h4>
                <p>₹{profileData.monthlyRate}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Availability</h4>
                <p>{profileData.availability}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Education</h4>
                <p>{profileData.education.join(", ")}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Profile Completion</h4>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{
                      width: `${
                        Object.values(profileData).every((val) =>
                          Array.isArray(val) ? val.length > 0 : Boolean(val)
                        )
                          ? "100%"
                          : "75%"
                      }`,
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-xs font-medium">
                  {Object.values(profileData).every((val) =>
                    Array.isArray(val) ? val.length > 0 : Boolean(val)
                  )
                    ? "100%"
                    : "75%"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your tutor profile information
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subjects">Subjects You Teach*</Label>
                <Input
                  id="subjects"
                  name="subjects"
                  placeholder="Math, Physics, Chemistry (comma-separated)"
                  value={formState.subjects}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple subjects with commas
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)*</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    value={formState.experience}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyRate">Monthly Rate (₹)*</Label>
                  <Input
                    id="monthlyRate"
                    name="monthlyRate"
                    type="number"
                    min="0"
                    value={formState.monthlyRate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability*</Label>
                <Input
                  id="availability"
                  name="availability"
                  placeholder="Weekday evenings, Weekends"
                  value={formState.availability}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Describe when you're available to teach
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education*</Label>
                <Input
                  id="education"
                  name="education"
                  placeholder="B.Sc Physics, M.Sc Mathematics (comma-separated)"
                  value={formState.education}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple degrees with commas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About Yourself*</Label>
                <Textarea
                  id="about"
                  name="about"
                  placeholder="Describe your teaching style, experience, and approach"
                  value={formState.about}
                  onChange={handleChange}
                  rows={5}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formState.about.length}/50 characters (minimum 50 characters)
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TutorProfile;
