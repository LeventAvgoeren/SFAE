import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage, Frame } from '@stomp/stompjs';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBIcon,
    MDBCardHeader,
    MDBCardFooter,
    MDBBtn,
} from "mdb-react-ui-kit";
import { useParams } from 'react-router-dom';
import { getContractByCustomerId, getContractByWorkerId, getContractStatus, getCustomerImage, getCustomerbyID, getWorkerImage, getWorkerbyID } from '../backend/api';
import LoadingIndicator from './LoadingIndicator';
import { ContractResource, ContractResourceforWorker } from '../Resources';
import "./ChatComponent.css";
import animationData from "./Sorry.json";
import Lottie from 'react-lottie';
import { idID } from '@mui/material/locale';
interface Message {
    sender: string;
    receiver: string | undefined;
    content: string;
    timestamp?: number;
    type?: string; 
}

const fetchMessagesForUser = async (user1: string, user2: string): Promise<Message[]> => {
    const response = await fetch( `${process.env.REACT_APP_API_SERVER_URL}/chat/history?user1=${user1}&user2=${user2}`);
    const data = await response.json();
    return data;
};

const formatTimestamp = (timestamp: number, time?: boolean) => {
    const date = new Date(timestamp);
    if (!time) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Monate sind nullbasiert, daher +1
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    } else {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
};

interface ChatComponentProps {
    onClose: () => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [contract, setContract] = useState<ContractResource | undefined>();
    const [receiver, setReceiver] = useState<string | undefined>('');
    const [image, setImage] = useState<string>('');
    const params = useParams<{ customerId: string, workerId: string}>();
    const userId = params.customerId? params.customerId! : params.workerId!;
    const clientRef = useRef<Client | null>(null);
    const [load, setLoad] = useState(false);
    const [active, setActive] = useState(true);
    const [maxPayment, setMaxPayment] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isID, setID] = useState("");

    const fetchMessage = async () => {
        if(receiver){
              const messagesFromServer = await fetchMessagesForUser(userId, receiver);
        setMessages(messagesFromServer);
        }
      
    };

    const fetchLastMessage = async () => {
        if(receiver){
        const messagesFromServer = await fetchMessagesForUser(userId, receiver);
        setMessages((prevMessages) => [...prevMessages, messagesFromServer[messagesFromServer.length - 1]]);
        }
    };

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                if (userId.startsWith("C")) {
                    const cus = await getCustomerbyID(userId);
                    setName(cus.name);
                    const contract = await getContractByCustomerId(userId);
                    contract.sort((a, b) => a.id! - b.id!);
                    if (contract) {
                        const status = contract[contract.length - 1].statusOrder;
                        console.log(contract[contract.length - 1])
                        if (status !== "ACCEPTED") {
                            return setActive(false);
                        }
                        setActive(true)
                        setMaxPayment(contract[contract.length - 1].worker!.minPayment as number)
                        const img = await getWorkerImage(contract[contract.length - 1].worker!.id!);
                        setImage(`data:image/jpeg;base64,${img}`);
                        setContract(contract[contract.length - 1]);
                        setReceiver(contract[contract.length - 1].worker!.id);
                    }
                }

                if (userId.startsWith("W")) {
                    const wor = await getWorkerbyID(userId);
                    setName(wor.name);
                    const contract = await getContractByWorkerId(userId);
                    contract.sort((a, b) => a.id! - b.id!);
                    if (contract) {
                        const status = contract[contract.length - 1].statusOrder;
                        if (status !== "ACCEPTED") {
                            return setActive(false);
                        }
                        const img = await getCustomerImage(contract[contract.length - 1].customer!.id!);
                        setMaxPayment(contract[contract.length - 1].maxPayment);
                        setImage(`data:image/jpeg;base64,${img}`);
                        setContract(contract[contract.length - 1]);
                        setReceiver(contract[contract.length - 1].customer!.id);
                    }
                }


              setID(await getContractStatus(contract!.id!)) 
            } catch (error) {
                console.error('Error fetching customer:', error);
            }

        };

        fetchCustomer();


           
    const statusInterval = setInterval(async () => {
      
        if(active){
              try {
              
                const status = await getContractStatus(contract!.id!);
                clearInterval(statusInterval);
                if (status !== 'ACCEPTED') {
                    setActive(false)
                } else {
                    console.log("AS")
                    setActive(true)
                    fetchMessage()  
                    window.location.reload()
                }
                } catch (error) {
                console.error('Error fetching contract status:', error);
                }
            }
        }, 5000);

        return () => clearInterval(statusInterval);
    }, [isID, userId]);

    useEffect(() => {
        fetchMessage()
    }, [receiver]);

    useEffect(() => {
        if (load) {
            const timeoutId = setTimeout(() => {
                fetchLastMessage();
                setLoad(false);
            }, 500);

            return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
        }
    }, [load]);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(`${process.env.REACT_APP_API_SERVER_URL}/chat`),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: async () => {
                console.log('Connected');
                fetchMessage();
                client.subscribe(`/topic/${userId}`, (message: IMessage) => {
                    const receivedMessage: Message = JSON.parse(message.body);
                    if (receivedMessage.type === 'typing') {
                        setIsTyping(true);
                        setTimeout(() => setIsTyping(false), 3000); // Set typing indicator timeout
                    } else {
                        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                        scrollToBottom();
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


    useEffect(() => {
        scrollToBottom(); 
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = () => {
        if (clientRef.current && clientRef.current.connected && message) {
            const chatMessage: Message = {
                sender: userId,
                receiver: receiver,
                content: message,
            };
            clientRef.current.publish({ destination: '/app/chat.send', body: JSON.stringify(chatMessage) });
            setLoad(true);
            setMessage('');
        } else {
            console.error('No connection to server.');
        }
    };


    

    const handleTyping = () => {
        if (!typing) {
            setTyping(true);
            const typingMessage: Message = {
                sender: userId,
                receiver: receiver,
                content: '',
                type: 'typing'
            };
            clientRef.current?.publish({ destination: '/app/chat.typing', body: JSON.stringify(typingMessage) });
            setTimeout(() => setTyping(false), 5000); 
        }
    };

    const groupMessagesByDate = (messages: Message[]) => {
        const groupedMessages: { [key: string]: Message[] } = {};

        messages.forEach((msg) => {
            const dateKey = formatTimestamp(msg.timestamp!);
            if (!groupedMessages[dateKey]) {
                groupedMessages[dateKey] = [];
            }
            groupedMessages[dateKey].push(msg);
        });

      
        return groupedMessages;
    };

    const groupedMessages = groupMessagesByDate(messages);

    useEffect(() => {
        if (!contract && active) {
            const timeoutId = setTimeout(() => {
                setActive(false);
            }, 5000);

            return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
        }
    }, [contract, active]);


    if (!active) {
        return (
        <div style={{display:"flex", width:"100%", background:"#060454"}}>

            <div style={{ justifyContent:"center",  height:"100vh", alignContent:"center"}}>
                <Lottie 
                options={{
                        loop: true,
                        autoplay: true,
                        animationData: animationData,
                        rendererSettings: {
                                    preserveAspectRatio: 'xMidYMid slice'
                            }
                }} height={300} width={300} />

                <h4 style={{color:"white", fontSize:"22px"}}>Anscheinend hast du keinen aktiven Auftrag oder es gibt Internetprobleme.</h4>

            <MDBBtn style={{height:"50px", width:"100%", overflow:"inherit", margin:"0px", padding:"0px", backgroundColor:"white"}} onClick={onClose}><img src="/Kreuz.png" alt="" style={{height:"30px", width:"30px", margin:"0px",color:"white"}}/></MDBBtn>

            </div> 
                
            </div>) 
    }

    if (!contract) {
        return <LoadingIndicator />;
    }

    return (  
    <>
        <MDBContainer fluid className="py-5 chat-container-content" style={{ height: "100vh" }}>
            <MDBRow className="d-flex justify-content-center">
                    <MDBCard id="chat2" style={{ borderRadius: "0px", height: "90vh" }}> 
                     <MDBBtn style={{height:"50px", width:"50px", overflow:"inherit", margin:"0px", padding:"0px", backgroundColor:"white"}} onClick={onClose}><img src="/Kreuz.png" alt="" style={{height:"30px", width:"30px", margin:"0px",color:"white"}}/></MDBBtn>
                        <MDBCardHeader className="d-flex flex-column justify-content-center align-items-center p-3">    
                            <h1 className="mb-0">Chat</h1>
                            <p></p>
                            <img src={image} alt="Profilbild" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                            <p></p>
                            <h3>{userId.startsWith("W") ? contract.customer?.name : contract.worker?.name}</h3>
                            {userId.startsWith("W") && <h6>Angabe des Customer: {maxPayment}€</h6>}
                            {userId.startsWith("C") && <h6>Angabe des Workers: {maxPayment}€</h6>}
                        </MDBCardHeader>
                        <MDBCardBody className="CBody" style={{ overflowY: 'auto', maxHeight: '60vh' }}>
                            <div>
                                {messages.length === 0 && (
                                    <p>Noch keine Nachrichten! Schreib doch was ;)</p>
                                )}
                                {Object.entries(groupedMessages).map(([date, messages], index) => (
                                    <div key={index}>
                                        <div className="date-header">
                                            <span className="line"></span>
                                            {date === formatTimestamp(Date.now()) ? `Heute` : `${date}`}
                                            <span className="line"></span>
                                        </div>
                                        {messages.map((msg, msgIndex) => (
                                            <div className="message-container" key={msgIndex}>
                                                <div className={msg.sender === userId ? "Right" : "Left"}>
                                                    {msg.content}
                                                    <div className="TimeL">
                                                        {formatTimestamp(msg.timestamp!, true)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="typing-indicator">
                                        <span>schreibt...</span>
                                    </div>
                                )}
                                <div ref={messagesEndRef} /> 
                            </div>
                        </MDBCardBody>
                        <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Nachricht..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage();
                                    } else {
                                        handleTyping();
                                    }
                                }}
                            />
                            <MDBIcon fas style={{ color: "white", margin: "20px", cursor: "pointer" }} icon="paper-plane" onClick={sendMessage} />
                        </MDBCardFooter>
                    </MDBCard>
            </MDBRow>
        </MDBContainer></>
    );
};

export default ChatComponent;
