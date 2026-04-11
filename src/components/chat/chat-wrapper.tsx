"use client";

import { ChatComponent } from "./chat-component";

interface ChatWrapperProps {
  userId: string;
  userRole: string;
}

export function ChatWrapper({ userId, userRole }: ChatWrapperProps) {
  return (
    <ChatComponent 
      currentUserId={userId} 
      currentUserRole={userRole}
      isAdmin={userRole === "ADMIN"}
    />
  );
}