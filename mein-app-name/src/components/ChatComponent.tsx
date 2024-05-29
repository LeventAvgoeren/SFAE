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
import { getContractByCustomerId, getContractByWorkerId, getCustomerImage, getCustomerbyID, getWorkerImage, getWorkerbyID } from '../backend/api';
import LoadingIndicator from './LoadingIndicator';
import { ContractResource } from '../Resources';

interface Message {
    sender: string;
    receiver: string | undefined;
    content: string;
    timestamp?: number;
}
const fetchMessagesForUser = async (user1: string, user2: string): Promise<Message[]> => {
    const response = await fetch(`https://localhost:8443/chat/history?user1=${user1}&user2=${user2}`);
    const data = await response.json();
    return data;
};



const ChatComponent: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [permessages, setPerMessages] = useState<Message[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [contract, setContract] = useState<ContractResource | undefined>();
    const [receiver, setReceiver] = useState<string | undefined>('');
    const [image, setImage] = useState<string>('');
    const params = useParams<{ userId: string }>();
    const userId = params.userId!;
    const clientRef = useRef<Client | null>(null);
    const [load, setLoad] = useState(false);

    useEffect(() => {
      const fetchCustomer = async () => {
          try {
              if(userId.startsWith("C")){
                    const cus = await getCustomerbyID(userId);
                    setName(cus.name);
                    const contract = await getContractByCustomerId(userId);    
                     
                    if(contract){
                    const img = await getWorkerImage(contract[contract.length - 1].worker!.id!);
                    setImage(`data:image/jpeg;base64,${img}`);
                    setContract(contract[contract.length - 1]);
                    setReceiver(contract[contract.length - 1].worker!.id);
                    }
              }
              
              if(userId.startsWith("W")){
                  const wor = await getWorkerbyID(userId);
                  setName(wor.name);
                  const contract = await getContractByWorkerId(userId);  
                  if(contract){
                    const img = await getCustomerImage(contract[contract.length - 1].customer!.id!);
                    setImage(`data:image/jpeg;base64,${img}`);
                  setContract(contract[contract.length - 1]);
                  setReceiver(contract[contract.length - 1].customer!.id);
                  }
              }
          } catch (error) {
              console.error('Error fetching customer:', error);
          }

        
      };

      fetchCustomer();
  }, [userId]); 
  
            const fetchMessage = async () => {
                const messagesFromServer = await fetchMessagesForUser(userId, receiver!);
                setMessages(messagesFromServer);
            }

        useEffect( () => {
           fetchMessage()
           setLoad(true)
        }, [receiver])

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS('https://localhost:8443/chat'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: async () => {
                console.log('Connected'); 
                
                fetchMessage()
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

    const sendMessage =  () => {
        if (clientRef.current && clientRef.current.connected && message) {
            const chatMessage: Message = {
                sender: userId,
                receiver: receiver,
                content: message,
            };
            clientRef.current.publish({ destination: '/app/chat.send', body: JSON.stringify(chatMessage) });
            setMessages((prevMessages) => [...prevMessages, chatMessage])
            setMessage('');
        } else {
            console.error('No connection to server.');
        }
    };

  

    if (!contract ) {
        return <LoadingIndicator />;
    }
    return (
        <MDBContainer fluid className="py-5" style={{ backgroundColor: "#060454", height: "100vh" }}>
            <MDBRow className="d-flex justify-content-center">
                <MDBCol md="10" lg="8" xl="6">
                    <MDBCard id="chat2" style={{ borderRadius: "15px", height: "90vh" }}>
                        <MDBCardHeader className="d-flex flex-column justify-content-center align-items-center p-3">
                            <h1 className="mb-0">Chat</h1>
                            <p></p>
                            <img src={image} alt="Profilbild" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                            <p></p>
                            <h3>{receiver}</h3>
                        </MDBCardHeader>
                        <MDBCardBody className="CBody" style={{ overflowY: 'auto', maxHeight: '60vh' }}>
                            <div>
                                <p className='Text'>Du schreibst nun mit {receiver}.</p>
                                {messages.map((msg, index) => (
                                    <div key={index}>
                                       {msg.sender === userId ? (
                                            <div className="Left">
                                               Du: {msg.sender}
                                            </div>):(
                                                <div className="Right">
                                                    {msg.sender}: {msg.content}
                                                </div>
                                            )
                                       }
                                          
                                    </div>
                                ))}
                            </div>
                        </MDBCardBody>
                        <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Type message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}
                            />
                            <MDBIcon fas style={{ color: "white", margin: "20px", cursor: "pointer" }} icon="paper-plane" onClick={sendMessage} />
                        </MDBCardFooter>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default ChatComponent;
