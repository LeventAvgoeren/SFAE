import React, { useState } from 'react';
import './PagePasswordReset.css';
import { MDBBtn, MDBContainer, MDBInput, MDBRow, MDBCol, MDBTypography, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import { getUserFromEmail, requestPassword } from '../backend/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingIndicator from './LoadingIndicator';

export function PageRequestPasswordReset() {
    const [getEmail, setEmail] = useState('');
    const navigate = useNavigate();

    const handleNewPasswordChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    async function reqPaw(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();  
        
        try {
            await requestPassword(getEmail);
            toast.success('Anfrage erfolgreich gesendet!', {
                onClose: () => navigate('/login')
            });
        } catch (error) {
            console.error('Error requesting password:', error);
            toast.error('Fehler beim Senden der Anfrage. Bitte überprüfen Sie Ihre E-Mail-Adresse und versuchen Sie es erneut.');
        }
    }

    return (
        <>
        <div className="animated-background">
            <MDBContainer fluid className='d-flex align-items-center justify-content-center' style={{ backgroundSize: 'cover', height: '100vh' }}>
                <MDBCard className='worker-registration-container m-5'>
                    <MDBCardBody>
                        <h2 className="text-uppercase text-center mb-5" style={{color:"white"}}>Passwort zurücksetzen</h2>
                        <form onSubmit={reqPaw}>
                            <MDBInput 
                                wrapperClass='mb-3 inputField' 
                                labelClass='text-white' 
                                label='Email' 
                                id='email' 
                                type='email'
                                required
                                onChange={handleNewPasswordChange}
                            />
                            <MDBRow>
                                <MDBCol size="auto">
                                    <MDBBtn className='mb-4 w-100 gradient-custom-4 button-text-large' size='sm'>
                                        <Link to="/login" className="link button-text-large">Zurück zum Login</Link>
                                    </MDBBtn>
                                </MDBCol>
                                <MDBCol>
                                    <MDBBtn className='mb-4 w-100 gradient-custom-4 button-text-large' size='sm' type="submit">Passwort zurücksetzen</MDBBtn>
                                </MDBCol>
                            </MDBRow>
                        </form>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
        </div>
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
        </>
    );
}
