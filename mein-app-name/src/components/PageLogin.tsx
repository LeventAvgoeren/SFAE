import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DesignVorlage.css';
import { Link } from 'react-router-dom';

export function PageLogin() {
    return (
        <div className="background">
            <div className="container-frame">
                <div style={{ height: '200px' }}></div>
                <img src={'/SFAE_Logo.png'} alt="SFAE Logo" className="img-fluid" />
                <h1>Anmelden</h1>
                <form className="w-50 mx-auto">
                    <div className="mb-3">
                        <label htmlFor="emailInput" className="form-label">Anmeldename</label>
                        <input
                            type="email"
                            className="form-control"
                            id="emailInput"
                            placeholder="name@example.com"
                            required
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
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Anmelden</button>
                    <p>
                        Du hast noch kein Konto? &nbsp;
                        <Link to="/registration" className="link">Hier gehts zur Registrierung</Link>
                    </p>                </form>
                <div style={{ height: '400px' }}></div>
            </div>
        </div>
    );
}
