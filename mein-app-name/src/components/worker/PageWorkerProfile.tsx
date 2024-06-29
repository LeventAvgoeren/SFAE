import React, { useEffect, useState, ChangeEvent } from "react";
import { JobType, Position, WorkerResource, WorkerResourceProfil } from "../../Resources";
import { deleteWorker, getWorkerbyID, getWorkerImage, deleteCookie, updateWorkerProfile } from "../../backend/api";
import { Link, useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Row } from "react-bootstrap";
import { MDBContainer, MDBInput, MDBProgress, MDBProgressBar } from "mdb-react-ui-kit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./PageWorkerProfile.css";
import NavbarWComponent from "./NavbarWComponent";
import axios from 'axios';

function validatePassword(password: string) {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return hasUpperCase && hasNumber && hasSpecialChar;
}

function getPasswordStrength(password: string) {
  let strength = 0;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
  if (password.length >= 8) strength += 1;
  return strength;
}

export function PageWorkerProfile() {
  const [worker, setWorker] = useState<WorkerResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [statusOrder, setStatusOrder] = useState("");
  
  const [jobList, setJobList] = useState<string[]>([]);
  const [range, setRange] = useState<Number>(0);
  const [jobType, setJobType] = useState("");
  const [minPayment, setMinPayment] = useState<Number>(0);
  const [rating, setRating] = useState<Number>(0);
  const [verification, setVerification] = useState<Boolean>(false);
  const [userLocation, setUserLocation] = useState<Position | null>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [addressValid, setAddressValid] = useState(true);
  const [slogan, setSlogan] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [cancelModalShow, setCancelModalShow] = useState(false);

  const params = useParams();
  const worId = params.workerId;


  const toggleShow = () => {
    setModalShow(!modalShow);
  };

  const toggleCancelShow = () => {
    setCancelModalShow(!cancelModalShow);
  };
  
  const handleAddressValidation = async (inputAddress: string) => {
    const isValid = await fetchCoordinates(inputAddress);
    setAddressValid(isValid);
    return isValid;
  };

  const fetchCoordinates = async (address: string) => {
    const apiKey = 'a295d6f75ae64ed5b8c6b3568b58bbf6';
    const requestUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
      const response = await axios.get(requestUrl);
      const data = response.data;
      if (data.results.length > 0 && data.results[0].geometry) {
        const { lat, lng } = data.results[0].geometry;
        setUserLocation({ latitude: lat, longitude: lng });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error during address validation:', error);
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
        setJobList(workerData.jobType);
        setMinPayment(workerData.minPayment);
        setRating(workerData.rating);
        setVerification(workerData.verification);
        setName(workerData.name);
        setLocation(workerData.location);
        setEmail(workerData.email);
        setPassword(workerData.password);
        setConfirmPassword(workerData.password);
        setUserLocation({
          latitude: workerData.latitude,
          longitude: workerData.longitude,
        });
        setSlogan(workerData.slogan);
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

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(getPasswordStrength(newPassword));
  };

  const handleUpdate = async () => {
    const isValidAddress = await handleAddressValidation(location);
  
    if (!isValidAddress || !userLocation) {
      toast.error('Bitte geben Sie eine gültige Adresse ein.');
      return;
    }

    if (!validatePassword(password)) {
      toast.error('Das Passwort muss mindestens einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwörter sind nicht identisch.');
      return;
    }

    setPasswordError('');

    const updatedWorkerData: WorkerResourceProfil = {
      id: worId!,
      name: name,
      email: email,
      password: password,
      location: location,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      profileBase64: profileImage, // Ensuring profilBase64 is included
      slogan: slogan
    };

    try {
      updatedWorkerData.profileBase64 = updatedWorkerData.profileBase64.slice(23);

      const updatedWorker = await updateWorkerProfile(updatedWorkerData);
      console.log("Updated Worker:", updatedWorker);
      toast.success("Profil erfolgreich aktualisiert");
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Workers:", error);
      toast.error("Fehler beim Aktualisieren des Profils");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWorker(worId!);
      await deleteCookie()
      toast.success('Profil erfolgreich gelöscht.');
      window.location.href = "/index";
    } catch (error) {
      console.error('Fehler beim Löschen des Profils:', error);
      toast.error('Fehler beim Löschen des Profils');
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
      <div className="Backg">
        <NavbarWComponent />
        <div className="custom-container">
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
        
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              <MDBInput wrapperClass="inputField1" label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
              <MDBInput wrapperClass="inputField1" label="Adresse" type="text" value={location} onChange={(e) => setLocation(e.target.value)} onBlur={() => handleAddressValidation(location)} />
              {!addressValid && <div style={{ color: 'red' }}>Ungültige Adresse.</div>}
              <MDBInput wrapperClass="inputField1" label="E-Mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <MDBInput wrapperClass="inputField1" label="Passwort" type="password" onChange={handlePasswordChange} />
              <MDBInput wrapperClass="inputField1" label="Passwort erneut eingeben" type="password"  onChange={(e) => setConfirmPassword(e.target.value)} />
              {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
              <MDBProgress className='mb-4'>
                <MDBProgressBar width={passwordStrength * 25} valuemin={0} valuemax={100}>
                  {passwordStrength * 25}%
                </MDBProgressBar>
              </MDBProgress>
              <MDBInput
                wrapperClass="inputField1"
                label="Dein Slogan/Motto"
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
              />
              <div className="profile-upload-container">
                <label htmlFor="profileImage" className="form-label" style={{ color: "white" }}>Profilbild hochladen</label>
                <input className="form-control" type="file" id="profileImage" onChange={handleProfileImageChange} />
              </div>
              <Button  className="button9" variant="success" type="submit">Profil speichern</Button>
              <Button  className="button10" variant="danger" onClick={toggleShow}>
                Account Löschen
              </Button>
            </form>
        </div>
        <div className={`modal fade ${modalShow ? 'show' : ''}`} style={{ display: modalShow ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Auftrag beendet</h5>
              </div>
              <div className="modal-body">
                <p>Bist du sicher, dass du diesen Account wirklich löschen möchtest? </p>   
                Alle Daten werden unwiderruflich gelöscht.
              </div>
              <div className="modal-footer">
                <Row style={{ gap: "12px" }}>
                  <button type="button" className="btn btn-secondary" onClick={toggleShow} style={{ width: "150px" }}>Abbrechen</button>
                  <button type="button" className="btn btn-danger" style={{ width: "150px", gap: "12" }} onClick={handleDelete}>Löschen</button>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer 
        position="top-center" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </>
  );
}

export default PageWorkerProfile;
