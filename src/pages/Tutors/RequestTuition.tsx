import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tuitionRequestSchema } from "@/schemas/tuitionRequest";
import type { TuitionRequestFormData } from "@/schemas/tuitionRequest";
import { tutorAPI, requestAPI } from "@/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const RequestTuition = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tutorId = searchParams.get("tutor");
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TuitionRequestFormData>({
    resolver: zodResolver(tuitionRequestSchema),
    defaultValues: {
      preferredDays: [],
      duration: 1,
      startDate: new Date(),
    },
  });

  useEffect(() => {
    const fetchTutor = async () => {
      if (!tutorId) {
        toast.error("Tutor ID is missing");
        navigate("/tutors");
        return;
      }

      try {
        const response = await tutorAPI.getTutor(tutorId);
        setTutor(response.data.data.tutor);
      } catch (error) {
        toast.error("Failed to fetch tutor details");
        navigate("/tutors");
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [tutorId, navigate]);

  const onSubmit = async (data: TuitionRequestFormData) => {
    if (!tutorId || !tutor?.tutorProfile?.monthlyRate) {
      toast.error("Missing required tutor information");
      return;
    }

    try {
      const requestData = {
        tutorId,
        subject: data.subject,
        gradeLevel: data.gradeLevel,
        preferredDays: data.preferredDays,
        preferredTime: data.preferredTime,
        duration: data.duration,
        startDate: data.startDate,
        monthlyFee: tutor.tutorProfile.monthlyRate,
        notes: data.notes,
      };

      await requestAPI.createRequest(requestData);
      toast.success("Tuition request sent successfully");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Request error:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Request Tuition</CardTitle>
          <CardDescription>
            Send a tuition request to {tutor?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <select
                {...register("subject")}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a subject</option>
                {tutor?.tutorProfile?.subjects.map((subject: string) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="text-red-500 text-sm">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeLevel">Grade Level</Label>
              <Input
                {...register("gradeLevel")}
                placeholder="e.g., 10th Grade, College"
              />
              {errors.gradeLevel && (
                <p className="text-red-500 text-sm">
                  {errors.gradeLevel.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Preferred Days</Label>
              <div className="grid grid-cols-2 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      onCheckedChange={(checked) => {
                        const currentDays = watch("preferredDays") || [];
                        if (checked) {
                          setValue("preferredDays", [...currentDays, day]);
                        } else {
                          setValue(
                            "preferredDays",
                            currentDays.filter((d) => d !== day)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={day} className="text-sm">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.preferredDays && (
                <p className="text-red-500 text-sm">
                  {errors.preferredDays.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredTime">Preferred Time</Label>
              <Input
                {...register("preferredTime")}
                placeholder="e.g., 4:00 PM - 6:00 PM"
              />
              {errors.preferredTime && (
                <p className="text-red-500 text-sm">
                  {errors.preferredTime.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (months)</Label>
              <Input
                type="number"
                min="1"
                {...register("duration", { valueAsNumber: true })}
              />
              {errors.duration && (
                <p className="text-red-500 text-sm">
                  {errors.duration.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setValue("startDate", newDate || new Date());
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                {...register("notes")}
                placeholder="Any specific requirements or information..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Request...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestTuition;
