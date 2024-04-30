import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import für Navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import './DesignVorlage.css';
import { Link } from 'react-router-dom';
import { login } from "../backend/api";

export function PageLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Navigation Hook

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Verhindert, dass das Formular neu lädt
        try {
            const result = await login(email, password);
            if (result && result.userId) {
                console.log("Login erfolgreich", result);
                // Weiterleitung auf die Worker-Index-Seite
                navigate('/worker/');  // Angenommen, `userId` ist die Worker ID
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
