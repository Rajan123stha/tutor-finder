import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Upload, Camera } from "lucide-react";
import { tutorAPI } from "@/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TutorProfileImageProps {
  currentImage?: string;
  name: string;
  onImageUpdate: (newImageUrl: string) => void;
}

const TutorProfileImage = ({
  currentImage,
  name,
  onImageUpdate,
}: TutorProfileImageProps) => {
  const [uploading, setUploading] = useState(false);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    currentImage
  );

  // Update preview image when currentImage changes
  useEffect(() => {
    setPreviewImage(currentImage);
  }, [currentImage]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setShowSizeWarning(true);
      return;
    }

    // Show preview immediately
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewImage(localPreviewUrl);

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("profilePic", file);

      const response = await tutorAPI.updateProfilePicture(formData);

      // Log the response to debug
      console.log("Upload response:", response);

      // Check if the response contains the profile pic URL
      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.profilePic
      ) {
        onImageUpdate(response.data.data.profilePic);
        toast.success("Profile picture updated successfully");
      } else {
        // If the structure is different, try to find the URL
        let profilePicUrl = null;

        if (response?.data?.profilePic) {
          profilePicUrl = response.data.profilePic;
        } else if (response?.profilePic) {
          profilePicUrl = response.profilePic;
        }

        if (profilePicUrl) {
          onImageUpdate(profilePicUrl);
          toast.success("Profile picture updated successfully");
        } else {
          throw new Error("Invalid response format");
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      // If upload fails, revert to previous image
      setPreviewImage(currentImage);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <Avatar className="h-24 w-24">
            <AvatarImage src={previewImage} alt={name} />
            <AvatarFallback className="text-lg">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => document.getElementById("imageUpload")?.click()}
          >
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => document.getElementById("imageUpload")?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </>
            )}
          </Button>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        {!currentImage && (
          <p className="text-sm text-muted-foreground text-center">
            Adding a profile photo helps students connect with you better
          </p>
        )}
      </div>

      <AlertDialog open={showSizeWarning} onOpenChange={setShowSizeWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>File Too Large</AlertDialogTitle>
            <AlertDialogDescription>
              The selected image exceeds the maximum size limit of 5MB. Please
              choose a smaller image file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSizeWarning(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TutorProfileImage;
