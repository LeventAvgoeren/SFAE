import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PagePasswordReset.css'
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';

export function PagePasswordReset() {

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newPassword === confirmPassword) {
            // Passwort zurücksetzen
            console.log("Passwort zurückgesetzt!");
        } else {
            setPasswordsMatch(false);
        }
    };

    return (
        <div className="background-city">
            <div className="container-frame3">
                <img src={'/SFAE_Logo.png'} alt="SFAE Logo" className="img-fluid" />

                <h1 style={{ color: 'white', textAlign: 'center' }}>Passwort zurücksetzen</h1>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div className="mb-3">
                        <label htmlFor="emailInput" className="form-label"></label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Altes passwort"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="passwordInput" className="form-label"></label>
                        <input
                            type="password"
                            className="form-control"
                            id="passwordInput"
                            placeholder="Neues Passwort eingeben"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmPasswordInput" className="form-label"></label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPasswordInput"
                            placeholder="Neues Passwort nochmal eingeben"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                    </div>

                    {!passwordsMatch && (
                        <p style={{ color: 'red' }}>Die Passwörter stimmen nicht überein. Bitte überprüfen Sie Ihre Eingabe.</p>
                    )}

                    <Row>
                        <Col xs="6">
                            <Button variant='secondary' className="w-100 small-text">
                                <Link to="/login" className="link">Zurück zum Login</Link>
                            </Button>
                        </Col>
                        <Col xs="6">
                            <button type="submit" className="btn btn-primary w-100 small-text">Passwort zurücksetzen</button>
                        </Col>
                    </Row>
                </form>
            </div>
        </div>
    );
}
