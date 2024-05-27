import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp, { Frame } from 'stompjs';

interface Message {
    name: string;
    content: string;
}

interface StompMessage {
    body: string;
}

const ChatComponent: React.FC = () => {
    const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const socket = new SockJS('/wss');
        const client = Stomp.over(socket);

        client.connect({}, (frame?: Frame) => {
            console.log('Connected: ' + frame);
            client.subscribe('/topic/public', (message: StompMessage) => {
                const messageOutput: Message = JSON.parse(message.body);
                setMessages(prevMessages => [...prevMessages, messageOutput]);
            });
        });

        setStompClient(client);

        return () => {
            client.disconnect(() => {
                console.log('Disconnected');
            });
        };
    }, []);

    const sendMessage = () => {
        if (name && message && stompClient) {
            const chatMessage: Message = { name, content: message };
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            setMessage('');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={name}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                value={message}
                placeholder="Type a message..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
            />
            <button onClick={sendMessage}>Send</button>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        {msg.name}: {msg.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatComponent;
