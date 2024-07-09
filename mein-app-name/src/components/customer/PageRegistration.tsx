import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MDBBtn, MDBContainer, MDBInput, MDBCheckbox, MDBTypography, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBProgress, MDBProgressBar, MDBIcon } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import './PageRegistration.css';
import { registrationCustomer, safeEmailToNewsLetter } from '../../backend/api';
import axios from 'axios';
import validator from 'validator';
import Footer from '../Footer';

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



export default function PageRegistration() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [addressValid, setAddressValid] = useState(true);
    const [passwordError, setPasswordError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();
    const [newsLetteracc,setNewsLetteracc]= useState(false);

    const handleAddressValidation = async (inputAddress: string) => {
        const apiKey = 'a295d6f75ae64ed5b8c6b3568b58bbf6';  
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

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(getPasswordStrength(newPassword));
    };

    const handleRegistration = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Starting registration process...');  // Log the start of the registration process

        const isValidAddress = true
        setAddressValid(isValidAddress);
        console.log(`Address validation result: ${isValidAddress}`);  // Log the result of the address validation

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
            const response = await registrationCustomer(name, password, email);
            if(response){
            
            }
            console.log('Registration successful:', response);  // Log the response from the registration attempt
            toast.success("Bestätigen sie nun ihre email", {
                onClose: () => navigate("/login")
            });
        } catch (error) {
            console.error('Registration failed:', error);  // Log any error that occurs during registration
            toast.error("Fehler beim Erstellen des Accounts")
        }
    };

    async function safeEmail(){
        await safeEmailToNewsLetter(email)
    }

    useEffect(()=> {
        if(newsLetteracc){
            safeEmail()
        }
    },[newsLetteracc])

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
                <MDBCard className='customer-registration-container m-5'>
                    <MDBCardBody className='px-5'>
                        <h2 className="text-uppercase text-center mb-5">Registrieren als Customer</h2>
                        <form onSubmit={handleRegistration} style={{ width: '100%' }}>
                            <MDBInput
                                wrapperClass='mb-3 inputField'
                                labelClass='text-white'
                                label='Dein Name'
                                id='nameInput'
                                type='text'
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                            <MDBInput
                                wrapperClass='mb-3 inputField'
                                labelClass='text-white'
                                label='Adresse'
                                id='addressInput'
                                type='text'
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                onBlur={() => handleAddressValidation(address).then(valid => setAddressValid(valid))}
                                required
                            />
                            {!addressValid && <div style={{ color: 'red' }}>Ungültige Adresse.</div>}
                            <MDBInput
                                wrapperClass='mb-3 inputField'
                                labelClass='text-white'
                                label='E-Mail Adresse'
                                id='emailInput'
                                type='email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <div style={{ position: 'relative' }}>
                            <MDBInput
                                wrapperClass='mb-3 inputField'
                                labelClass='text-white'
                                label='Passwort'
                                id='passwordInput'
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                             <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                    >
                      {showPassword ? <MDBIcon fas icon="eye-slash" /> : <MDBIcon fas icon="eye" />}
                    </span>
                    </div>
                            <MDBInput
                                wrapperClass='mb-3 inputField'
                                labelClass='text-white'
                                label='Passwort erneut eingeben'
                                id='confirmPasswordInput'
                                type='password'
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                            <div style={{ color: 'white', marginBottom: '10px' }}>Das Passwort muss mindestens einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.</div>
                            {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
                            <MDBProgress className='mb-4'>
                                <MDBProgressBar width={passwordStrength * 25} valuemin={0} valuemax={100}>
                                    {passwordStrength * 25}%
                                </MDBProgressBar>
                            </MDBProgress>
                            <MDBCheckbox
                                name='termsCheck'
                                id='termsCheck'
                                label={<span>Ich stimme den <Link to="/agb" className="text-white">Nutzungsbedingungen</Link> zu</span>}
                                wrapperClass='d-flex justify-content-center mb-4 text-white'
                                required
                            />
                             <MDBCheckbox
                                name='termsCheck'
                                id='termsCheck'
                                label={<span>Ich stimme den <Link to="/agb" className="text-white">News Letter</Link> zu</span>}
                                wrapperClass='d-flex justify-content-center mb-4 text-white'
                                checked={newsLetteracc}
                                onChange={(e)=>setNewsLetteracc(e.target.checked)}
                            />
                            <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' type="submit">Registrieren</MDBBtn>
                            <MDBRow>
                                <MDBCol size='12' className='text-center'>
                                    <MDBTypography tag='div' className='mb-4'>
                                        Du hast bereits ein Konto? <Link to="/login" className="text-white">Melde dich hier an</Link>
                                    </MDBTypography>
                                </MDBCol>
                            </MDBRow>
                        </form>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
            <Footer></Footer>

        </div>
    );
}
