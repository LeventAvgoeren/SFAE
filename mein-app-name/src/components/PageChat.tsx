import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Message {
  id: number;
  userId: string;
  content: string;
  timestamp: string;
}

export default function PageChat() {
  const { userId } = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Funktion zum Laden der Nachrichten vom Backend
    async function loadMessages() {
      try {
        const response = await fetch(`http://your-backend-api.com/chat/messages`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Fehler beim Laden der Nachrichten:", error);
      }
    }

    loadMessages();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageToSend = {
      userId,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(`http://your-backend-api.com/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageToSend),
      });

      if (response.ok) {
        const savedMessage = await response.json();
        setMessages((prevMessages) => [...prevMessages, savedMessage]);
        setNewMessage("");
      } else {
        console.error("Fehler beim Senden der Nachricht:", response.statusText);
      }
    } catch (error) {
      console.error("Fehler beim Senden der Nachricht:", error);
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.userId}:</strong> {message.content} <em>{message.timestamp}</em>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nachricht eingeben"
        />
        <button onClick={handleSendMessage}>Senden</button>
      </div>
    </div>
  );
}
