"use client"

import { useState } from "react"
import { Button } from "../components/custom-ui/Button"
import { Input } from "../components/custom-ui/Input"
import { Card } from "../components/custom-ui/Card"
import { Badge } from "../components/custom-ui/Badge"

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [messageInput, setMessageInput] = useState("")

  // Mock conversations data
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Bank Support - SBI",
      lastMessage: "Your loan application has been approved",
      timestamp: "10:30 AM",
      unread: 2,
      avatar: "SBI",
      online: true,
    },
    {
      id: 2,
      name: "HDFC Customer Care",
      lastMessage: "Thank you for your inquiry about home loans",
      timestamp: "Yesterday",
      unread: 0,
      avatar: "HDFC",
      online: false,
    },
    {
      id: 3,
      name: "ICICI Support",
      lastMessage: "Your documents have been verified",
      timestamp: "2 days ago",
      unread: 1,
      avatar: "ICICI",
      online: true,
    },
    {
      id: 4,
      name: "Advisor - Rajesh Kumar",
      lastMessage: "I can help you with investment schemes",
      timestamp: "3 days ago",
      unread: 0,
      avatar: "RK",
      online: false,
    },
  ])

  // Mock messages for selected chat
  const [chatMessages, setChatMessages] = useState({
    1: [
      { id: 1, sender: "them", text: "Hello! How can I help you today?", time: "10:00 AM" },
      { id: 2, sender: "me", text: "I wanted to check the status of my loan application", time: "10:15 AM" },
      { id: 3, sender: "them", text: "Let me check that for you...", time: "10:20 AM" },
      { id: 4, sender: "them", text: "Your loan application has been approved", time: "10:30 AM" },
    ],
    2: [
      { id: 1, sender: "them", text: "Welcome to HDFC Customer Care", time: "Yesterday 2:00 PM" },
      { id: 2, sender: "me", text: "I need information about home loans", time: "Yesterday 2:10 PM" },
      { id: 3, sender: "them", text: "Thank you for your inquiry about home loans", time: "Yesterday 2:15 PM" },
    ],
    3: [{ id: 1, sender: "them", text: "Your documents have been verified", time: "2 days ago" }],
    4: [{ id: 1, sender: "them", text: "I can help you with investment schemes", time: "3 days ago" }],
  })

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: messageInput,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }

    setChatMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage],
    }))

    // Update last message in conversation list
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedChat ? { ...conv, lastMessage: messageInput, timestamp: "Just now" } : conv,
      ),
    )

    setMessageInput("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const currentMessages = selectedChat ? chatMessages[selectedChat] || [] : []
  const currentConversation = conversations.find((c) => c.id === selectedChat)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Chat with banks and financial advisors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <Input placeholder="Search conversations..." className="w-full" />
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === conversation.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {conversation.avatar}
                    </div>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  </div>

                  {conversation.unread > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {conversation.unread}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {currentConversation?.avatar}
                  </div>
                  {currentConversation?.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{currentConversation?.name}</h3>
                  <p className="text-xs text-gray-500">{currentConversation?.online ? "Online" : "Offline"}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {currentMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === "me" ? "bg-blue-500 text-white" : "bg-white text-gray-900 border"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === "me" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-lg">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
