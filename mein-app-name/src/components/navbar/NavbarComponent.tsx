
import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './NavbarComponent.css';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { LoginInfo, useLoginContext } from '../LoginManager';
import { checkLoginStatus, deleteCookie } from '../../backend/api';
import ChatComponent from '../ChatComponent';
import { Client, IMessage, Frame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface Message {
    sender: string;
    receiver: string | undefined;
    content: string;
    timestamp?: number;
    type?: string; 
}


export function NavbarComponent() {
  const {loginInfo} = useLoginContext();
  const [showChat, setShowChat] = useState(false);
  const params = useParams<{ customerId: string, workerId: string}>();
  const userId = params.customerId? params.customerId! : params.workerId!;
  const clientRef = useRef<Client | null>(null);
  const [newMessage, setNewMessage] = useState(false);
  async function doLogout() {
      await deleteCookie();
      window.location.href = "/login";
  }

  useEffect(() => {
    const client = new Client({
        webSocketFactory: () => new SockJS( `${process.env.REACT_APP_API_SERVER_URL}/chat `),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: async () => {
            console.log('Connected');
            client.subscribe(`/topic/${userId}`, (message: IMessage) => {
                const receivedMessage: Message = JSON.parse(message.body);
                if(receivedMessage.content.length > 1){
                     setNewMessage(true);
                }
            });
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        },
        onWebSocketClose: (event) => {
            console.error('WebSocket closed, event:', event);
        },
    });

    client.activate();
    clientRef.current = client;

    return () => {
        if (clientRef.current) {
            clientRef.current.deactivate();
        }
    };
}, []);


  const toggleChat = () => {
    setShowChat(!showChat);
  }

  const handleNotificationClick = () => {
    toggleChat();
    setNewMessage(false);
  }

  return (
      <>
          <nav className="page-background">
    <img src="/Sfae_Logo.png" alt="Logo" style={{height: 100, width: 100}}/>
              <ul>
                  {loginInfo && (
                      <li><a href={`/customer/${loginInfo.userId}`}>Home</a></li>
                  )}
                  {loginInfo && (
                      <li><a href={`/customer/${loginInfo.userId}/profil`}>Profil</a></li>
                  )}
                  {loginInfo && (
                      <li><a href={`/customer/${loginInfo.userId}/uebersicht`}>Übersicht</a></li>
                  )}
                  {loginInfo && (
                      <li><a href={`/customer/${loginInfo.userId}/faq`}>Faq</a></li>
                  )}
                   {loginInfo && loginInfo.admin ==="ADMIN" && (
                      <li><a href={`/admin/${loginInfo.userId}/dienstleistungen`}>Admin</a></li>
                  )}
                  <li><a onClick={doLogout}>Abmelden</a></li>
              </ul>
              {loginInfo && (
                <div className="notification-icon" onClick={handleNotificationClick}>
                    {newMessage && <div className="notification-badge"></div>}
                    <img src="/icons8-notification-100.png" alt="Benachrichtigungen"/>
                </div>
        )}
      </nav>  

        <div className={`chat-container ${showChat ? 'show' : ''}`}>
              <ChatComponent onClose={toggleChat} />
          </div>
      </>
  );
}


export default NavbarComponent;