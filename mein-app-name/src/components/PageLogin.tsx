import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { login } from "../backend/api";
import { MDBBtn, MDBContainer, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import './PageLogin.css'


export function PageLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('worker');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
      try {
          const result = await login(email, password, userType);
          if (result) {
              navigate(userType === 'worker' ? `/worker/${result.userId}` : `/customer/${result.userId}`);
          } else {
              setError('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.');
              let route = ''
          if (userType === 'worker') {
            route = `/worker/${result.userId}`

          }

          else if(userType === 'customer') {
            route = `/customer/${result.userId}`
          }
          else if(userType === 'admin') {
            route = `/admin/${result.userId}`
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
    <MDBContainer className="p-3 my-5 d-flex flex-column align-items-center justify-content-center w-50">
    <div className="text-center mb-4">
        <img src={'/SFAE_Logo.png'} alt="SFAE Logo" className="img-fluid mb-2" />
        <h1>Anmelden</h1>
    </div>
    <form onSubmit={handleLogin} style={{ width: '100%' }}>
        <MDBInput wrapperClass='mb-3' label='E-Mail Adresse' id='emailInput' type='email' value={email} onChange={e => setEmail(e.target.value)} />
        <MDBInput wrapperClass='mb-4' label='Passwort' id='passwordInput' type='password' value={password} onChange={e => setPassword(e.target.value)} />
        
        <div className="d-flex justify-content-around w-100 mb-3">
            <div className="form-check">
                <input className="form-check-input" type="radio" name="userType" id="worker" value="worker" checked={userType === 'worker'} onChange={() => setUserType('worker')} />
                <label className="form-check-label" htmlFor="worker">Worker</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="userType" id="customer" value="customer" checked={userType === 'customer'} onChange={() => setUserType('customer')} />
                <label className="form-check-label" htmlFor="customer">Customer</label>
            </div>
            <div className="form-check">
            <input className="form-check-input" type="radio" name="userType" id="admin" value="admin" checked={userType === 'admin'} onChange={() => setUserType('admin')} />
            <label className="form-check-label" htmlFor="admin">Admin</label>
          </div>

        </div>

        <MDBBtn type="submit" className="mb-4">Anmelden</MDBBtn>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <div className="text-center">
            <p>Doch kein Konto? Registriere dich hier als <Link to="/registration/worker">Worker</Link> oder als <Link to="/registration/customer">Customer</Link></p>
            <Link to="/passwordreset">Passwort vergessen?</Link>
        </div>
    </form>
</MDBContainer>

  );
}
