import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../backend/api";



export function PageLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('worker'); // Standardmäßig auf 'worker' setzen
    const [error, setError] = useState('');
    const navigate = useNavigate();  
    const [id, setID] = useState('');

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      try {
        const result = await login(email, password, userType);
        if (result) {
            navigate(userType === 'worker' ? `/worker/${result.userId}` : `/customer/${result.userId}`);
        } else {
          console.log("Login fehlgeschlagen");
          setError('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.');
        }
      } catch (error) {
        console.error("Fehler beim Anmelden:", error);
        setError('Ein technischer Fehler ist aufgetreten.');
      }
    }; 
  
  
    return (
      <div className="background">
        <div className="container-frame">
          <img src={'/SFAE_Logo.png'} alt="SFAE Logo" className="img-fluid" />
          <h1>Anmelden</h1>
          <form className="w-50 mx-auto" onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">E-Mail Adresse</label>
              <input
                type="email"
                className="form-control"
                id="emailInput"
                placeholder="name@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordInput" className="form-label">Passwort</label>
              <input
                type="password"
                className="form-control"
                id="passwordInput"
                placeholder="Passwort"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="userType"
                  id="worker"
                  value="worker"
                  checked={userType === 'worker'}
                  onChange={() => setUserType('worker')}
                />
                <label className="form-check-label" htmlFor="worker">
                  Worker
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="userType"
                  id="customer"
                  value="customer"
                  checked={userType === 'customer'}
                  onChange={() => setUserType('customer')}
                />
                <label className="form-check-label" htmlFor="customer">
                  Customer
                </label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Anmelden</button>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <p>
              Du hast noch kein Konto?
              <div style={{ color: 'white' }}>
                Hier gehts zur Registrierung als&nbsp;
                <Link to="/registration/customer" className="link">customer</Link> oder&nbsp;
                <Link to="/registration/worker" className="link">worker</Link>.
              </div>
              <Link to="/passwordreset">Passwort vergessen?</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }