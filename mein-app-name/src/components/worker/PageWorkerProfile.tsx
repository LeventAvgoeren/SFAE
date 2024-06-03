import React, { useEffect, useState } from "react";
import { JobType, Position, WorkerResource } from "../../Resources";
import { deleteWorker, getWorkerbyID, updateWorker, getWorkerImage, deleteCookie } from "../../backend/api";
import {  Link, useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Modal } from "react-bootstrap";
import { MDBContainer, MDBInput } from "mdb-react-ui-kit";
import "./PageWorkerProfile.css";
import NavbarWComponent from "./NavbarWComponent";
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import { Toolbar, Typography } from "@mui/material";

export function PageWorkerProfile() {
  const [worker, setWorker] = useState<WorkerResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [statusOrder, setStatusOrder] = useState("");
  const [range, setRange] = useState<Number>(0);
  const [jobType, setJobType] = useState("");
  const [minPayment, setMinPayment] = useState<Number>(0);
  const [rating, setRating] = useState<Number>(0);
  const [verification, setVerification] = useState<Boolean>(false);
  const [userLocation, setUserLocation] = useState<Position | null>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [addressValid, setAddressValid] = useState(true);
  const [slogan , setSlogan] = useState("");

  const [showModal, setShowModal] = useState(false);


  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const params = useParams();
  const worId = params.workerId;

  const handleAddressValidation = async (inputAddress: any) => {
    const apiKey = 'a295d6f75ae64ed5b8c6b3568b58bbf6';  // Ersetzen Sie dies mit Ihrem tatsächlichen API-Key
    const requestUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(inputAddress)}&key=${apiKey}`;

    console.log(`Requesting validation for address: ${inputAddress}`); // Log the address being validated

    try {
      const response = await axios.get(requestUrl);
      console.log('API Response:', response);  // Log the full API response

      const data = response.data;
      if (data.results.length > 0 && data.results[0].geometry) {
        console.log('Valid address with geometry:', data.results[0].geometry);  // Log the geometry data
        return true;
      } else {
        console.log('No valid address found in the API response.');  // Log when no valid address is found
        return false;
      }
    } catch (error) {
      console.error('Error during address validation:', error);  // Log any error during the API request
      return false;
    }
  };

  const fetchWorker = async () => {
    if (!worId) {
      setError("Keine Worker ID in der URL gefunden");
      setLoading(false);
      return;
    }
    try {
      const id = worId;
      const workerData = await getWorkerbyID(id);
      if (workerData) {
        setStatus(workerData.status);
        setStatusOrder(workerData.statusOrder);
        setRange(workerData.range);
        setJobType(workerData.jobType);
        setMinPayment(workerData.minPayment);
        setRating(workerData.rating);
        setVerification(workerData.verification);
        setName(workerData.name);
        setLocation(workerData.location);
        setEmail(workerData.email);
        setPassword(workerData.password);
        setUserLocation({
          latitude: workerData.latitude,
          longitude: workerData.longitude,
        });
        setSlogan(workerData.slogan)
        fetchWorkerImage(id);
      }
      if (!workerData) {
        setWorker(null);
        throw new Error("Keine Daten für diesen Worker gefunden");
      }
      setLoading(false);
    } catch (error) {
      console.error("Fehler beim Laden der Worker-Daten:", error);
      setError("Fehler beim Laden der Daten");
      setLoading(false);
    }
  };

  const fetchWorkerImage = async (id: string) => {
    try {
      const base64Image = await getWorkerImage(id);
      setProfileImage(`data:image/jpeg;base64,${base64Image}`);
    } catch (error) {
      console.error("Fehler beim Laden des Profilbildes:", error);
    }
  };

  useEffect(() => {
    fetchWorker();
  }, []);

  const handleUpdate = async () => {
    const isValidAddress = await handleAddressValidation(location);
    setAddressValid(isValidAddress);
  
    if (!isValidAddress) {
      alert('Bitte geben Sie eine gültige Adresse ein.');
      return;
    }
  
    await fetchCoordinates(location);
  
    if (!addressValid) {
      alert('Bitte geben Sie eine gültige Adresse ein.');
      return;
    }
  
    const updatedWorkerData: WorkerResource = {
      id: worId!,
      name: name,
      email: email,
      password: password,
      location: location,
      status: status,
      statusOrder: statusOrder,
      range: 2.1,
      jobType: jobType,
      minPayment: minPayment!,
      rating: rating,
      verification: verification,
      latitude: userLocation!.latitude,
      longitude: userLocation!.longitude,
      profileBase64: profileImage ,// Ensuring profilBase64 is included
      slogan : slogan
    };
  
    try {
      updatedWorkerData.profileBase64 = updatedWorkerData.profileBase64.slice(23)
      
      const updatedWorker = await updateWorker(updatedWorkerData);
      console.log("Updated Worker:", updatedWorker);
      alert("Worker erfolgreich aktualisiert");
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Workers:", error);
      alert("Fehler beim Aktualisieren des Workers");
    }
  };

  const fetchCoordinates = async (address: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setUserLocation({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        });
      } else {
        console.error("Adresse nicht gefunden");
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Koordinaten:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWorker(worId!);
      await deleteCookie()
      window.location.href = "/index";
      alert('Profil erfolgreich gelöscht.');
    } catch (error) {
      console.error('Fehler beim Löschen des Profils:', error);
      alert('Fehler beim Löschen des Profils');
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setProfileImage(base64String); // Speichert Base64-String im State
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <p>Lädt...</p>;
  if (error) return <p>Fehler: {error}</p>;


  return (
    <>
      <div className="background-image">
        <NavbarWComponent />
        <div className="custom-container glassmorphism">
          <MDBContainer className="p-3 my-5 d-flex flex-column align-items-center justify-content-center w-50">
            <div className="text-center mb-4">
              <h1>Profileinstellungen</h1>
              {previewImage || profileImage ? (
                <div>
                  <img src={previewImage || profileImage} alt="Profilbild" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                </div>
              ) : (
                <div className="placeholder bg-secondary d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px', borderRadius: '50%', color: 'white' }}>
                  <span>Kein Bild</span>
                </div>
              )}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              <MDBInput wrapperClass="inputField1" label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
              <MDBInput wrapperClass="inputField1" label="Adresse" type="text" value={location} onChange={(e) => setLocation(e.target.value)} onBlur={() => handleAddressValidation(location).then(valid => setAddressValid(valid))} />
              {!addressValid && <div style={{ color: 'red' }}>Ungültige Adresse.</div>}
              <MDBInput wrapperClass="inputField1" label="E-Mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <MDBInput wrapperClass="inputField1" label="Passwort" type="password" onChange={(e) => setPassword(e.target.value)} />
              <MDBInput
                wrapperClass="inputField1"
                label="Dein Slogan/Motto"
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
              />
              <div className="mb-3">
                <label htmlFor="profileImage" className="form-label" style={{color:"white"}}>Profilbild hochladen</label>
                <input className="form-control" type="file" id="profileImage" onChange={handleProfileImageChange} />
              </div>
              <Button className="button" variant="success" type="submit">Profil speichern</Button>
              <LinkContainer to={`/worker/${worId}`}>
                <Button className="button" type="button">Zurück zur Startseite!</Button>
              </LinkContainer>
              <Button type="button" className="button" variant="danger" onClick={handleShow}>
                Account Löschen
             </Button>
            </form>
          </MDBContainer>

          {/* modalShow */}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Account Löschen</Modal.Title>
            </Modal.Header>
            <Modal.Body>Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Schließen</Button>
              <Button variant="danger" onClick={handleDelete}>Account löschen</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>

      <Toolbar className="sticky-toolbar">
        <Typography variant="body1" style={{ color: 'white', flex: 1, textAlign: 'center' }}>
          © 2024 SFAE von Ahmad Sfarjalani, Eray Zor, Levent Avgören, Duc Dai Nguyen, Danyal Mahrous. Alle Rechte vorbehalten.
          <a href="/imprint" style={{ textDecoration: 'underline', color: 'white', marginLeft: '10px' }}>Impressum</a>
          <a href="/agb" style={{ textDecoration: 'underline', color: 'white', marginLeft: '10px' }}>Allgemeine Geschäftsbedingungen</a>
        </Typography>
      </Toolbar>
    </>
  );
}

export default PageWorkerProfile;
