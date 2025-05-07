import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  Mail,
  BookOpen,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tutorAPI } from "@/api";
import { toast } from "sonner";

interface TutorType {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
  address: {
    city: string;
    area: string;
  };
  tutorProfile: {
    subjects: string[];
    experience: number;
    availability: string;
    rating: number;
    monthlyRate: number;
    about: string;
    education: string[];
  };
}

interface ReviewType {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

// Mock reviews (since we don't have a reviews feature in the backend yet)
const mockReviews: ReviewType[] = [
  {
    id: "1",
    name: "Alex J.",
    rating: 5,
    comment: "Excellent tutor! Helped me understand complex topics.",
    date: "2024-03-15",
  },
  {
    id: "2",
    name: "Sarah M.",
    rating: 4,
    comment: "Very knowledgeable and patient.",
    date: "2024-02-28",
  },
];

const TutorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tutor, setTutor] = useState<TutorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchTutor(id);
    }
  }, [id]);

  const fetchTutor = async (tutorId: string) => {
    try {
      setLoading(true);
      const response = await tutorAPI.getTutor(tutorId);
      setTutor(response.data.data.tutor);
    } catch (error) {
      toast.error("Failed to fetch tutor information");
      setError("Could not load tutor profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p>Loading tutor profile...</p>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-red-500 mb-4">{error || "Tutor not found"}</p>
        <Link to="/tutors">
          <Button>Back to Tutors</Button>
        </Link>
      </div>
    );
  }

  const location = tutor.address
    ? `${tutor.address.city}, ${tutor.address.area}`
    : "Location not specified";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tutor Profile</h1>
        <Link to="/tutors">
          <Button variant="outline">Back to Tutors</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Profile Summary */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
              <img
                src={
                  tutor.profilePic ||
                  "https://randomuser.me/api/portraits/men/32.jpg"
                }
                alt={tutor.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardTitle className="text-xl">{tutor.name}</CardTitle>
            <div className="flex items-center justify-center space-x-1 text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
              <span>{tutor.tutorProfile?.rating || "New"}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm">
              <Briefcase className="h-4 w-4 mr-2 text-primary" />
              <span>{tutor.tutorProfile?.experience} years experience</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>{location}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span>{tutor.tutorProfile?.availability}</span>
            </div>
            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-2 text-primary" />
              <span>${tutor.tutorProfile?.monthlyRate}/month</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              {tutor.tutorProfile?.subjects.map((subject) => (
                <Badge
                  key={subject}
                  variant="secondary"
                  className="font-normal"
                >
                  {subject}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link to={`/request-tuition?tutor=${tutor._id}`} className="w-full">
              <Button className="w-full">Request Tuition</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Right Column - Detailed Information */}
        <div className="md:col-span-2">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>About {tutor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    {tutor.tutorProfile?.about || "No information provided."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="education" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Education & Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {tutor.tutorProfile?.education &&
                  tutor.tutorProfile.education.length > 0 ? (
                    <ul className="space-y-2 list-disc pl-5">
                      {tutor.tutorProfile.education.map((edu, index) => (
                        <li key={index}>{edu}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No education information provided.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockReviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b pb-4 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{review.name}</div>
                          <div className="flex items-center text-amber-500">
                            {Array.from({ length: review.rating }).map(
                              (_, i) => (
                                <Star
                                  key={i}
                                  className="h-3.5 w-3.5 fill-amber-500"
                                />
                              )
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {review.date}
                        </div>
                        <p className="mt-2">{review.comment}</p>
                      </div>
                    ))}
                    {mockReviews.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No reviews yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
