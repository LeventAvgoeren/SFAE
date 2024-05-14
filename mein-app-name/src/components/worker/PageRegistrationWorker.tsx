import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBCheckbox, MDBTypography, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './DesignVorlage.css'; // Eigene Stilvorlagen
import { registrationWorker } from '../../backend/api';
import { Link } from 'react-router-dom'; // React Router für Link-Benutzung
import './PageRegistrationWorker.css'
interface Position {
    latitude: number;
    longitude: number;
  }
  
export default function PageRegistrationWorker() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [jobType, setJobType] = useState('');
    const [salary, setSalary] = useState(1);
    const [userLocation, setUserLocation] = useState<Position | null>(null);

    const jobTypes = [
        "Hausmeister", "Haushälter", "Gärtner", "Kindermädchen", "Koch", 
        "Putzkraft", "Handwerker", "Elektriker", "Installateur", "Klempner",
        "Maler", "Schädlingsbekämpfer", "Tierpfleger", "Hausbetreuer", "Gassigeher",
        "Wäscher", "Einkäufer", "Caterer", "Personal Trainer", "Ernährungsberater",
        "Musiklehrer", "Babysitter", "Hauslehrer", "Chauffeur", "Reinigungskraft",
        "Schneider", "Organisator", "Tischler", "Möbelträger", "Hundetrainer",
        "Kammerjäger", "Fensterputzer", "Kammerzofen", "Hausdoktor", "Blumenpfleger",
        "Renovierer", "Fensterreiniger", "Gartenarbeiter", "Bügeler", "Bodenleger",
        "Hundepfleger", "Autobesorger"
    ];

    const fetchCoordinates = async (address: string) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
        try {
          console.log("DASD ")
          const response = await fetch(url);
          const data = await response.json();
          if (data.length > 0) {
            const { lat, lon } = data[0];
            setUserLocation({
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
            });
          } else {
            console.error("Address not found");
          }
        } catch (error) {
          console.error("Failed to fetch coordinates:", error);
        }
      };

    const handleRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await fetchCoordinates(address);
            const response = await registrationWorker(name, address, email, password, jobType, salary, userLocation!);
            console.log('Registration successful:', response);
            alert('Registration successful!');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed!');
        }
    };

    return (
        <div className="background-image">
            <MDBContainer fluid className='d-flex align-items-center justify-content-center' style={{ backgroundImage: `url('/background.jpg')`, backgroundSize: 'cover' }}>
                <MDBCard className='worker-registration-container m-5'>
                    <MDBCardBody className='px-5'>
                        <h2 className="text-uppercase text-center mb-5">Registrieren als Worker</h2>
                        <form onSubmit={handleRegistration}>
                            <MDBInput wrapperClass='mb-4' label='Dein Name' size='lg' type='text' value={name} onChange={(e) => setName(e.target.value)} required/>
                            <MDBInput wrapperClass='mb-4' label='Adresse' size='lg' type='text' value={address} onChange={(e) => setAddress(e.target.value)} required/>
                            <MDBInput wrapperClass='mb-4' label='Deine E-Mail' size='lg' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                            <MDBInput wrapperClass='mb-4' label='Passwort' size='lg' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                            <select className="form-select mb-4" value={jobType} onChange={(e) => setJobType(e.target.value)} required>
                                <option value="">Jobtyp wählen...</option>
                                {jobTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                            <MDBInput wrapperClass='mb-4' label='Gehaltswunsch' size='lg' type='number' value={salary} onChange={(e) => setSalary(Number(e.target.value))} required/>
                            <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' type="submit">Registrieren</MDBBtn>
                        </form>
                        <MDBRow>
                            <MDBCol size='12' className='text-center'>
                                <MDBTypography tag='div' className='mb-4'>
                                    Du hast bereits ein Konto? <Link to="/login" className="link">Melde dich hier an</Link>
                                </MDBTypography>
                            </MDBCol>
                        </MDBRow>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
        </div>
    );
}