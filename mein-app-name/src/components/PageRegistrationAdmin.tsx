import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBCheckbox, MDBTypography, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './DesignVorlage.css'; // Eigene Stilvorlagen
import { registrationAdmin } from '../backend/api';
import { Link } from 'react-router-dom'; // React Router für Link-Benutzung
import './PageRegistrationAdmin.css';

export default function PageRegistrationAdmin() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('/index2.jpg');
    
    const handleRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
        try {
            const response = await registrationAdmin(name, password, email);
            console.log('Registration successful:', response);
            alert('Registration successful!');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed!');
        }
    };

    return (
<MDBContainer fluid className='d-flex align-items-center justify-content-center' style={{/* backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' */}}>
          <MDBCard className='m-5' style={{maxWidth: '600px'}}>
            <MDBCardBody className='px-5'>
              <h2 className="text-uppercase text-center mb-5">Erstelle ein Admin Account!</h2>
              <form onSubmit={handleRegistration}>
                <MDBInput wrapperClass='mb-4' label='Dein Name' size='lg' id='form1' type='text' value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required/>
                <MDBInput wrapperClass='mb-4' label='Adresse' size='lg' id='formAddress' type='text' value={address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)} required/>
                <MDBInput wrapperClass='mb-4' label='Deine E-Mail' size='lg' id='form2' type='email' value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required/>
                <MDBInput wrapperClass='mb-4' label='Passwort' size='lg' id='form3' type='password' value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required/>
                <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='Ich stimme den Nutzungsbedingungen zu' wrapperClass='d-flex justify-content-center mb-4' />
                <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' type="submit">Register</MDBBtn>
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
      );
}
