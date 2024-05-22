import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { login } from "../backend/api";
import { MDBBtn, MDBContainer, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import './PageLogin.css'
import { useLoginContext } from './LoginManager';


export function PageLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('worker');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginInfo, setLoginInfo } = useLoginContext();
  
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
      try {
          const result = await login(email, password, userType);
          if (result) {
              setLoginInfo(result)
                window.localStorage.setItem("isLoggedIn", "true");
              let route = ''
            if (userType === 'worker') {
                route = `/worker/${result.userId}`

            }

            else if(userType === 'customer') {
                route = `/customer/${result.userId}`
            }

          
          navigate(route)
        } else {
          setError('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.');
        }

      } catch (error) {
          console.error("Fehler beim Anmelden:", error);
          setError('Ein technischer Fehler ist aufgetreten.');
      }
  };


  return (
    <div className="background-image">
        <div className="login-container">
            <MDBContainer className="p-3 my-5 d-flex flex-column align-items-center justify-content-center w-50">
                <div className="text-center mb-4">
                    <img src={'/SFAE_Logo.png'} alt="SFAE Logo" className="img-fluid mb-2" />
                    <h1>Anmelden</h1>
                </div>
                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    <MDBInput wrapperClass='mb-3 inputField' labelClass='text-white' label='E-Mail Adresse' id='emailInput' type='email' value={email} onChange={e => setEmail(e.target.value)}/>
                    <MDBInput wrapperClass='mb-4 inputField' labelClass='text-white' label='Passwort' id='passwordInput' type='password' value={password} onChange={e => setPassword(e.target.value)}/>
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
                        <p>Doch kein Konto? Registriere dich hier als <Link to="/registration/worker" className="text-white">Worker</Link> oder als <Link to="/registration/customer" className="text-white">Customer</Link></p>
                        <Link to="/passwordreset" className="text-white">Passwort vergessen?</Link>
                    </div>
                </form>
            </MDBContainer>
        </div>
    </div>
);
}