import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBCheckbox, MDBTypography, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import validator from 'validator';
import './PageRegistration.css';
import { registrationCustomer } from '../../backend/api';

export default function PageRegistration() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate= useNavigate()


    const handleRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!validator.isEmail(email)) {
        alert('Bitte gib eine gültige E-Mail-Adresse ein.');
        return;
    }

    if (!validateAddress(address)) {
        alert('Bitte gib eine gültige Adresse ein.');
        return;
    }
    
        try {
          const response = await registrationCustomer(name, password, email);
         
          console.log('Registration successful:', response);
            alert('Registration successful!');
            navigate("/login")
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed!');
        }
    };

    const validateAddress = (address: string): boolean => {
        // Einfache Validierung: Mindestens 10 Zeichen
        return address.length >= 10;
    };
    

    return (
        <div className="background-image" >
            <div className="registration-container2">
                <MDBContainer className="p-3 my-5 d-flex flex-column align-items-center justify-content-center">
                    <div className="text-center mb-4">
                        <h1>Registrieren als Customer</h1>
                    </div>
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
                            required
                        />

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
                            label='Ich stimme den Nutzungsbedingungen zu'
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
                </MDBContainer>
            </div>
        </div>
    );
}
