import React, { useState, ChangeEvent, FormEvent } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBCheckbox, MDBTypography, MDBRow, MDBCol, MDBProgress, MDBProgressBar } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './DesignVorlage.css'; // Eigene Stilvorlagen
import { registrationWorker } from '../../backend/api';
import { Link, useNavigate } from 'react-router-dom'; // React Router für Link-Benutzung
import './PageRegistrationWorker.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Position {
    latitude: number;
    longitude: number;
}

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

export default function PageRegistrationWorker() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [city, setCity] = useState('');
    const [postcode, setPostcode] = useState('');

    const [confirmPassword, setConfirmPassword] = useState('');
    const [jobType, setJobType] = useState('');
    const [salary, setSalary] = useState(1);
    const [userLocation, setUserLocation] = useState<Position | null>(null);
    const [addressValid, setAddressValid] = useState(true);
    const [slogan, setSlogan] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);

    const navigate = useNavigate();

    const handleAddressValidation = async (inputAddress: string) => {
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

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(getPasswordStrength(newPassword));
    };

    const handleRegistration = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Starting registration process...');
    
        // Zuerst Adresse validieren
        const isValidAddress = await handleAddressValidation(address);
        setAddressValid(isValidAddress);
    
        if (!isValidAddress) {
            alert('Bitte geben Sie eine gültige Adresse ein.');
            return;
        }
    
        // Koordinaten abrufen, wenn die Adresse gültig ist
        await fetchCoordinates(address);
    
        if (!validatePassword(password)) {
            setPasswordError('Das Passwort muss mindestens einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.');
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError('Passwörter sind nicht identisch.');
            return;
        }
    
        setPasswordError('');
    
        // Fortfahren, wenn alles erfolgreich war
        try {
            const response = await registrationWorker(name, address, email, password, jobType, salary, userLocation!, slogan);
            toast.success("Account wurde erfolgreich erstellt", {
                onClose: () => navigate("/login")
            });
        } catch (error) {
            console.error('Registration failed:', error);
            toast.error("Email Addresse schon vorhanden")
        }
    };

    return (
        
        <div className="animated-background">
             <ToastContainer 
            position="top-center" 
            autoClose={1000} 
            hideProgressBar={false} 
            newestOnTop={false} 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover 
        />
            <MDBContainer fluid className='d-flex align-items-center justify-content-center' style={{ backgroundSize: 'cover', height: '100vh' }}>
                <MDBCard className='worker-registration-container m-5'>
                    <MDBCardBody className='px-5'>
                        <h2 className="text-uppercase text-center mb-5">Registrieren als Worker</h2>
                        <form onSubmit={handleRegistration}>
                            <MDBInput wrapperClass='mb-4' label='Dein Name' size='lg' type='text' value={name} onChange={(e) => setName(e.target.value)} required/>
                            <MDBInput wrapperClass='mb-3 inputField' label='Adresse' id='addressInput' type='text' value={address} onChange={e => setAddress(e.target.value)} onBlur={() => handleAddressValidation(address).then(valid => setAddressValid(valid))} required/>
                            {!addressValid && <div style={{ color: '#e4a11b' }}>Ungültige Adresse.</div>}
                            <MDBInput wrapperClass='mb-4' label='Deine E-Mail' size='lg' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                            <MDBInput wrapperClass='mb-4' label='Passwort' size='lg' type='password' value={password} onChange={handlePasswordChange} required/>
                            <MDBInput wrapperClass='mb-4' label='Passwort erneut eingeben' size='lg' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
                            <MDBProgress className='mb-4'>
                                <MDBProgressBar width={passwordStrength * 25} valuemin={0} valuemax={100}>
                                    {passwordStrength * 25}%
                                </MDBProgressBar>
                            </MDBProgress>
                            <select className="form-select mb-4 option-black" value={jobType} onChange={(e) => setJobType(e.target.value)} required style={{backgroundColor:"black", color: "black"}}>
                                <option value="" style={{color:'black'}}>Jobtyp wählen...</option>,
                                {jobTypes.map((type, index) => (
                                    <option key={index} value={type} style={{color:'black'}}>{type}</option>
                                ))}
                            </select>
                            <MDBInput wrapperClass='mb-4' label='Gehaltswunsch' size='lg' type='number' value={salary} onChange={(e) => setSalary(Number(e.target.value))} required/>
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Dein Slogan/Motto'
                                size='lg'
                                type='text'
                                value={slogan}
                                onChange={(e) => setSlogan(e.target.value)}
                                required
                            />
                            <MDBCheckbox name='termsCheck' id='termsCheck' label={<span>Ich stimme den <Link to="/agb" className="text-white">Nutzungsbedingungen</Link> zu</span>} wrapperClass='d-flex justify-content-center mb-4 text-white' required/>
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
