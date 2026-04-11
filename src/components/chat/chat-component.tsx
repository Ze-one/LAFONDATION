"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/language-context";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface UserInfo {
  id: string;
  fullName: string;
  email: string;
}

interface ChatComponentProps {
  currentUserId: string;
  currentUserRole: string;
  isAdmin?: boolean;
}

export function ChatComponent({ currentUserId, currentUserRole, isAdmin = false }: ChatComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      if (isAdmin) {
        fetchUsers();
      }
    }
  }, [isOpen, isAdmin]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/chat/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        if (data.users.length > 0 && !selectedUserId) {
          setSelectedUserId(data.users[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to fetch users:", e);
    }
  }

  async function fetchMessages() {
    try {
      const url = isAdmin && selectedUserId 
        ? `/api/chat/fetch?userId=${selectedUserId}` 
        : "/api/chat/fetch";
      const res = await fetch(url);
      const data = await res.json();
      
      if (isAdmin && data.messages) {
        setMessages(data.messages);
      } else if (data.messages) {
        setMessages(data.messages);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error("Failed to fetch messages:", e);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;
    
    setIsTyping(true);
    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: isAdmin ? selectedUserId : undefined,
          content: newMessage,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [data.message, ...prev]);
        setNewMessage("");
        toast.success("Message sent!");
      } else {
        toast.error(data.error || "Failed to send");
      }
    } catch (e) {
      console.error("Failed to send message:", e);
      toast.error("Failed to send message");
    } finally {
      setIsTyping(false);
    }
  }

  function selectUser(userId: string) {
    setSelectedUserId(userId);
    fetchMessagesForUser(userId);
  }

  async function fetchMessagesForUser(userId: string) {
    try {
      const res = await fetch(`/api/chat/fetch?userId=${userId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error("Failed to fetch messages for user:", e);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      ) : (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl w-[350px] h-[500px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold">{t("messages") || "Messages"}</h3>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isAdmin && users.length > 0 && (
            <div className="flex gap-1 p-2 overflow-x-auto border-b border-white/10">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => selectUser(user.id)}
                  className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                    selectedUserId === user.id
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  {user.fullName || user.email || "User"}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-slate-400 text-center text-sm">No messages yet. Start a conversation!</p>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.senderId === currentUserId
                        ? "bg-blue-500/80 text-white"
                        : "bg-white/10 text-slate-200"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {msg.senderId === currentUserId && (
                        <span className="text-[10px] text-slate-400">
                          {msg.isRead ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {isTyping && (
            <div className="px-4 text-xs text-slate-400 animate-pulse">
              Typing...
            </div>
          )}

          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
              <Button onClick={sendMessage} size="sm" className="bg-blue-500 hover:bg-blue-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}