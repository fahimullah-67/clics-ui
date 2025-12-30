"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, X, ExternalLink, Languages } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import gsap from "gsap"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: Array<{
    bank: string
    loanName: string
    snippet: string
    url: string
  }>
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your CLICS AI assistant. I can help you find the best loan options based on your needs. Ask me anything about personal, car, home, student, or business loans from Pakistani banks.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [language, setLanguage] = useState<"en" | "ur">("en")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const chatCardRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && chatCardRef.current) {
      gsap.fromTo(
        chatCardRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" },
      )
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const mockResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          language === "en"
            ? "Based on your query, I found several relevant loan options. HBL offers personal loans with interest rates between 14.5% - 18%, while MCB provides home loans at 15% - 17%. Both have competitive processing fees and flexible tenure options."
            : "آپ کی درخواست کی بنیاد پر، میں نے کئی متعلقہ قرض کے اختیارات پائے ہیں۔ HBL 14.5% - 18% کی شرح سود کے ساتھ ذاتی قرض پیش کرتا ہے، جبکہ MCB 15% - 17% پر گھر کے قرضے فراہم کرتا ہے۔",
        sources: [
          {
            bank: "HBL",
            loanName: "HBL Personal Loan",
            snippet: "Interest rate: 14.5% - 18%, Tenure: 12-60 months, Processing fee: 1% + documentation charges",
            url: "https://www.hbl.com/personal-loans",
          },
          {
            bank: "MCB",
            loanName: "MCB Home Loan",
            snippet: "Interest rate: 15% - 17%, Tenure: 60-240 months, Up to 90% financing available",
            url: "https://www.mcb.com.pk/home-loan",
          },
        ],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, mockResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-gradient-to-br from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      ref={chatCardRef}
      className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] shadow-2xl z-50 flex flex-col border-2"
    >
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">CLICS AI Assistant</CardTitle>
              <p className="text-xs text-muted-foreground">Ask about loans</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Select value={language} onValueChange={(val: "en" | "ur") => setLanguage(val)}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <Languages className="h-3 w-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="ur">UR</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-y-auto p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                  {message.content}
                </p>

                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold mb-2">Sources:</p>
                    {message.sources.map((source, idx) => (
                      <Card key={idx} className="text-xs">
                        <CardContent className="p-2">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-semibold break-words">{source.loanName}</span>
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {source.bank}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2 leading-tight break-words">{source.snippet}</p>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 break-all"
                          >
                            View source
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg p-3 bg-muted">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <CardFooter className="border-t p-3 bg-gradient-to-r from-muted/30 to-muted/10 shrink-0">
        <div className="flex gap-2 w-full">
          <Input
            placeholder={language === "en" ? "Ask about loans..." : "قرض کے بارے میں پوچھیں..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-br from-primary to-secondary"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
