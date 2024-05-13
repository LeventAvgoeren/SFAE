import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; // Import für Navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';
import "../MainMenu.css"
import "./PageIndexCustomer.css"
import './PageIndexCustomer.css';
import { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { getCustomerbyID } from '../../backend/api';
import { NavLink } from 'react-router-dom';

export function PageIndexCustomer() {
    const params=useParams()
  let customerId= params.customerId!
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
    <NavLink to={`/customer/${customerId}/order/new`}>
    <button>Jetzt starten</button>
    </NavLink>
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
        </>
        
    );
  }