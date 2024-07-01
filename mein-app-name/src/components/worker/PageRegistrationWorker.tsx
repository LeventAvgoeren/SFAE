import React, { useState, ChangeEvent, FormEvent } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBCheckbox, MDBTypography, MDBRow, MDBCol, MDBProgress, MDBProgressBar, MDBTooltip, MDBIcon } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './DesignVorlage.css';
import { registrationWorker } from '../../backend/api';
import { Link, useNavigate } from 'react-router-dom';
import './PageRegistrationWorker.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

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
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState<any>(null);  // Country is an object now
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobList, setJobList] = useState<string[]>([]);
  const [salary, setSalary] = useState(1);
  const [userLocation, setUserLocation] = useState<Position | null>(null);
  const [addressValid, setAddressValid] = useState(true);
  const [slogan, setSlogan] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  const handleAddressValidation = async (inputAddress: string) => {
    const apiKey = 'a295d6f75ae64ed5b8c6b3568b58bbf6';
    const requestUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(inputAddress)}&key=${apiKey}`;

    try {
      const response = await axios.get(requestUrl);
      const data = response.data;
      if (data.results.length > 0 && data.results[0].components) {
        const components = data.results[0].components;
        setCity(components.city || components.town || components.village || '');
        setPostalCode(components.postcode || '');
        setCountry(components.country || '');
        setUserLocation({
          latitude: data.results[0].geometry.lat,
          longitude: data.results[0].geometry.lng,
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error during address validation:', error);
      return false;
    }
  };

  const jobTypes = [
    "Autobesorger",
    "Babysitter",
    "Blumenpfleger",
    "Bodenleger",
    "Bügeler",
    "Caterer",
    "Chauffeur",
    "Einkäufer",
    "Elektriker",
    "Ernährungsberater",
    "Fensterputzer",
    "Fensterreiniger",
    "Gartenarbeiter",
    "Gassigeher",
    "Gärtner",
    "Handwerker",
    "Hausbetreuer",
    "Hausdoktor",
    "Hauslehrer",
    "Hausmeister",
    "Haushälter",
    "Hundepfleger",
    "Hundetrainer",
    "Installateur",
    "Kammerjäger",
    "Kammerzofen",
    "Klempner",
    "Koch",
    "Kindermädchen",
    "Maler",
    "Möbelträger",
    "Musiklehrer",
    "Organisator",
    "Personal Trainer",
    "Putzkraft",
    "Reinigungskraft",
    "Renovierer",
    "Schädlingsbekämpfer",
    "Schneider",
    "Tierpfleger",
    "Tischler",
    "Wäscher"
  ];

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(getPasswordStrength(newPassword));
  };

  const handleSalaryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSalary(Number(e.target.value));
  };

  const handleRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fullAddress = `${address}, ${city}, ${postalCode}`;
    const isValidAddress = await handleAddressValidation(fullAddress);
    setAddressValid(isValidAddress);

    if (!isValidAddress) {
      alert('Bitte geben Sie eine gültige Adresse ein.');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError('Das Passwort muss mindestens einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwörter sind nicht identisch.');
      return;
    }

    setPasswordError('');

    try {
      const response = await registrationWorker(name, fullAddress, email, password, jobList, salary, userLocation!, slogan);
      toast.success("Bitte bestätigen sie ihre email", {
        onClose: () => navigate("/login")
      });
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error("Ein Fehler ist aufgetreten");
    }
  };

  const handleJobTypeAdd = () => {
    if (jobType && !jobList.includes(jobType)) {
      setJobList([...jobList, jobType]);
      setJobType('');
    }
  };

  const handleJobTypeRemove = (job: string) => {
    setJobList(jobList.filter(j => j !== job));
  };

  const handleCountryChange = (selectedOption: any) => {
    setCountry(selectedOption);
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
              <MDBRow>
                <MDBCol md='6'>
                  <MDBInput wrapperClass='mb-4' label='Dein Name' size='lg' type='text' value={name} onChange={(e) => setName(e.target.value)} required/>
                  <MDBInput wrapperClass='mb-4' label='Adresse' size='lg' type='text' value={address} onChange={e => setAddress(e.target.value)} required/>
                  <MDBInput wrapperClass='mb-4' label='Stadt' size='lg' type='text' value={city} onChange={e => setCity(e.target.value)} required/>
                  <MDBInput wrapperClass='mb-4' label='Postleitzahl' size='lg' type='text' value={postalCode} onChange={e => setPostalCode(e.target.value)} required/>
                </MDBCol>
                <MDBCol md='6'>
                  {!addressValid && <div style={{ color: '#e4a11b' }}>Ungültige Adresse.</div>}
                  <MDBInput wrapperClass='mb-4' label='Deine E-Mail' size='lg' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                  <MDBInput wrapperClass='mb-4' label='Passwort' size='lg' type='password' value={password} onChange={handlePasswordChange} required/>
                  <MDBInput wrapperClass='mb-4' label='Passwort erneut eingeben' size='lg' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </MDBCol>
              </MDBRow>
              <div style={{ color: 'white', marginBottom: '10px' }}>Das Passwort muss mindestens einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.</div>
              {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
              <MDBProgress className='mb-4'>
                <MDBProgressBar width={passwordStrength * 25} valuemin={0} valuemax={100}>
                  {passwordStrength * 25}%
                </MDBProgressBar>
              </MDBProgress>
              <select className="form-select mb-4 option-black" value={jobType} onChange={(e) => setJobType(e.target.value)} style={{backgroundColor:"black", color: "black"}}>
                <option value="" style={{color:'black'}}>Jobtyp wählen...</option>,
                {jobTypes.map((type, index) => (
                  <option key={index} value={type} style={{color:'black'}}>{type}</option>
                ))}
              </select>
              <MDBBtn type="button" onClick={handleJobTypeAdd} className='mb-4 w-100 gradient-custom-4' size='lg'>Job hinzufügen</MDBBtn>
              <ul>
                {jobList.map((job, index) => (
                  <li key={index} style={{ color: 'white' }}>
                    {job}
                    <MDBIcon fas icon="times" style={{ marginLeft: '10px', cursor: 'pointer', color: 'red' }} onClick={() => handleJobTypeRemove(job)} />
                  </li>
                ))}
              </ul>
              <label className="form-label" style={{ color: 'white' }}>Gehaltswunsch (Ab welchem Gehalt sollen wir dir Aufträge zusenden?)</label>
              <div className="salary-slider">
                <MDBTooltip tag="div" title={`€${salary}`}>
                  <input type="range" min="0" max="1000" value={salary} onChange={handleSalaryChange} className="custom-range" />
                </MDBTooltip>
                <div className="salary-label">€{salary}</div>
              </div>
              <MDBInput
                wrapperClass='mb-4'
                label='Dein Slogan/Motto'
                size='lg'
                type='text'
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
              />
              <MDBCheckbox name='termsCheck' id='termsCheck' label={<span>Ich stimme den <Link to="/agb" className="text-white">Nutzungsbedingungen</Link> zu</span>} wrapperClass='d-flex justify-content-center mb-4 text-white' required/>
              <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' type="submit">Registrieren</MDBBtn>
            </form>
            <MDBRow>
              <MDBCol size='12' className='text-center'>
                <MDBTypography tag='div' >
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
