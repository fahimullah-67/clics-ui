import { useState, useEffect } from "react";
import { Button } from "../components/custom-ui/Button";
import { Input } from "../components/custom-ui/Input";
import { Textarea } from "../components/custom-ui/Textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/custom-ui/Card";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  Sparkles,
  MessageSquare,
  User,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Hero animations
    gsap.fromTo(
      ".hero-badge",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6 },
    );
    gsap.fromTo(
      ".hero-title",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2 },
    );
    gsap.fromTo(
      ".hero-subtitle",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.4 },
    );

    // Scroll animations for cards
    const cards = [".form-card", ".info-card", ".team-card"];
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: { trigger: card, start: "top 85%" },
        },
      );
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form submitted:", formData);
    alert("Thank you for contacting us! We will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const teamMembers = [
    {
      name: "Fahim Ullah",
      role: "Full Stack Developer & AI Specialist",
      email: "fahimullah.pk.67@gmail.com",
      github: "https://github.com/Fahimullah-67",
      linkedin: "https://www.linkedin.com/in/fahimullah-fu67",
    },
    {
      name: "Sijad Khan",
      role: "UI Designer & Frontend Developer",
      email: "sijjad@clics.com",
      github: "https://github.com/SijjadKhanNiazi",
      linkedin: "https://www.linkedin.com/in/engineersijjad",
    },
    {
      name: "Abdullah Khawar",
      role: "AI Developer & RAG Specialist",
      email: "abdullah@clics.com",
      github: "https://github.com/AbdullahKhawar",
      linkedin: "https://www.linkedin.com/in/abdullahkhawar",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white overflow-hidden">
        {/* Simple pattern overlay without inline SVG issues */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[length:40px_40px] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%20d%3D%22M20%200L40%2020L20%2040L0%2020z%22%2F%3E%3C%2Fsvg%3E')]"></div>
        </div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 text-center">
          <div className="hero-badge inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-5 py-2 mb-6 border border-white/30">
            <span className="text-sm font-medium tracking-wide">
              Get in Touch
            </span>
          </div>
          <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Have questions about CLICS? We're here to help you find the best
            loan options.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Contact Form Card */}
          <div className="form-card">
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden transition-all hover:shadow-2xl">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  Send Us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Your Name
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Clics"
                      required
                      className="border-slate-200 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="user@clics.com"
                      required
                      className="border-slate-200 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Subject
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      required
                      className="border-slate-200 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Message
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more..."
                      rows={5}
                      required
                      className="border-slate-200 focus:border-blue-400"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl py-2.5 shadow-md transition-all"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <div className="info-card">
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Email</h3>
                      <p className="text-slate-600">clicsumw.pk.67@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Phone</h3>
                      <p className="text-slate-600">+92 (21) 1234-5678</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Address</h3>
                      <p className="text-slate-600">Mianwali, Pakistan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Developer Team Card */}
            <div className="team-card">
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-600" />
                    Developer Team
                  </CardTitle>
                  <CardDescription>
                    Meet the talented developers behind CLICS
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {teamMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {member.name}
                        </h3>
                        <p className="text-xs text-slate-500">{member.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-full bg-white text-slate-500 hover:text-blue-600 hover:shadow-sm transition-all"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-white text-slate-500 hover:text-slate-800 hover:shadow-sm transition-all"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-white text-slate-500 hover:text-blue-700 hover:shadow-sm transition-all"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>
            © 2025 CLICS. All rights reserved. | University of Mianwali Final
            Year Project
          </p>
        </div>
      </footer>
    </div>
  );
}
