import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PageIndex.css";

export function PageIndex() {
  const [role, setRole] = useState("customer");
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
    const timer = setTimeout(() => setFade(false), 1000);
    return () => clearTimeout(timer);
  }, [role]);

  // Funktion, die den Registrierungspfad basierend auf der Rolle zurückgibt
  const getRegistrationPath = () => {
    return role === "worker" ? "/registration/worker" : "/registration/customer";
  };

  return (
    <div className={`${role === "customer" ? "background-customer" : "background-worker"} ${fade ? " fade-background" : ""}`}>
      <div className="container-frame">
        <div className="role-selection">
          <button className="btn btn-outline-success me-2" onClick={() => setRole("customer")}>Customer</button>
          <button className="btn btn-outline-success me-2" onClick={() => setRole("worker")}>Worker</button>
        </div>
        <h1>
          Hey, zum ersten Mal hier? Suche dir eine Rolle aus, melde dich am besten an und wir können loslegen!
        </h1>
        <Link to={getRegistrationPath()}>
          <button type="button" className="btn btn-outline-light anmelden-button">Registrieren</button>
        </Link>
        
        <Link to="/login">
          <button type="button" className="btn btn-outline-light anmelden-button">Anmelden</button>
        </Link>
      </div>
    </div>
  );
}
