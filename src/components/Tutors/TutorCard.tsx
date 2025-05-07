import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatSubjectsList } from "@/utils/formatters";
import { TutorService } from "@/services/tutorService";
import { Link } from "react-router-dom";

interface TutorCardProps {
  tutor: {
    _id: string;
    name: string;
    email: string;
    profilePic?: string;
    address?: {
      city?: string;
      area?: string;
    };
    tutorProfile: {
      subjects: string[];
      experience: number;
      availability: string;
      monthlyRate: number;
      rating: number;
      numReviews: number;
    };
  };
  onRequestTuition?: () => void;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor, onRequestTuition }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={tutor.profilePic} alt={tutor.name} />
          <AvatarFallback>{tutor.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{tutor.name}</CardTitle>
          <CardDescription>
            {tutor.address?.city && `${tutor.address.city}, `}
            {tutor.address?.area}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Subjects</h4>
            <div className="flex flex-wrap gap-1">
              {tutor.tutorProfile.subjects.map((subject, index) => (
                <Badge key={index} variant="secondary">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Experience</h4>
              <p className="text-sm text-muted-foreground">
                {TutorService.formatExperience(tutor.tutorProfile.experience)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Monthly Rate</h4>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(tutor.tutorProfile.monthlyRate)}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium">Availability</h4>
            <p className="text-sm text-muted-foreground">
              {tutor.tutorProfile.availability}
            </p>
          </div>

          {tutor.tutorProfile.rating > 0 && (
            <div>
              <h4 className="text-sm font-medium">Rating</h4>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">
                  {tutor.tutorProfile.rating.toFixed(1)} ★
                </span>
                <span className="text-xs text-muted-foreground">
                  ({tutor.tutorProfile.numReviews} reviews)
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/tutors/${tutor._id}`}>View Profile</Link>
        </Button>
        {onRequestTuition && (
          <Button className="w-full" onClick={onRequestTuition}>
            Request Tuition
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TutorCard;
