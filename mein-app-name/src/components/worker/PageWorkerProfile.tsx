import React, { useEffect, useState } from "react";
import { JobType, Position, WorkerResource } from "../../Resources";
import { deleteWorker, getWorkerbyID, updateWorker, getWorkerImage } from "../../backend/api";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "react-bootstrap";
import { MDBContainer, MDBInput } from "mdb-react-ui-kit";
import "./PageWorkerProfile.css";
import NavbarWComponent from "./NavbarWComponent";
import axios from 'axios';
import LoadingIndicator from '../LoadingIndicator';

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
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [addressValid, setAddressValid] = useState(true);
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
    console.log('Starting update process...');  // Log the start of the update process

    const isValidAddress = await handleAddressValidation(location);
    setAddressValid(isValidAddress);
    console.log(`Address validation result: ${isValidAddress}`);  // Log the result of the address validation

    if (!isValidAddress) {
      alert('Bitte geben Sie eine gültige Adresse ein.');
      return;
    }

    await fetchCoordinates(location);

    const updatedWorkerData: WorkerResource = {
      id: (worId!),
      name: name,
      email: email,
      password: password,
      location: location,
      status: status,
      verification: verification,
      statusOrder: statusOrder,
      range: range,
      jobType: jobType,
      minPayment: minPayment!,
      rating: rating,
      longitude: userLocation!.longitude,
      latitude: userLocation!.latitude
    };

    try {
      const updatedWorker = await updateWorker(updatedWorkerData);
      console.log("Updated Worker:", updatedWorker);
      alert("Worker erfolgreich aktualisiert");
      if (newProfileImage) {
        await uploadProfileImage(worId!, newProfileImage);
      }
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
      alert('Profil erfolgreich gelöscht.');
    } catch (error) {
      console.error('Fehler beim Löschen des Profils:', error);
      alert('Fehler beim Löschen des Profils');
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfileImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async (id: string, image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(`/worker/${id}/image`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Profilbild erfolgreich aktualisiert");
        fetchWorkerImage(id);
      } else {
        console.error("Fehler beim Hochladen des Profilbildes");
      }
    } catch (error) {
      console.error("Fehler beim Hochladen des Profilbildes:", error);
    }
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <p>Fehler: {error}</p>;

  return (
    <>
      <NavbarWComponent />
      <div className="background-image">
        <div className="custom-container">
          <MDBContainer className="p-3 my-5 d-flex flex-column align-items-center justify-content-center w-50">
            <div className="text-center mb-4">
              <h1>Profileinstellungen</h1>
              {previewImage || profileImage ? (
                <div>
                  <img src={previewImage || profileImage} alt="Profilbild" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
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
              <MDBInput wrapperClass="inputField1" label="Passwort" type="text" onChange={(e) => setPassword(e.target.value)} />
              <div className="mb-3">
                <label htmlFor="profileImage" className="form-label">Profilbild hochladen</label>
                <input className="form-control" type="file" id="profileImage" onChange={handleProfileImageChange} />
              </div>
              <Button className="button" variant="success" type="submit">Profil speichern</Button>
              <LinkContainer to="/">
                <Button className="button" variant="danger" onClick={handleDelete}>Profil löschen</Button>
              </LinkContainer>
              <LinkContainer to={`/worker/${worId}`}>
                <Button type="button">Zurück zur Startseite!</Button>
              </LinkContainer>
            </form>
          </MDBContainer>
        </div>
      </div>
    </>
  );
}
export default PageWorkerProfile;
