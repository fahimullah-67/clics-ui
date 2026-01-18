"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "../components/custom-ui/Card"
import { Target, Users, Eye, Award, Mail, Linkedin, Github } from "lucide-react"
import gsap from "gsap"

export default function AboutPage() {
  const containerRef = useRef(null)
  const featuresRef = useRef(null)
  const teamRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
    }

    if (featuresRef.current) {
      gsap.fromTo(
        featuresRef.current.children,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, delay: 0.3, ease: "back.out(1.4)" },
      )
    }

    if (teamRef.current) {
      gsap.fromTo(
        teamRef.current.children,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.2, delay: 0.6, ease: "power3.out" },
      )
    }
  }, [])

  const features = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To empower Pakistani borrowers with transparent, verified loan information from all major banks in one centralized platform, making financial decisions easier and more informed.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "To become Pakistan's most trusted loan comparison platform, setting the standard for transparency and accessibility in financial services.",
    },
    {
      icon: Users,
      title: "Our Team",
      description:
        "CLICS is a Final Year Project developed by students at the University of Mianwali: Abdullah Khawar, Sijjad Khan, and Fahim Ullah.",
    },
    {
      icon: Award,
      title: "Our Values",
      description:
        "Transparency, accuracy, and user empowerment. We verify all data sources and provide evidence-backed recommendations through our AI assistant.",
    },
  ]

  const teamMembers = [
    {
      name: "Fahim Ullah",
      role: "Full Stack Developer & AI Specialist",
      email: "fahimullah446@gmail.com",
      linkedin: "https://linkedin.com/in/fahim-ullah-67fu",
      github: "https://github.com/Fahimullah-67",
      skills: [ "React.js", "Node.js", "Machine Learning", "RAG Systems", "Web Scraping"],
      image: "/professional-male-developer.jpg",
    },
    {
      name: "Sijjad Khan",
      role: "UI Designer & Frontend Developer",
      email: "sijjadkhan@example.com",
      linkedin: "https://linkedin.com/in/sijjadkhan",
      github: "https://github.com/sijjadkhan",
      skills: ["UI/UX Design", "React.js", "API Development", "Database Design", "Responsive Design", "Tailwind CSS"],
      image: "/professional-male-engineer.jpg",
    },
    {
      name: "Abdullah Khawar",
      role: "AI Developer & RAG Specialist",
      email: "abdullahkhawar@example.com",
      linkedin: "https://linkedin.com/in/abdullahkhawar",
      github: "https://github.com/abdullahkhawar",
      skills: ["AI", "RAG Systems", "Machine Learning", "LangChain", "Data Analysis", "Python"],
      image: "/professional-male-designer.png",
    },
  ]

  return (
    <main className="flex-1">
      <div className="border-b bg-gray-50 dark:bg-gray-900" ref={containerRef}>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About CLICS</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
            Centralized Loan Information & Comparison System - Making loan
            comparison transparent and accessible for all Pakistanis
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6">What is CLICS?</h2>
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
            <p>
              CLICS is an innovative web platform that aggregates loan
              information from all major Pakistani banks, making it easy for
              borrowers to compare and find the best loan options for their
              needs.
            </p>
            <p>
              Our system automatically collects and verifies loan data from bank
              websites and PDFs, storing the original sources with capture dates
              for complete transparency. Users can search, filter, and compare
              loans side-by-side, with our AI-powered chatbot providing
              personalized recommendations backed by real evidence.
            </p>
            <p>
              Whether you're looking for a personal loan, car loan, home loan,
              student loan, or business financing, CLICS brings all the
              information you need to one place, saving you time and helping you
              make informed financial decisions.
            </p>
          </div>
        </div>

        <div
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16"
          ref={featuresRef}
        >
          {features.map((feature, idx) => (
            <Card key={idx} className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Meet the talented developers behind CLICS - students from the
            University of Mianwali
          </p>
          <div className="grid md:grid-cols-3 gap-8" ref={teamRef}>
            {teamMembers.map((member, idx) => (
              <Card
                key={idx}
                className="border-2 hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-blue-100 dark:border-blue-900"
                    />
                    <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-4">
                      {member.role}
                    </p>

                    <div className="flex gap-2 mb-4">
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        title="Email"
                      >
                        <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400 hover:text-blue-600" />
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="h-4 w-4 text-gray-600 dark:text-gray-400 hover:text-blue-600" />
                      </a>
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        title="GitHub"
                      >
                        <Github className="h-4 w-4 text-gray-600 dark:text-gray-400 hover:text-blue-600" />
                      </a>
                    </div>

                    <div className="w-full">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.skills.map((skill, skillIdx) => (
                          <span
                            key={skillIdx}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6">Technology</h2>
          <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
            <p>
              CLICS is built using modern web technologies including React for
              the frontend, Node.js for the backend, and MongoDB for data
              storage. We use advanced web scraping tools to collect loan data,
              vector databases for semantic search, and large language models
              for our AI chatbot that provides evidence-backed recommendations
              in both English and Urdu.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-blue-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">
                Questions or Feedback?
              </h2>
              <p className="mb-6 opacity-90">
                We'd love to hear from you. Get in touch with our team.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50 bg-white text-blue-600 hover:bg-gray-100 h-10 px-8"
              >
                Contact Us
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
