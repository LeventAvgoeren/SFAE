import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage, Frame } from '@stomp/stompjs';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBIcon,
    MDBBtn,
    MDBCardHeader,
    MDBCardFooter,
  } from "mdb-react-ui-kit";
import { Button } from 'react-bootstrap';
import { getContractByCustomerId, getCustomerbyID, getWorkerbyID } from '../backend/api';
import { useParams } from 'react-router-dom';
import { ContractResource } from '../Resources';
import LoadingIndicator from './LoadingIndicator';
  
interface Message {
    senderId: string;
    receiverId: string | undefined;
    content: string;
}

const ChatComponent: React.FC = () => {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [name, setName] = useState('Customer 1');
    const [message, setMessage] = useState('');
    const [contract, setContract] = useState<ContractResource | undefined>();
    const params = useParams();
    const userId = params.userId!;

 
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                if(userId.startsWith("C")){
                      const cus = await getCustomerbyID(userId);
                      setName(cus.name);
                      const contract = await getContractByCustomerId(userId);  
                      if(contract){
                      setContract(contract[contract.length]);
                      }
                }
                
                if(userId.startsWith("W")){
                    const wor = await getWorkerbyID(userId);
                    setName(wor.name);
                    const contract = await getContractByCustomerId(userId);  
                    if(contract){
                    setContract(contract[contract.length]);
                    }
                }
            } catch (error) {
                console.error('Error fetching customer:', error);
            }
        };

        fetchCustomer();
    }, [userId]);

    useEffect(() => {
        const socket = new SockJS('https:/localhost:8443/wss');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: (frame: Frame) => {
                console.log('Connected: ' + frame);
                client.subscribe('/topic/public', (message: IMessage) => {
                    const messageOutput: Message = JSON.parse(message.body);
                    setMessages(prevMessages => [...prevMessages, messageOutput]);
                });
            },
            onStompError: (frame: Frame) => {
                console.error(frame.headers['message']);
            }
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
        };
    }, []);

    const sendMessage = () => {
      if (name && message && stompClient) {
          const chatMessage: Message = { senderId: userId, receiverId: userId.startsWith("C") ? contract!.worker!.id  : contract!.customerId, content: message };
          stompClient.publish({
              destination: "/app/chat.sendMessage",
              body: JSON.stringify(chatMessage)
          });
          setMessage('');
      }
  };

  if(!contract){
    return <LoadingIndicator/>
  }

  return (
    <div>
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
      <MDBRow className="d-flex justify-content-center">
        <MDBCol md="10" lg="8" xl="6">
          <MDBCard id="chat2" style={{ borderRadius: "15px" }}>
            <MDBCardHeader className="d-flex justify-content-between align-items-center p-3">
              <h5 className="mb-0">Chat</h5>
            </MDBCardHeader>
              <MDBCardBody>
              <div>
             
                    <div>
                        {
                          
                        messages.map((msg, index) => (
                            <div key={index}>
                            <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                            alt="avatar 3"
                            style={{ width: "45px", height: "100%" }}
                              /> 
                                {msg.senderId === userId ? 'You' : msg.senderId}: {msg.content}
                            </div>
                        ))}
                    </div>
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
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}
              ></input>
               <MDBIcon fas  style={{color:"black"}}icon="paper-plane"  onClick={sendMessage}/>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer></div>
);
};

export default ChatComponent;
