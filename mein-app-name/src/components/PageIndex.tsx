import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./PageIndex.css";  // Stelle sicher, dass der Pfad korrekt ist

export function PageIndex() {
  const [role, setRole] = useState("customer");

  return (
    <div className={role === "customer" ? "background-customer" : "background-worker"}>
      <div className="container-frame">
        <div className="role-selection">
          <button className="btn btn-outline-success me-2" onClick={() => setRole("customer")}>Customer</button>
          <button className="btn btn-outline-success me-2" onClick={() => setRole("worker")}>Worker</button>
        </div>
        <h1>
          Hey, zum ersten Mal hier? Suche dir eine Rolle aus, melde dich am besten an und wir können loslegen!
        </h1>
        <Link to="/login">
          <button type="button" className="btn btn-outline-light anmelden-button">Anmelden</button>
        </Link>
      </div>
    </div>
  );
}
