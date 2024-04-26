import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PageIndex.css";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

export function PageIndex() {
  return (
    <div className="background">
      <div className="container-frame">
        <div style={{ height: '400px' }}></div>
        <h1>
          Hey , zum ersten mal hier? Melde dich am besten an und wir können
          loslegen!
        </h1>
        <Link to="/login">
          <button type="button" className="btn btn-outline-light anmelden-button">Anmelden</button>
        </Link>
       
        <div style={{ height: '400px' }}></div>

      </div>
    </div>
  );
}
