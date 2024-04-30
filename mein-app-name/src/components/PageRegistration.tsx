import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DesignVorlage.css';
import './PageRegistration.css';
import { registrationCustomer } from '../backend/api';

export function PageRegistration() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(''); // Manage this state if roles are predefined

    const handleRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
        try {
            const response = await registrationCustomer(name, password,email);
            console.log('Registration successful:', response);
            alert('Registration successful!');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed!');
        }
    };

    return (
        <div className="background">
            <div className="container-frame">
                <div style={{ height: '300px' }}></div>
                <img src={'/SFAE_Logo.png'} alt="SFAE Logo" className="img-fluid" />
                <h1 className="text-center">Registrieren</h1>
                <form className="w-50 mx-auto" onSubmit={handleRegistration}>
                    <div style={{ height: '20px' }}></div>

                    <div className="input-group mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Vollständiger Name"
                            required 
                        />
                    </div>

                    <div className="input-group mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="Adresse"
                            required 
                        />
                    </div>

                    <div className="input-group mb-3">
                        <input 
                            type="email" 
                            className="form-control" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            required 
                        />
                    </div>

                    <div className="input-group mb-3">
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Passwort"
                            required 
                        />
                    </div>

                    <Row>
                        <Col xs="6" className="text-right">
                            <Button variant="secondary">
                                <Link to="/login" className="link text-decoration-none">Zurück zum Login</Link>
                            </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                            <Button type="submit" variant="primary">Registrieren</Button>
                        </Col>
                    </Row>
                </form>
            </div>
        </div>
    );
}
