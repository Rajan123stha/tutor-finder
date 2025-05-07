import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { tutorAPI, requestAPI } from "@/api";

interface TutorProfile {
  subjects: string[];
  experience: number;
  monthlyRate: number;
  rating: number;
}

interface Tutor {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  address?: {
    city?: string;
    area?: string;
  };
  tutorProfile: TutorProfile;
}

interface TutorCardProps {
  tutor: Tutor;
  onRequestTuition: (tutor: Tutor) => void;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor, onRequestTuition }) => {
  return (
    <Card className="w-full mb-4">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={tutor.profilePic} alt={tutor.name} />
            <AvatarFallback>
              {tutor.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{tutor.name}</h3>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm">
                  {tutor.tutorProfile.rating || "New"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-1">
              {tutor.tutorProfile.subjects.map((subject) => (
                <Badge key={subject} variant="outline" className="text-xs">
                  {subject}
                </Badge>
              ))}
            </div>

            <div className="mt-2 text-sm text-gray-500">
              <div>Experience: {tutor.tutorProfile.experience} years</div>
              <div>
                Location: {tutor.address?.city || "N/A"},{" "}
                {tutor.address?.area || "N/A"}
              </div>
              <div>Fee: ₹{tutor.tutorProfile.monthlyRate}/month</div>
            </div>

            <div className="mt-3">
              <Button size="sm" onClick={() => onRequestTuition(tutor)}>
                Request Tuition
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FindTutors = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm();

  // State for filter values
  const [filters, setFilters] = useState({
    subject: "",
    location: "",
    experience: "",
    minRate: "",
    maxRate: "",
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchTutors = async () => {
    try {
      setLoading(true);
      // Build query string from filters
      const queryParams: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams[key] = value;
      });

      const response = await tutorAPI.getAllTutors(queryParams);
      setTutors(response.data.data.tutors);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tutors. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handleRequestTuition = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setShowRequestForm(true);
  };

  const submitTuitionRequest = async (data: any) => {
    try {
      if (!selectedTutor) return;

      const requestData = {
        tutorId: selectedTutor._id,
        ...data,
      };

      await requestAPI.createRequest(requestData);

      toast({
        title: "Success",
        description: "Tuition request sent successfully!",
      });

      setShowRequestForm(false);
      setSelectedTutor(null);
      reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to send request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const applyFilters = () => {
    fetchTutors();
  };

  const clearFilters = () => {
    setFilters({
      subject: "",
      location: "",
      experience: "",
      minRate: "",
      maxRate: "",
    });
    // Fetch tutors without filters
    fetchTutors();
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Find Tutors</h1>

      {/* Filters Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Tutors</CardTitle>
          <CardDescription>
            Find tutors that match your requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g. Mathematics"
                value={filters.subject}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City or Area"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Min. Experience (years)</Label>
              <Select
                value={filters.experience}
                onValueChange={(value) =>
                  handleFilterChange("experience", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1">1+ years</SelectItem>
                  <SelectItem value="2">2+ years</SelectItem>
                  <SelectItem value="3">3+ years</SelectItem>
                  <SelectItem value="5">5+ years</SelectItem>
                  <SelectItem value="10">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minRate">Min. Monthly Fee (₹)</Label>
              <Input
                id="minRate"
                type="number"
                placeholder="Min fee"
                value={filters.minRate}
                onChange={(e) => handleFilterChange("minRate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxRate">Max. Monthly Fee (₹)</Label>
              <Input
                id="maxRate"
                type="number"
                placeholder="Max fee"
                value={filters.maxRate}
                onChange={(e) => handleFilterChange("maxRate", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button onClick={applyFilters}>Apply Filters</Button>
        </CardFooter>
      </Card>

      {/* Tutors List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading tutors...</div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-8">
            No tutors found matching your criteria. Try adjusting your filters.
          </div>
        ) : (
          tutors.map((tutor) => (
            <TutorCard
              key={tutor._id}
              tutor={tutor}
              onRequestTuition={handleRequestTuition}
            />
          ))
        )}
      </div>

      {/* Tuition Request Modal */}
      {showRequestForm && selectedTutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Request Tuition from {selectedTutor.name}</CardTitle>
              <CardDescription>
                Complete the form below to send a tuition request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(submitTuitionRequest)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select {...register("subject", { required: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedTutor.tutorProfile.subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Grade/Class Level</Label>
                  <Input
                    id="gradeLevel"
                    placeholder="e.g. 10th Grade, College"
                    {...register("gradeLevel", { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preferred Days</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={day}
                          value={day}
                          {...register("preferredDays", { required: true })}
                        />
                        <Label htmlFor={day} className="text-sm">
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Input
                    id="preferredTime"
                    placeholder="e.g. 4-6 PM"
                    {...register("preferredTime", { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (months)</Label>
                  <Input
                    id="duration"
                    type="number"
                    defaultValue={1}
                    min={1}
                    {...register("duration", { required: true, min: 1 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate", { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyFee">Monthly Fee (₹)</Label>
                  <Input
                    id="monthlyFee"
                    type="number"
                    defaultValue={selectedTutor.tutorProfile.monthlyRate}
                    {...register("monthlyFee", { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <textarea
                    id="notes"
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Any specific requirements or information..."
                    {...register("notes")}
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowRequestForm(false);
                      setSelectedTutor(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Send Request</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FindTutors;
