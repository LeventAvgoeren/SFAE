import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBInput, MDBCheckbox, MDBTypography, MDBRow, MDBCol, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import './PageRegistration.css';
import { registrationCustomer } from '../../backend/api';
import axios from 'axios';
import validator from 'validator';

export default function PageRegistration() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [addressValid, setAddressValid] = useState(true);
    const navigate = useNavigate();

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

    const handleRegistration = async (event: any) => {
        event.preventDefault();
        console.log('Starting registration process...');  // Log the start of the registration process

        const isValidAddress = true
        setAddressValid(isValidAddress);
        console.log(`Address validation result: ${isValidAddress}`);  // Log the result of the address validation

        if (!isValidAddress) {
            alert('Bitte geben Sie eine gültige Adresse ein.');
            return;
        }

        try {
            const response = await registrationCustomer(name, password, email);
            console.log('Registration successful:', response);  // Log the response from the registration attempt
            alert('Registration successful!');
            navigate("/login");
        } catch (error) {
            console.error('Registration failed:', error);  // Log any error that occurs during registration
            alert('Registration failed!');
        }
    };

    const validateAddress = (address: string): boolean => {
        // Einfache Validierung: Mindestens 10 Zeichen
        return address.length >= 10;
    };
    

    return (
        <div className="animated-background">
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
                        {!addressValid && <div style={{ color: '#e4a11b' }}>Ungültige Adresse.</div>}

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

                        <MDBInput
                            wrapperClass='mb-3 inputField'
                            labelClass='text-white'
                            label='Passwort'
                            id='passwordInput'
                            type='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />

<MDBCheckbox
                            name='termsCheck'
                            id='termsCheck'
                            label={<span>Ich stimme den <Link to="/agb" className="text-white">Nutzungsbedingungen</Link> zu</span>}
                            wrapperClass='d-flex justify-content-center mb-4 text-white'
                            required
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
        </div>
    );
}