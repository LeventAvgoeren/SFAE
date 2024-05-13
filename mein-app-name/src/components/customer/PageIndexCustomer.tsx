<<<<<<< HEAD:mein-app-name/src/components/customer/PageIndexCustomer.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; // Import für Navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';
import "../MainMenu.css"
import "./PageIndexCustomer.css"
=======
import { useParams } from 'react-router-dom';
import './PageIndexCustomer.css';
import { useEffect, useState } from 'react';
import { getCustomerbyID } from '../backend/api';
import { CSSTransition } from 'react-transition-group';
>>>>>>> 940fee8567c120cb80353ae31a8f832bd89ad6e6:mein-app-name/src/components/PageIndexCustomer.tsx

export function PageIndexCustomer() {
    const params=useParams()
  let customerId=parseInt(params.customerId!)
  const [name,setName]=useState("")
  const [quote, setQuote] = useState("");
  const [fact, setFact] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  
  
  const quotes = [
    `"Dank SFAE konnte ich schnell und sicher meinen Wohnungsputz organisieren!" - Anna B.`,
    `"Mit SFAE fand ich den besten Handwerker in meiner Nähe." - Jens L.`,
    `"Die Buchung über SFAE war einfach und unkompliziert." - Maria S.`
];

const facts = [
    "Über 100,000 registrierte Kunden!",
    "Mehr als 500,000 Jobs erfolgreich vermittelt!",
    "Top bewertet in Kunden-Service seit 2021!"
];


  useEffect(()=>{

    async function getCustomer() {
      try{
        let customer=await getCustomerbyID(customerId)
        setName(customer.name)
      }
      catch(error){
        console.log("Fehler:"+error)
      }
    }
    getCustomer()
    setQuote(quotes[quoteIndex]);
    setFact(facts[factIndex]);

    const interval = setInterval(() => {
      setQuoteIndex(prevIndex => (prevIndex + 1) % quotes.length);
      setFactIndex(prevIndex => (prevIndex + 1) % facts.length);
  }, 4000);

  return () => clearInterval(interval);
  },[])

  useEffect(() => {
    setQuote(quotes[quoteIndex]);
    setFact(facts[factIndex]);
}, [quoteIndex, factIndex]);


    return (
        <>
<<<<<<< HEAD:mein-app-name/src/components/customer/PageIndexCustomer.tsx
            <Navbar      variant="dark" expand="lg">
                <Container>
                    <Nav className='mx-auto'>
                        <NavDropdown title={<img src={"/SFAE_Logo.png"} height="35" alt="Dropdown Logo" />} id="collapsible_nav_dropdown">
                        <NavDropdown.Item>
                            <Link to={`/customer/${customerId}/profil`} style={{ textDecoration: 'none', color: 'black' }}>
                                    <img
                                        src={"/Q&A_Logo.png"}
                                        height="35"
                                        className="d-inline-block align-top"
                                        alt="SFAE Logo"
                                    />
                                    Profil
                                </Link>
                            </NavDropdown.Item>

                            <NavDropdown.Item
                                href="#support">
                                <img
                                    src={"/Q&A_Logo.png"}
                                    height="35"
                                    className="d-inline-block align-top"
                                    alt="SFAE Logo" />
                                Another action
                            </NavDropdown.Item>

                            <NavDropdown.Item
                                href="#settings">
                                <img
                                    src={"/Einstellung.png"}
                                    height="35"
                                    className="d-inline-block align-top"
                                    alt="SFAE Logo" />
                                Something
                            </NavDropdown.Item>

                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown>
                        
                        <Link to={`/customer/${customerId}/profil`}>
                        <img
                            src={"/Profil.png"}
                            height="35"
                            className="d-inline-block align-top"
                            alt="SFAE Logo" />
                    </Link>

                        <Nav.Link href="#support">
                            <img
                                src={"/Q&A_Logo.png"}
                                height="35"
                                className="d-inline-block align-top"
                                alt="SFAE Logo" />
                        </Nav.Link>

                        <Nav.Link href="#settings">
                            <img
                                src={"/Einstellung.png"}
                                height="35"
                                className="d-inline-block align-top"
                                alt="SFAE Logo" />
                        </Nav.Link>

                        {/* <Nav.Link href="#features">Finanzen</Nav.Link>
                        <Nav.Link href="#pricing">Support</Nav.Link> */}
                    </Nav>

                </Container>
            </Navbar>

            <div className="background-city">
                <div className="container-frame">
                    <Navbar.Brand href="/">
                        <img
                            src={"/SFAE_Logo.png"}
                            className="img-fluid"
                            alt="SFAE Logo"
                        />
                    </Navbar.Brand>

                    <h1>Willkommen</h1>

                    <Row className="mb-3">
    <Col className="text-center"> {/* Verwende die text-center Klasse hier */}
        <form className="mx-auto">
            <div className='input-group mb-3'>
                <input
                    type="input"
                    className="form-control search-field"
                    placeholder="Was brauchen sie ?..."
                />
                <button className="btn btn-primary" type="button">Suchen</button>
            </div>
        </form>
    </Col>
</Row>






                </div>
            </div>
=======
      <div className="call-to-action">
    <h1>{name}, starte jetzt deinen ersten Auftrag!</h1>
    <p>Schnell, einfach und zuverlässig – finde jetzt den richtigen Dienstleister für dein Projekt!</p>
    <div className="features">
        <div>
            <img src="/trust.png" alt="Vertrauenswürdig" />
            <p>Sicher und vertrauenswürdig</p>
        </div>
        <div>
            <img src="/clock.png" alt="Schnelle Bearbeitung" />
            <p>Schnelle Bearbeitungszeiten</p>
        </div>
    </div>
    <button>Jetzt starten</button>
    <CSSTransition
                in={true} 
                timeout={500} 
                classNames="fade" 
                key={quote} 
            >
                <p className="testimonial">{quote}</p>
                </CSSTransition>
    <CSSTransition
                in={true}
                timeout={500}
                classNames="fade"
                key={fact}
            >
                <p className="registered-customers">{fact}</p>
            </CSSTransition>
</div>
>>>>>>> 940fee8567c120cb80353ae31a8f832bd89ad6e6:mein-app-name/src/components/PageIndexCustomer.tsx
        </>
        
    );
  }