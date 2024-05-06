import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { login } from "../backend/api";
import { MDBBtn, MDBContainer, MDBIcon, MDBInput } from 'mdb-react-ui-kit';


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
          }
      } catch (error) {
          console.error("Fehler beim Anmelden:", error);
          setError('Ein technischer Fehler ist aufgetreten.');
      }
  };


  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <div className="text-center mb-4">
        <img src={'/SFAE_Logo.png'} alt="SFAE Logo" className="img-fluid mb-2" />
        <h1>Anmelden</h1>
      </div>
      <form onSubmit={handleLogin}>
        <MDBInput wrapperClass='mb-3' label='E-Mail Adresse' id='emailInput' type='email' value={email} onChange={e => setEmail(e.target.value)} />
        <MDBInput wrapperClass='mb-4' label='Passwort' id='passwordInput' type='password' value={password} onChange={e => setPassword(e.target.value)} />

        
        <div className="d-flex justify-content-between">
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
          <p>Doch kein Konto? Registriere dich hier als oder Worker<a href="#!">Customer</a></p>
          <div className='d-flex justify-content-between mx-auto' style={{width: '40%'}}>
            <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
              <MDBIcon fab icon='facebook-f' size="sm"/>
            </MDBBtn>
            <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
              <MDBIcon fab icon='twitter' size="sm"/>
            </MDBBtn>
            <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
              <MDBIcon fab icon='google' size="sm"/>
            </MDBBtn>
            <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
              <MDBIcon fab icon='github' size="sm"/>
            </MDBBtn>
            
          </div>
        </div>
      </form>
    </MDBContainer>
  );
}
