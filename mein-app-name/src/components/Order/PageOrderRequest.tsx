import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Nav, NavDropdown, Row } from "react-bootstrap";
import "./PageOrderRequest.css";
import { Navbar } from "react-bootstrap";
import MapComponent from "./MapComponent";
import NavbarComponent from "../NavbarComponent";
import{ useTypewriter, Cursor} from 'react-simple-typewriter';
import Typewriter from "react-ts-typewriter";
interface PageOrderRequestProps {
  onSubmit: (data: {
    address: string;
    service: string;
    description: string;
    budget: number;
    range: number;
    verified: boolean;
  }) => void;
}

export default function PageOrderRequest() {
  const [address, setAddress] = useState("Eingeben...");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(10000);
  const [range, setRange] = useState(1);
  const [verified, setVerified] = useState(false);
  const [showMap, setMap] = useState(false);




  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleSelectChange = (event: any) => {
    const selectedJobType = event.target.value;
    setService(selectedJobType);
  };
    

  const jobTypes = [
    "Hausmeister",
    "Haushälter",
    "Gärtner",
    "Kindermädchen",
    "Koch",
    "Putzkraft",
    "Handwerker",
    "Elektriker",
    "Installateur",
    "Klempner",
    "Maler",
    "Schädlingsbekämpfer",
    "Tierpfleger",
    "Hausbetreuer",
    "Gassigeher",
    "Wäscher",
    "Einkäufer",
    "Caterer",
    "Personal Trainer",
    "Ernährungsberater",
    "Musiklehrer",
    "Babysitter",
    "Hauslehrer",
    "Chauffeur",
    "Reinigungskraft",
    "Schneider",
    "Organisator",
    "Tischler",
    "Möbelträger",
    "Hundetrainer",
    "Kammerjäger",
    "Fensterputzer",
    "Kammerzofen",
    "Hausdoktor",
    "Blumenpfleger",
    "Renovierer",
    "Fensterreiniger",
    "Gartenarbeiter",
    "Bügeler",
    "Bodenleger",
    "Hundepfleger",
    "Autobesorger",
  ];

  const handleClick = () => {
    if(showMap){
      setMap(false);
    } else {
      setMap(true)
    }
  };

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
  };

  return (
    <>
          <div className="background-image">
            <NavbarComponent/>

      <h1 style={{color:"black"}}>
        SFAE ist eine {' '}
        <span style={{fontWeight: 'bold', color: 'green'}}>
           <Typewriter  speed={400}  text={["effizient", "sicher", "vertrauenswürdige"]} loop={true} cursor={false}/>
           
        </span>
        <span style={{color: 'red'}}>
          <Cursor cursorStyle="/"/>
        </span>
        {' '}Seite.
      </h1>
     
      <div className="Frame" >

        <div className="container-frame" >
          <form
            onSubmit={handleSubmit}
            style={{ color: "white", padding: "20px" }}
          >   
          
          {showMap && 
            <div>
              <MapComponent onAddressChange={handleAddressChange} />
             <Button variant="light" onClick={handleClick}>
              OK</Button>
            </div> }
          {!showMap &&
          <>
           <div id="map"></div>
            <div>
              <h1>Auftrag</h1>
              <label htmlFor="addresse">
                Ihre Adresse
              </label>

              <div className="input-group">
                <input
                    className="form-control mx-auto input-with-icon"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    style={{ width: "100%" }}
                    placeholder={address}
                />

                <img className="MapIconImage"src="/MapIcon.png" alt=""   onClick={handleClick} />
              
              </div>
            </div>

            <div className="input-group">
              <div>
                <label>Dienstleistung</label>
                <select
                  className="form-select"
                  id="inputJobType"
                  onChange={handleSelectChange}
                  value={service}
                >
                  <option selected>ServiceTyp wählen...</option>
                  {jobTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginLeft: "20px" }}>
                <label>Maximales Budget (€)</label>
                <input
                  id="budget"
                  type="number"
                  value={budget}
                  className="form-control"
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                />
              </div>

              <div style={{ marginLeft: "20px" }}>
                <label>Verifiziert</label>
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />
              </div>
            </div>

            <div>
              <label>Reichweite (km)</label>
              <input
                type="number"
                value={range}
                className="form-control"
                style={{ width: "36.75%" }}
                onChange={(e) => setRange(parseInt(e.target.value))}
              />
            </div>

            <div>
              <label htmlFor="description">Beschreibung</label>
              <textarea
                id="description"
                value={description}
                className="form-control"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <button    id="myButton"  type="submit" style={{ width: "36.75%" }}>
                Suchen
              </button>
            </div>
            </>}

          </form>
        </div>
      </div>
      </div>
    </>
  );
}
