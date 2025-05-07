import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Notebook, School, Calendar, Star, ArrowRight } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Example toast notification that shows on page load
    toast({
      title: "Welcome to TutorConnectPro",
      description: "Find the perfect tutor for your learning needs",
      duration: 5000, // Disappears after 5 seconds
    });
  }, []);

  const features = [
    {
      icon: <Notebook className="h-10 w-10 text-primary" />,
      title: "Find Qualified Tutors",
      description: "Browse through profiles of experienced tutors in your area and filter by subject, location, and more."
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Flexible Scheduling",
      description: "Book tutors for sessions that fit your schedule with customizable days, times, and duration."
    },
    {
      icon: <School className="h-10 w-10 text-primary" />,
      title: "Subject Variety",
      description: "Find tutors for any subject you need help with, from mathematics and science to languages and arts."
    }
  ];

  const testimonials = [
    {
      text: "TutorConnectPro helped me find the perfect tutor for my daughter. Her grades have improved significantly since then!",
      author: "Sarah M., Parent"
    },
    {
      text: "As a tutor, this platform makes it easy to connect with students and manage my schedule. Highly recommended!",
      author: "Professor John D., Mathematics Tutor"
    },
    {
      text: "I was struggling with physics, but after just a month with my tutor from TutorConnectPro, I'm understanding concepts better than ever.",
      author: "Alex T., Student"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create an Account",
      description: "Sign up as a student or tutor in minutes"
    },
    {
      number: "02",
      title: "Find Your Match",
      description: "Browse tutors or wait for student requests"
    },
    {
      number: "03",
      title: "Book Sessions",
      description: "Schedule tutoring sessions that fit your calendar"
    },
    {
      number: "04",
      title: "Learn & Grow",
      description: "Enjoy personalized education and track progress"
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Connect with Expert Tutors for Personalized Learning
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto">
            TutorConnectPro helps you find qualified tutors in your area for any subject you need. Book sessions, track progress, and achieve your academic goals.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="text-base">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/tutor">
                  <Button size="lg" className="text-base">
                    Find tutor
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-base">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose TutorConnectPro?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy for students to connect with experienced tutors and for tutors to grow their teaching business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started with TutorConnectPro is simple and straightforward
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-semibold mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-medium">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 bg-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students and tutors on TutorConnectPro today and start your journey towards academic excellence.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="text-base">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="text-base">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-base">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
      <Toaster />
    </div>
  );
};

export default Home;
