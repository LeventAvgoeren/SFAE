import React, { useState, ChangeEvent, FormEvent } from 'react';
import './PagePasswordReset.css';
import { MDBBtn, MDBContainer, MDBInput, MDBRow, MDBCol, MDBTypography, MDBCard, MDBCardBody, MDBProgress, MDBProgressBar, MDBIcon } from 'mdb-react-ui-kit';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { updatePassword } from '../backend/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';

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

export function PagePasswordReset() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const tokenID = searchParams.get("token");

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [passwordError, setPasswordError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;
        setNewPassword(newPassword);
        setPasswordStrength(getPasswordStrength(newPassword));
    };

    const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validatePassword(newPassword)) {
            setPasswordError('Das Passwort muss mindestens einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwörter sind nicht identisch.');
            setPasswordsMatch(false);
            return;
        }

        setPasswordError('');
        setPasswordsMatch(true);

        try {
            await updatePassword(tokenID!, newPassword);
            toast.success('Passwort erfolgreich zurückgesetzt!', {
                onClose: () => navigate('/login')
            });
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Passwort zurücksetzen fehlgeschlagen.');
        }
    };

    return (
        <>
            <div className="animated-background">
                <MDBContainer fluid className='d-flex align-items-center justify-content-center' style={{ backgroundSize: 'cover', height: '100vh' }}>
                    <MDBCard className='worker-registration-container m-5'>
                        <MDBCardBody>
                            <h2 className="text-uppercase text-center mb-5" style={{ color: "white" }}>Passwort zurücksetzen</h2>
                            <form onSubmit={handleSubmit}>
                                <div style={{ color: 'white', marginBottom: '10px' }}>Das Passwort muss mindestens einen Großbuchstaben, <br />eine Zahl und ein Sonderzeichen enthalten.</div>
                                <div style={{ position: 'relative' }}>
                                    <MDBInput
                                        wrapperClass='mb-3 inputField'
                                        labelClass='text-white'
                                        label='Neues Passwort'
                                        id='neues-passwort'
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                            color: 'white' // Optionally to match the text color
                                        }}
                                    >
                                        {showPassword ? <MDBIcon fas icon="eye-slash" /> : <MDBIcon fas icon="eye" />}
                                    </span>
                                </div>

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
                                {passwordError && (
                                    <MDBTypography tag='p' className='text-danger'>
                                        {passwordError}
                                    </MDBTypography>
                                )}
                                <MDBProgress className='mb-4'>
                                    <MDBProgressBar width={passwordStrength * 25} valuemin={0} valuemax={100}>
                                        {passwordStrength * 25}%
                                    </MDBProgressBar>
                                </MDBProgress>
                                <MDBRow>
                                    <MDBCol>
                                        <button
                                            className='mb-4 w-100 gradient-custom-4 button-text-large'
                                            style={{
                                                backgroundColor: "gray", color: 'white', border: 'none', boxShadow: 'none', padding: '15px 0', fontSize: '15px', borderRadius: '8px', transition: 'background-color 0.3s', height: "40px", display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b0b0b0'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'gray'}>
                                            <Link to="/login" className="link button-text-large" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>Zurück zum Login</Link>
                                        </button>
                                    </MDBCol>
                                    <MDBCol>
                                        <button
                                            className='mb-4 w-100 gradient-custom-4 button-text-large'
                                            type="submit"
                                            style={{
                                                padding: '15px 0', fontSize: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', boxShadow: 'none', borderRadius: '8px', transition: 'background-color 0.3s', height: "40px", display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
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
                autoClose={5000}
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
