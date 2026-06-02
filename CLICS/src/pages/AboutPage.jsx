"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../components/custom-ui/Card";
import { Button } from "../components/custom-ui/Button";
import {
  Target,
  Eye,
  Heart,
  Cpu,
  Users,
  Shield,
  Zap,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Sparkles,
  CheckCircle,
  Award,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const { t } = useTranslation();
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const teamRef = useRef(null);

  useEffect(() => {
    // Hero animation
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

    // Scroll-triggered animations
    const sections = [
      ".about-text",
      ".mission-card",
      ".vision-card",
      ".team-grid",
      ".values-tech",
      ".contact-cta",
    ];
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: { trigger: section, start: "top 85%" },
        },
      );
    });
  }, []);

  const teamMembers = [
    {
      name: "Fahim Ullah",
      image: "https://avatars.githubusercontent.com/u/179002904?v=4",
      role: "Full Stack Developer",
      skills: [
        "MERN Stack",
        "Python",
        "LangChain",
        "RAG",
        "API Development",
        "Database Design",
        "Tailwind CSS",
      ],
      email: "fahimullah.pk.67@gmail.com",
      github: "https://github.com/Fahimullah-67",
      linkedin: "https://www.linkedin.com/in/fahimullah-fu67",
    },
    {
      name: "Sijad Khan",
      image: "https://avatars.githubusercontent.com/u/217413716?v=4", 
      role: "UI Designer & Frontend Developer",
      skills: [
        "MERN Stack",
        "Tailwind CSS",
        "LangChain",
        "Frontend Architecture",
        "Responsive Design",
      ],
      email: "sijjad@clics.com",
      github: "https://github.com/SijjadKhanNiazi",
      linkedin: "https://www.linkedin.com/in/engineersijjad",
    },
    {
      name: "Abdullah Khawar",
      image: "https://avatars.githubusercontent.com/u/12345680?v=4", // Replace with actual image URL or remove if not available
      role: "AI Developer & RAG Specialist",
      skills: [
        "Machine Learning",
        "Vector Databases",
        "Python",
        "Data Analysis",
        "LLM Fine-tuning",
      ],
      email: "abdullah@clics.com",
      github: "#",
      linkedin: "#",
    },
  
  ];

  return (
    <main className="flex-1 bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 text-center">
          <div className="hero-badge inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-5 py-2 mb-6 border border-white/30">
            
            <span className="text-sm font-medium tracking-wide">
              Welcome to CLICS
            </span>
          </div>
          <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4">
            About CLICS
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Centralized Loan Information & Comparison System — Making loan
            comparison transparent and accessible for all Pakistanis
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <div className="container mx-auto px-4 py-16 md:py-20">
        {/* What is CLICS? */}
        <div className="about-text max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 text-center">
            What is CLICS?
          </h2>
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <CardContent className="p-6 md:p-8 space-y-4">
              <p className="text-slate-600 leading-relaxed text-lg">
                CLICS is an innovative web platform that aggregates loan
                information from all major Pakistani banks, making it easy for
                borrowers to compare and find the best loan options for their
                needs.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                Our system automatically collects and verifies loan data from
                bank websites and PDFs, storing the original sources with
                capture dates for complete transparency. Users can search,
                filter, and compare loans side-by-side, with our AI-powered
                chatbot providing personalized recommendations backed by real
                evidence.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                Whether you're looking for a personal loan, car loan, home loan,
                student loan, or business financing, CLICS brings all the
                information you need to one place, saving you time and helping
                you make informed financial decisions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission & Vision - Two cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
          <div className="mission-card">
            <Card className="border-0 shadow-xl rounded-2xl h-full transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl"></div>
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                  <Target className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                  Our Mission
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  To empower Pakistani borrowers with transparent, verified loan
                  information from all major banks in one centralized platform,
                  making financial decisions easier and more informed.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="vision-card">
            <Card className="border-0 shadow-xl rounded-2xl h-full transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-2xl"></div>
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-5">
                  <Eye className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                  Our Vision
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  To become Pakistan's most trusted loan comparison platform,
                  setting the standard for transparency and accessibility in
                  financial services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Meet Our Team
            </h2>
            <p className="text-slate-500 text-lg">
              Talented developers from the University of Mianwali
            </p>
          </div>
          <div className="team-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, idx) => (
              <Card
                key={idx}
                className="border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 text-sm font-medium">
                    {member.role}
                  </p>
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 justify-center mb-5">
                    {member.skills.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 4 && (
                      <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                        +{member.skills.length - 4}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-center gap-4 pt-3 border-t border-slate-100">
                    <a
                      href={`mailto:${member.email}`}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-800 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-700 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values & Technology - Two columns */}
        <div className="values-tech grid md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
          <Card className="border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-5">
                <Heart className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Our Values
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Transparency</strong>
                    <p className="text-slate-600 text-sm">
                      All data sourced directly from original bank documents
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Accuracy</strong>
                    <p className="text-slate-600 text-sm">
                      Regular verification and updates from official sources
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">User Empowerment</strong>
                    <p className="text-slate-600 text-sm">
                      Evidence-backed recommendations through AI assistant
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-5">
                <Cpu className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Technology Stack
              </h3>
              <p className="text-slate-600 leading-relaxed">
                CLICS is built using modern web technologies including{" "}
                <strong>React</strong> for the frontend,
                <strong> Node.js</strong> for the backend, and{" "}
                <strong>MongoDB</strong> for data storage. We use advanced web
                scraping tools to collect loan data, vector databases for
                semantic search, and large language models for our AI chatbot
                that provides evidence-backed recommendations in both English
                and Urdu.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <div className="contact-cta rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Questions or Feedback?
            </h2>
            <p className="text-blue-100 mb-6">
              We'd love to hear from you. Get in touch with our team.
            </p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-6">
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
            <div className="flex flex-wrap justify-center gap-4 text-blue-100 text-sm mt-6">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> +92 (21) 1234-5678
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> info@clics.com
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Mianwali, Pakistan
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          © 2025 CLICS. All rights reserved. | University of Mianwali Final Year
          Project
        </div>
      </footer>
    </main>
  );
}
