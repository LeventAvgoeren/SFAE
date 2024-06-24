import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { deleteCookie } from "../../backend/api";
import { useLoginContext } from "../LoginManager";
import ChatComponent from "../ChatComponent";
import "./NavbarWComponent.css";
import { getContractByWorkerId } from "../../backend/api"; // Importiere die Funktion
import { LinkContainer } from "react-router-bootstrap";

interface Message {
  sender: string;
  receiver: string | undefined;
  content: string;
  timestamp?: number;
  type?: string;
}

export function NavbarWComponent() {
  const { loginInfo } = useLoginContext();
  const [showChat, setShowChat] = useState(false);
  const [hasUnfinishedContract, setHasUnfinishedContract] = useState(false);
  const params = useParams<{ customerId: string; workerId: string }>();
  const userId = params.customerId ? params.customerId! : params.workerId!;
  const clientRef = useRef<Client | null>(null);
  const [newMessage, setNewMessage] = useState(false);
  const { workerId } = useParams<{ workerId?: string }>();


  async function doLogout() {
    await deleteCookie();
    window.location.href = "/login";
  }

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${process.env.REACT_APP_API_SERVER_URL}/chat`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: async () => {
        console.log("Connected");
        client.subscribe(`/topic/${userId}`, (message: IMessage) => {
          const receivedMessage: Message = JSON.parse(message.body);
          if (receivedMessage.content.length > 1) {
            setNewMessage(true);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
      onWebSocketClose: (event) => {
        console.error("WebSocket closed, event:", event);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [userId]);

  useEffect(() => {
    async function fetchContracts() {
      try {
        const contracts = await getContractByWorkerId(userId);
        const unfinished = contracts.some(
          (contract) => contract.statusOrder !== "FINISHED"
        );
        setHasUnfinishedContract(unfinished);
      } catch (error) {
        console.error("Error fetching contracts", error);
      }
    }

    if (userId) {
      fetchContracts();
    }
  }, [userId]);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleNotificationClick = () => {
    toggleChat();
    setNewMessage(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "transparent", position: "sticky", top: "0", zIndex: "100000" }}>
        <img src="/Sfae_Logo.png" alt="Logo" className="logo" />
        <button className="navbar-toggler bg-light mt-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
          {loginInfo && (
            <ul className="navbar-nav">
              <li className="nav-item mx-3">
                <a className="nav-link" href={`/worker/${loginInfo.userId}`}>Home</a>
              </li>
              <li className="nav-item mx-3">
                <a className="nav-link" href={`/worker/${loginInfo.userId}/profile`}>Profil</a>
              </li>
              <li className="nav-item mx-3">
                <a className="nav-link" href={`/worker/${loginInfo.userId}/preferences`}>Präferenzen</a>
              </li>
              <li className="nav-item mx-3">
                <a className="nav-link" href={`/worker/${loginInfo.userId}/orders/overview`}>Übersicht</a>
              </li>
              <li className="nav-item mx-3">
                <a className="nav-link" href={`/worker/${loginInfo.userId}/faq`}>Faq</a>
              </li>
            </ul>
          )}
        </div>
        {loginInfo && (
          <div className="d-flex">
            <div className="icon-item">
              <a onClick={doLogout}>
                <img src="/icons8-logout-100.png" alt="Logout" className="icon-img" />
              </a>
              <div className="icon-label">Logout</div>
            </div>
            <div className="icon-item notification-icon" onClick={handleNotificationClick}>
              {newMessage && <div className="notification-badge"></div>}
              <img src="/icons8-chat-64.png" alt="Live-Chat" className="icon-img" />
              <div className="icon-label">Live-Chat</div>
            </div>
            <LinkContainer to={`/worker/${workerId}/finishcontract`}>
              <div className={`icon-item ${hasUnfinishedContract ? "blink" : ""}`}>
                <img src="/icons8-notification-100.png" alt="Notification" className="icon-img" />
                <div className="icon-label">Notification</div>
              </div>
            </LinkContainer>
          </div>
        )}
      </nav>
      <div className={`chat-container ${showChat ? "show" : ""}`}>
        <ChatComponent onClose={toggleChat} />
      </div>
    </>
  );
}

export default NavbarWComponent;
