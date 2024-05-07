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
        <MDBContainer fluid className='d-flex align-items-center justify-content-center' style={{ backgroundImage: `url('/background.jpg')`, backgroundSize: 'cover' }}>
            <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
                <MDBRow className="justify-content-center">

                </MDBRow>

                <MDBCardBody>
                <h2 className="text-uppercase text-center mb-5">Passwort zurücksetzen</h2>
                {/* <MDBCol size="12" className="text-center">
                        <img src={'/SFAE_Logo.png'} alt="SFAE Logo" className="img-fluid mb-2" />
                    </MDBCol> */}
                    <form onSubmit={handleSubmit}>
                        <MDBInput label="Altes Passwort" type="password" id="oldPassword" wrapperClass='mb-4' required />

                        <MDBInput
                            label="Neues Passwort eingeben"
                            type="password"
                            wrapperClass='mb-4'
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            required
                        />

                        <MDBInput
                            label="Neues Passwort nochmal eingeben"
                            type="password"
                            wrapperClass='mb-4'
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
                            <MDBCol size="6">
                                <MDBBtn className='mb-4 w-100 gradient-custom-4 button-text-large' size='lg' type="submit">
                                    <Link to="/login" className="link button-text-large">Zurück zum Login</Link>
                                </MDBBtn>
                            </MDBCol>
                            <MDBCol size="6">
                                <MDBBtn className='mb-4 w-100 gradient-custom-4 button-text-large' size='lg' type="submit">Passwort zurücksetzen</MDBBtn>
                            </MDBCol>
                        </MDBRow>
                    </form>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
}
