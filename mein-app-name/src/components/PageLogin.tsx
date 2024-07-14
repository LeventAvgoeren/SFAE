import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { login } from "../backend/api";
import { MDBBtn, MDBCard, MDBContainer, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import './PageLogin.css'; 
import { useLoginContext } from './LoginManager';
import LoadingIndicator from './LoadingIndicator';
import { ToastContainer, toast } from 'react-toastify';
import Footer from './Footer';

export function PageLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('worker');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { loginInfo, setLoginInfo } = useLoginContext();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        const { result, status } = await login(email, password, userType);
        if (result) {
            setLoginInfo(result);
            let route = '';
            if (userType === 'worker') {
                route = `/worker/${result.userId}`;
            } else if (userType === 'customer') {
                route = `/customer/${result.userId}`;
            }
            navigate(route);
        } else {
            if (status === 403) {
                toast.error("Bitte bestätigen Sie Ihre E-Mail");
            } else {
                setError('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.');
            }
        }
    } catch (error) {
        console.error("Fehler beim Anmelden:", error);
        setError('Ein technischer Fehler ist aufgetreten.');
    }
};

  useEffect(() => {
    setIsLoading(false);
  }, []);

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
        <MDBCard className='login-registration-container m-5'>
            <div className="text-center mb-4">
                <img src={'/SFAE_Logo.png'} alt="SFAE Logo" className="img-fluid mb-2" style={{maxHeight:"125px", maxWidth:"125px"}}/>
                <h1 className='AnmeldenLogin'>Anmelden</h1>
            </div>
            <form onSubmit={handleLogin} style={{ width: '100%' }}>
                <MDBInput className="inputField-fluid" wrapperClass='mb-3 inputField' labelClass='text-white' label='E-Mail Adresse' id='emailInput' type='email' value={email} onChange={e => setEmail(e.target.value)} />
                <div className="mb-4 inputField position-relative">
                  <MDBInput 
                    wrapperClass='d-inline' 
                    labelClass='text-white' 
                    label='Passwort' 
                    id='passwordInput' 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                  />
                  <span 
                    onClick={() => setShowPassword(!showPassword)} 
                    style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                  >
                    {showPassword ? <MDBIcon fas icon="eye-slash" /> : <MDBIcon fas icon="eye" />}
                  </span>
                </div>
                <div className="d-flex justify-content-around w-100 mb-3">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="userType" id="worker" value="worker" checked={userType === 'worker'} onChange={() => setUserType('worker')} />
                        <label className="form-check-label" htmlFor="worker">Worker</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="userType" id="customer" value="customer" checked={userType === 'customer'} onChange={() => setUserType('customer')} />
                        <label className="form-check-label" htmlFor="customer">Customer</label>
                    </div>
                </div>
                <MDBBtn type="submit" className="mb-4">Anmelden</MDBBtn>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <div className="text-center">
                    <p>Doch kein Konto? Registriere dich hier als <Link to="/registration/worker" className="text-white"><u>Worker</u></Link> oder als <Link to="/registration/customer" className="text-white"><u>Customer</u></Link></p>
                    <Link to="/passwordreset" className="text-white"><u>Passwort vergessen?</u></Link>
                </div>
            </form>
        </MDBCard>
    </MDBContainer>
    <Footer></Footer>
</div>
  );
}
