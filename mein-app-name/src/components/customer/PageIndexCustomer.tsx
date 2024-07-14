import { NavLink, useParams } from "react-router-dom";
import "./PageIndexCustomer.css";
import { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import {
  countAllContracts,
  countAllCustomers,
  countAllWorkers,
  getCustomerbyID,
} from "../../backend/api";
import NavbarComponent from "../navbar/NavbarComponent";
import ImprintPage from "../ImprintPage";
import LoadingIndicator from "../LoadingIndicator"; 
import Footer from "../Footer";

export function PageIndexCustomer() {
  const params = useParams();
  let customerId = params.customerId!;
  
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [fact, setFact] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [customerCounter, setCustomerCounter] = useState(0);
  const [workerCounter, setWorkerCounter] = useState(0);
  const [contractCounter, setContractCounter] = useState(0);
  const [loading, setLoading] = useState(true); // Ladezustand hinzufügen

  const quotes = [
    `"Dank SFAE konnte ich schnell und sicher meinen Wohnungsputz organisieren!" - Anna B.`,
    `"Mit SFAE fand ich den besten Handwerker in meiner Nähe." - Jens L.`,
    `"Die Buchung über SFAE war einfach und unkompliziert." - Maria S.`,
  ];

  const facts = [
    `Über ${customerCounter} registrierte Kunden!`,
    `Über ${workerCounter} registrierte Handwerker!`,
    `Mehr als ${contractCounter} erfolgreich vermittelte Aufträge!`,
    `Top bewertet im Kundenservice seit 2024!`,
  ];

  useEffect(() => {
    async function countCustomer() {
      let number = await countAllCustomers();
      setCustomerCounter(number);
    }
    async function countWorkers() {
      let number = await countAllWorkers();
      setWorkerCounter(number);
    }
    async function countContracts() {
      let number = await countAllContracts();
      setContractCounter(number);
    }

    async function getCustomer() {
      try {
        let customer = await getCustomerbyID(customerId);
        setName(customer.name);
      } catch (error) {
      }
    }

    async function fetchData() {
      await Promise.all([getCustomer(), countCustomer(), countWorkers(), countContracts()]);
      setLoading(false);
    }

    fetchData();
    setQuote(quotes[quoteIndex]);
    setFact(facts[factIndex]);

    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
      setFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setQuote(quotes[quoteIndex]);
    setFact(facts[factIndex]);
  }, [quoteIndex, factIndex]);

  if (loading) {
    return <LoadingIndicator />; 
  }

  return (
    <>
      <div className="background-image"> 
        <NavbarComponent/>
        <div className="call-to-action">
          <h1>{name}, starte jetzt deinen ersten Auftrag!</h1>
          <p>
            Schnell, einfach und zuverlässig – finde jetzt den richtigen
            Dienstleister für dein Projekt!
          </p>
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
          <CSSTransition in={true} timeout={500} classNames="fade" key={quote}>
            <p className="testimonial">{quote}</p>
          </CSSTransition>
          <CSSTransition in={true} timeout={500} classNames="fade" key={fact}>
            <p className="registered-customers">{fact}</p>
          </CSSTransition>
        </div>
        <Footer></Footer>

      </div>
    </>
  );
}
