import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DesignVorlage.css';
import { Link } from 'react-router-dom';
import {getCustomerByName} from "../backend/api";
export function PageLogin() {


    useEffect(() => {
        const fetchData = async () => {
            try {
                await getCustomerName("Max");
            } catch (error) {
                console.error("Fehler beim Laden des Kunden:", error);
            }
        };

        fetchData();
    }, []);

    async function getCustomerName(name :String) {

        try {

            
        await getCustomerByName("Max")
        console.log("Kunde gefunden:");
        } catch(e){
            console.error("Fehler beim Laden des Kunden:");
        }
    }
    return (
        <div className="background">
            <div className="container-frame">
            <img src={'/SFAE_Logo.png'} alt="SFAE Logo" className="img-fluid" />

                <h1>Anmelden</h1>
                <form className="w-50 mx-auto">
                    <div className="mb-3">
                        <label htmlFor="emailInput" className="form-label">E-Mail Adresse</label>
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
                    <button type="submit" className="btn btn-primary" onClick={() => getCustomerByName("Max")}>Anmelden</button>
                    <p>
                        Du hast noch kein Konto? 
                        <Link to="/registration" className="link">Hier gehts zur Registrierung</Link>
                    </p>                
                    </form>
            </div>
        </div>
    );
}
