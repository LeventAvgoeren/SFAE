import React, { useState } from 'react';
import './PagePasswordReset.css';
import { MDBBtn, MDBContainer, MDBInput, MDBRow, MDBCol, MDBTypography, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

export function PagePasswordReset() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newPassword === confirmPassword) {
            console.log("Passwort zurückgesetzt!");
        } else {
            setPasswordsMatch(false);
        }
    };

    return (
        <div className="background-image">
        <div className="login-container">
        <MDBContainer className="p-3 my-5 d-flex flex-column align-items-center justify-content-center w-50" 
        // style={{ backgroundImage: `url('/background.jpg')`, backgroundSize: 'cover' }}
        >
                <MDBRow className="justify-content-center">

                </MDBRow>

                <MDBCardBody>
                <h2 className="text-uppercase text-center mb-5" style={{color:"white"}}>Passwort zurücksetzen</h2>
                {/* <MDBCol size="12" className="text-center">
                        <img src={'/SFAE_Logo.png'} alt="SFAE Logo" className="img-fluid mb-2" />
                    </MDBCol> */}
                    <form onSubmit={handleSubmit}>
                        <MDBInput wrapperClass='mb-3 inputField' 
                        labelClass='text-white' 
                        label='Altes Passwort' 
                        id='altes-passwort' 
                        type='password'
                        required
                        style={{ width: '280px' }}
                        />

                        <MDBInput
                        wrapperClass='mb-3 inputField' 
                        labelClass='text-white' 
                        label='Neues Passwort' 
                        id='neues-passwort' 
                        type='password'
                        required
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                        />

                        <MDBInput
                        wrapperClass='mb-3 inputField' 
                        labelClass='text-white' 
                        label='Passwort nochmal eingeben' 
                        id='neues-passwort2' 
                        type='password'
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                        />

                        {!passwordsMatch && (
                            <MDBTypography tag='p' className='text-danger'>
                                Die Passwörter stimmen nicht überein. Bitte überprüfen Sie Ihre Eingabe.
                            </MDBTypography>
                        )}

                        <MDBRow>
                            <MDBCol size="auto">
                                <MDBBtn className='mb-4 w-100 gradient-custom-4 button-text-large'>
                                    <Link to="/login" className="link button-text-large">Zurück zum Login</Link>
                                </MDBBtn>
                            </MDBCol>
                            <MDBCol>
                                <MDBBtn className='mb-4 w-100 gradient-custom-4 button-text-large' size='lg' type="submit">Passwort zurücksetzen</MDBBtn>
                            </MDBCol>
                        </MDBRow>
                    </form>
                </MDBCardBody>
        </MDBContainer>
        </div>
        </div>

    );
}
