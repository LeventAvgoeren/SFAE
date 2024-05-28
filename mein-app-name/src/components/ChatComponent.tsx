import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage, Frame, Stomp } from '@stomp/stompjs';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBIcon,
    MDBCardHeader,
    MDBCardFooter,
} from "mdb-react-ui-kit";
import { useParams } from 'react-router-dom';
import { getContractByCustomerId, getContractByWorkerId, getCustomerbyID, getWorkerbyID } from '../backend/api';
import LoadingIndicator from './LoadingIndicator';
import { ContractResource } from '../Resources';

interface Message {
    senderId: string;
    receiverId: string | undefined;
    content: string;
}

const ChatComponent: React.FC = () => {
    const [stompClient, setStompClient] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [contract, setContract] = useState<ContractResource | undefined>();
    const [receiver, setReceiver] = useState<string | undefined>('');
    const params = useParams<{ userId: string }>();
    const userId = params.userId!;
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
      const fetchCustomer = async () => {
          try {
              if(userId.startsWith("C")){
                    const cus = await getCustomerbyID(userId);
                    setName(cus.name);
                    const contract = await getContractByCustomerId(userId);  
               
                    if(contract){
                    setContract(contract[contract.length - 1]);
                    setReceiver(contract[contract.length - 1].worker!.id);
                    }
              }
              
              if(userId.startsWith("W")){
                  const wor = await getWorkerbyID(userId);
                  setName(wor.name);
                  const contract = await getContractByWorkerId(userId);  
                  if(contract){
                  setContract(contract[0]);
                  setReceiver(contract[contract.length - 1].customer?.id);
                  }
              }
          } catch (error) {
              console.error('Error fetching customer:', error);
          }
      };

      fetchCustomer();
  }, [userId]);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS('https://localhost:8443/chat'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Connected');
                console.log(receiver)
                client.subscribe(`/topic/${userId}`, (message: IMessage) => {
                    const receivedMessage: Message = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
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

    const sendMessage = () => {
        if (clientRef.current && clientRef.current.connected) {
            const chatMessage: Message = {
                senderId: userId,
                receiverId: receiver,
                content: message,
            };
            clientRef.current.publish({ destination: '/app/chat.send', body: JSON.stringify(chatMessage) });
            setMessage('');
        } else {
            console.error('No connection to server.');
        }
    };

    if (!contract) {
        return <LoadingIndicator />;
    }

    return (
        <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
            <MDBRow className="d-flex justify-content-center">
                <MDBCol md="10" lg="8" xl="6">
                    <MDBCard id="chat2" style={{ borderRadius: "15px" }}>
                        <MDBCardHeader className="d-flex justify-content-between align-items-center p-3">
                            <h5 className="mb-0">Chat</h5>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <div >
                                <p className='Text'>Du schreibst mit {receiver}.</p>
                                {
                                messages.map((msg, index) => (
                                <div key={index}>
                                {msg.senderId === userId ? 'You' : msg.senderId}: {msg.content}
                                </div>
                            ))}
                            </div>
                        </MDBCardBody>
                        <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
                            <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                                alt="avatar 3"
                                style={{ width: "45px", height: "100%" }}
                            />
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                id="exampleFormControlInput1"
                                placeholder="Type message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}
                            />
                            <MDBIcon fas style={{ color: "black" }} icon="paper-plane" onClick={sendMessage} />
                        </MDBCardFooter>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default ChatComponent;
