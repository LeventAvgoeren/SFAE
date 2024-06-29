import React, { useState, useEffect } from 'react';
import './PageChatBot.css';
import { chatBot } from '../backend/api';

export function PageChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hallo! Wie kann ich Ihnen helfen? Bitte achten sie auf die rechtschreibung und stellen sie nur eine frage' }
  ]);
  const [typingMessage, setTypingMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await chatBot(input);
      console.log("Backend Response:", response);
      typeMessage(response);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      const errorMessage = 'Es gab einen Fehler bei der Verarbeitung Ihrer Nachricht.';
      typeMessage(errorMessage);
    }

    setInput("");
  };

  const typeMessage = (message: any) => {
    setTypingMessage("");
    setIsTyping(true);
    let index = 0;
    const interval = setInterval(() => {
      setTypingMessage(prev => prev + message[index]);
      index++;
      if (index >= message.length) {
        clearInterval(interval);
        setIsTyping(false);
        setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: message }]);
        setTypingMessage("");
      }
    }, 25);
  };

  return (
    <div className="Backg">
      <div className="container">
        <h1>Chatbot</h1>
        <div className="chatWindow">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === 'user' ? 'userMessage' : 'botMessage'}`}
              dangerouslySetInnerHTML={{ __html: message.text }}
            />
          ))}
          {isTyping && (
            <div className="message botMessage">
              {typingMessage}
            </div>
          )}
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input"
            placeholder="Schreiben Sie eine Nachricht..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="button">Senden</button>
        </form>
      </div>
    </div>
  );
}
