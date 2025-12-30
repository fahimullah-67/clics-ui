"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/custom-ui/Button"
import { Input } from "../components/custom-ui/Input"
import { Textarea } from "../components/custom-ui/Textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/custom-ui/Card"
import { Mail, Phone, MapPin, Send, Github, Linkedin } from "lucide-react"
import gsap from "gsap"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  useEffect(() => {
    gsap.fromTo(
      ".contact-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
    )
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Thank you for contacting us! We will get back to you soon.")
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 contact-card">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Get In Touch</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have questions about CLICS? We're here to help you find the best loan options.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="contact-card shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              <CardDescription>Fill out the form and we'll get back to you within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <Input name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more..."
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="contact-card shadow-lg border-0">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Email</h3>
                    <p className="text-slate-600">info@clics.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Phone</h3>
                    <p className="text-slate-600">+92 (21) 1234-5678</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Address</h3>
                    <p className="text-slate-600">Mianwali, Pakistan</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="contact-card shadow-lg border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <CardHeader>
                <CardTitle>Developer Information</CardTitle>
                <CardDescription className="text-blue-100">Meet the team behind CLICS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold">Fahim Ullah</h3>
                  <p className="text-sm text-blue-100">Full Stack Developer</p>
                  <div className="flex gap-2 mt-1">
                    <a href="mailto:fahimullah.pk.67@gmail.com" className="text-blue-100 hover:text-white">
                      <Mail className="w-4 h-4" />
                    </a>
                    <a href="https://github.com/Fahimullah-67" className="text-blue-100 hover:text-white">
                      <Github className="w-4 h-4" />
                    </a>
                    <a href="https://www.linkedin.com/in/fahimullah-fu67" className="text-blue-100 hover:text-white">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Sijjad Khan</h3>
                  <p className="text-sm text-blue-100">Frontend Developer</p>
                  <div className="flex gap-2 mt-1">
                    <a href="mailto:sijjad@clics.com" className="text-blue-100 hover:text-white">
                      <Mail className="w-4 h-4" />
                    </a>
                    <a href="#" className="text-blue-100 hover:text-white">
                      <Github className="w-4 h-4" />
                    </a>
                    <a href="#" className="text-blue-100 hover:text-white">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Abdullah Khawar</h3>
                  <p className="text-sm text-blue-100">AI Developer</p>
                  <div className="flex gap-2 mt-1">
                    <a href="mailto:abdullah@clics.com" className="text-blue-100 hover:text-white">
                      <Mail className="w-4 h-4" />
                    </a>
                    <a href="#" className="text-blue-100 hover:text-white">
                      <Github className="w-4 h-4" />
                    </a>
                    <a href="#" className="text-blue-100 hover:text-white">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
