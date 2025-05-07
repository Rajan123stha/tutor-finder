import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserRole, RegisterUserData } from "@/types";
import { BookOpen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const Register: React.FC = () => {
  const { register, isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [passwordError, setPasswordError] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Tutor specific fields
  const [subjects, setSubjects] = useState("");
  const [experience, setExperience] = useState("0");
  const [availability, setAvailability] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("0");
  const [education, setEducation] = useState("");
  const [about, setAbout] = useState("");

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Basic validation for all users
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";
    if (password.length < 8)
      errors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    // Phone validation
    if (!phoneNumber.trim()) errors.phoneNumber = "Phone number is required";

    // Address validation
    if (!city.trim()) errors.city = "City is required";
    if (!area.trim()) errors.area = "Area is required";

    // Tutor specific validation
    if (role === "tutor") {
      if (!subjects.trim()) errors.subjects = "Subjects are required";
      if (parseInt(experience, 10) < 0)
        errors.experience = "Experience must be a positive number";
      if (!availability.trim())
        errors.availability = "Availability is required";
      if (parseInt(monthlyRate, 10) <= 0)
        errors.monthlyRate = "Monthly rate must be greater than 0";
      if (!education.trim()) errors.education = "Education is required";
      if (!about.trim() || about.length < 50)
        errors.about =
          "Please provide a detailed description (at least 50 characters)";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData: RegisterUserData = {
      name,
      email,
      password,
      role,
      phoneNumber,
      address: {
        city,
        area,
      },
    };

    // Add tutor profile data if the user is registering as a tutor
    if (role === "tutor") {
      userData.tutorProfile = {
        subjects: subjects.split(",").map((subject) => subject.trim()),
        experience: parseInt(experience, 10),
        availability,
        monthlyRate: parseInt(monthlyRate, 10),
        education: education.split(",").map((edu) => edu.trim()),
        about,
      };
    }

    await register(userData);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-[85vh] p-4">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center">
            <BookOpen className="h-12 w-12 text-primary mb-2" />
            <h1 className="text-3xl font-bold gradient-heading">
              TutorConnectPro
            </h1>
            <p className="text-gray-600 text-center mt-2">
              Connect with qualified tutors for personalized learning
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name*</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={validationErrors.name ? "border-red-500" : ""}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={validationErrors.email ? "border-red-500" : ""}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number*</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className={
                    validationErrors.phoneNumber ? "border-red-500" : ""
                  }
                />
                {validationErrors.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.phoneNumber}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City*</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className={validationErrors.city ? "border-red-500" : ""}
                  />
                  {validationErrors.city && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Area*</Label>
                  <Input
                    id="area"
                    type="text"
                    placeholder="Andheri"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    required
                    className={validationErrors.area ? "border-red-500" : ""}
                  />
                  {validationErrors.area && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.area}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={validationErrors.password ? "border-red-500" : ""}
                />
                {validationErrors.password && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password*</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={
                    validationErrors.confirmPassword ? "border-red-500" : ""
                  }
                />
                {validationErrors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>I am a*</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value as UserRole)}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student/Parent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tutor" id="tutor" />
                    <Label htmlFor="tutor">Tutor</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Tutor Profile Fields - Only show when role is tutor */}
              {role === "tutor" && (
                <div className="border border-border rounded-lg p-4 space-y-4 mt-4">
                  <h3 className="text-lg font-medium">
                    Tutor Profile Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Please provide details about your tutoring services (all
                    fields are required)
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="subjects">Subjects You Teach*</Label>
                    <Input
                      id="subjects"
                      type="text"
                      placeholder="Math, Physics, Chemistry (comma-separated)"
                      value={subjects}
                      onChange={(e) => setSubjects(e.target.value)}
                      required={role === "tutor"}
                      className={
                        validationErrors.subjects ? "border-red-500" : ""
                      }
                    />
                    {validationErrors.subjects && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.subjects}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience (years)*</Label>
                      <Input
                        id="experience"
                        type="number"
                        min="0"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        required={role === "tutor"}
                        className={
                          validationErrors.experience ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.experience && (
                        <p className="text-red-500 text-sm">
                          {validationErrors.experience}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyRate">Monthly Rate (₹)*</Label>
                      <Input
                        id="monthlyRate"
                        type="number"
                        min="0"
                        value={monthlyRate}
                        onChange={(e) => setMonthlyRate(e.target.value)}
                        required={role === "tutor"}
                        className={
                          validationErrors.monthlyRate ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.monthlyRate && (
                        <p className="text-red-500 text-sm">
                          {validationErrors.monthlyRate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability*</Label>
                    <Input
                      id="availability"
                      type="text"
                      placeholder="Weekday evenings, Weekends"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      required={role === "tutor"}
                      className={
                        validationErrors.availability ? "border-red-500" : ""
                      }
                    />
                    {validationErrors.availability && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.availability}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Education*</Label>
                    <Input
                      id="education"
                      type="text"
                      placeholder="B.Sc Physics, M.Sc Mathematics (comma-separated)"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      required={role === "tutor"}
                      className={
                        validationErrors.education ? "border-red-500" : ""
                      }
                    />
                    {validationErrors.education && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.education}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about">About Yourself*</Label>
                    <Textarea
                      id="about"
                      placeholder="Describe your teaching style, experience, and approach (minimum 50 characters)"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      rows={4}
                      required={role === "tutor"}
                      className={validationErrors.about ? "border-red-500" : ""}
                    />
                    {validationErrors.about && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.about}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {about.length}/50 characters
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
              <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
