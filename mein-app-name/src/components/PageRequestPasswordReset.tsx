import React, { useState } from 'react';
import './PagePasswordReset.css';
import { MDBContainer, MDBInput, MDBRow, MDBCol, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import { requestPassword } from '../backend/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';

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
                            {/* <MDBRow>
                                <MDBCol>
                                    <button 
                                        className='mb-4 w-100 gradient-custom-4 button-text-large' 
                                        style={{backgroundColor: "gray", color: 'white', border: 'none', boxShadow: 'none', padding: '15px 0', fontSize: '16px', borderRadius: '8px', transition: 'background-color 0.3s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b0b0b0'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'gray'}>
                                        <Link to="/login" className="link button-text-large" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>Zurück zum Login</Link>
                                    </button>
                                </MDBCol>
                                <MDBCol>
                                    <button 
                                        className='mb-4 w-100 gradient-custom-4 button-text-large' 
                                        type="submit"
                                        style={{ padding: '15px 0', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', boxShadow: 'none', borderRadius: '8px', transition: 'background-color 0.3s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}>
                                        Passwort zurücksetzen
                                    </button>
                                </MDBCol>
                            </MDBRow> */}
                            <MDBRow>
                                <MDBCol>
                                    <button 
                                        className='mb-4 w-100 gradient-custom-4 button-text-large' 
                                        style={{backgroundColor: "gray", color: 'white', border: 'none', boxShadow: 'none', padding: '15px 0', fontSize: '15px', borderRadius: '8px', transition: 'background-color 0.3s', height:"40px",display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b0b0b0'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'gray'}>
                                        <Link to="/login" className="link button-text-large" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>Zurück zum Login</Link>
                                    </button>
                                </MDBCol>
                                <MDBCol>
                                    <button 
                                        className='mb-4 w-100 gradient-custom-4 button-text-large' 
                                        type="submit"
                                        style={{ padding: '15px 0', fontSize: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', boxShadow: 'none', borderRadius: '8px', transition: 'background-color 0.3s', height:"40px",display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}>
                                        Passwort zurücksetzen
                                    </button>
                                </MDBCol>
                            </MDBRow>
                        </form>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
            <Footer></Footer>
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
