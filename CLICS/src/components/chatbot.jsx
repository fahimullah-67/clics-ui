import { useState, useEffect, useRef } from "react";
import {
  Send,
  X,
  Bot,
  User,
  Maximize2,
  Minimize2,
  Plus,
  MessageSquare,
  Loader2,
} from "lucide-react";
import api from "../utils/axios";

// ✅ Complete and correct formatBotMessage
function formatBotMessage(text) {
  // 1. Convert **bold** to <strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // 2. Split into lines for processing
  const lines = html.split("\n");
  let inList = false;
  const processed = [];
  
  for (let line of lines) {
    const trimmed = line.trim();
    
    // Check if this line is a standalone URL
    const urlMatch = trimmed.match(/^(https?:\/\/[^\s]+)$/);
    if (urlMatch) {
      // If we were in a list, close it
      if (inList) {
        processed.push("</ul>");
        inList = false;
      }
      const url = urlMatch[1];
      // Replace with a button-like link
      processed.push(
        `<div class="my-2">
          <a href="${url}" target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm">
            🔗 View Scheme Details
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>`
      );
      continue;
    }
    
    // Handle bullet list items
    if (trimmed.startsWith("- ")) {
      if (!inList) {
        processed.push("<ul class='list-disc pl-5 my-1'>");
        inList = true;
      }
      processed.push(`<li>${trimmed.substring(2)}</li>`);
    } else {
      if (inList) {
        processed.push("</ul>");
        inList = false;
      }
      if (trimmed === "") {
        processed.push("<br/>");
      } else {
        processed.push(`<p class='my-1'>${line}</p>`);
      }
    }
  }
  if (inList) processed.push("</ul>");
  
  return <div dangerouslySetInnerHTML={{ __html: processed.join("") }} />;
}

export function Chatbot({ isOpen, setIsOpen }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);
        const res = await api.get("chat/");
        setChatHistory(res.data.data);
        if (res.data.data.length > 0) {
          const latest = res.data.data[0];
          setCurrentChatId(latest._id);
          const loadedMessages = latest.messages.map((msg, idx) => ({
            id: idx,
            type: msg.role,
            text: msg.text,
          }));
          setMessages(loadedMessages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const loadChat = (chat) => {
    setCurrentChatId(chat._id);
    const loadedMessages = chat.messages.map((msg, idx) => ({
      id: idx,
      type: msg.role,
      text: msg.text,
    }));
    setMessages(loadedMessages);
  };

  const newChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setInput("");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { id: Date.now(), type: "user", text: input };
    setLoading(true);
    setMessages((prev) => [...prev, userMsg]);
    const question = input;
    setInput("");

    const chatHistoryForAI = messages.map(msg => ({
      role: msg.type,
      content: msg.text
    }));
    chatHistoryForAI.push({ role: "user", content: question });

    try {
      const aiRes = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history: chatHistoryForAI }),
      });
      const aiData = await aiRes.json();

      const botMsg = { id: Date.now() + 1, type: "bot", text: aiData.answer };
      setMessages((prev) => [...prev, botMsg]);

      const payload = { question, answer: aiData.answer };
      if (currentChatId) payload.chatId = currentChatId;
      const mongoRes = await api.post("chat/ask", payload);
      console.log("Saved to DB:", mongoRes.data);

      const refreshed = await api.get("chat/");
      setChatHistory(refreshed.data.data);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          text: "❌ Error getting response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed transition-all duration-500 ease-in-out z-50 flex overflow-hidden shadow-2xl border border-gray-200 bg-white
      ${
        isFullScreen
          ? "inset-0 w-screen h-screen rounded-0"
          : "bottom-4 right-4 w-[500px] h-[600px] rounded-2xl"
      }`}
    >
      {/* SIDEBAR */}
      <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4">
          <button
            onClick={newChat}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 p-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all shadow-sm"
          >
            <Plus size={18} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Recent
          </p>
          {historyLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-gray-400" size={20} />
            </div>
          )}
          {!historyLoading &&
            chatHistory.map((chat) => (
              <button
                key={chat._id}
                onClick={() => loadChat(chat)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors truncate text-left ${
                  currentChatId === chat._id
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <MessageSquare size={16} className="shrink-0" />
                <span className="truncate">
                  {chat.messages[0]?.text?.slice(0, 30)}...
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col h-full bg-white">
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
              <Bot size={20} />
            </div>
            <div>
              <span className="font-bold text-sm block leading-none">
                CLICS AI Support
              </span>
              {isFullScreen && (
                <span className="text-[10px] text-blue-100">Pro Assistant</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="hover:bg-blue-700 p-2 rounded-lg transition-colors"
            >
              {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setIsFullScreen(false);
              }}
              className="hover:bg-blue-700 p-2 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className={`flex-1 overflow-y-auto p-4 space-y-4 ${
            isFullScreen ? "max-w-4xl mx-auto w-full px-6" : "bg-gray-50"
          }`}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[85%] ${
                  msg.type === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm
                  ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border text-gray-600"
                  }`}
                >
                  {msg.type === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.type === "user" ? msg.text : formatBotMessage(msg.text)}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center">
                  <Bot size={16} className="text-gray-600" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white text-gray-500 border">
                  <Loader2 className="animate-spin" size={16} />
                  <span className="ml-2 text-xs">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`${
            isFullScreen ? "border-t py-6 bg-white" : "p-3 border-t bg-white"
          }`}
        >
          <form
            onSubmit={handleSend}
            className={`flex gap-2 items-center ${
              isFullScreen
                ? "max-w-3xl mx-auto w-full shadow-lg border rounded-2xl px-4 py-2"
                : ""
            }`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                loading
                  ? "AI is typing..."
                  : "Ask me anything (e.g., best car loan interest rate?)"
              }
              className="flex-1 bg-transparent border-none py-2 text-sm focus:ring-0 outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
          {isFullScreen && (
            <p className="text-center text-[10px] text-gray-400 mt-3">
              CLICS AI can make mistakes. Check important info.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}