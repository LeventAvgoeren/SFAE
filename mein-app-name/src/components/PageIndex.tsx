import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PageIndex.css';

type Role = 'customer' | 'worker';

export function PageIndex() {
  const [role, setRole] = useState<Role | ''>(''); // Initial leer, keine Rolle ausgewählt
  const navigate = useNavigate();

  // Funktion zum Verarbeiten der Rollenauswahl
  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole); // Setze die gewählte Rolle
    navigate(`/registration/${selectedRole}`); // Navigiere zur entsprechenden Registrierungsseite
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="role-background">
      <div className="welcome-container">
        <h2 className="choose-role-text">Wähle zwischen eine der beiden Rollen!</h2>
      </div>
      <div className="role-selection">
        <div className={`role-image left-image ${role === 'worker' ? 'selected' : ''}`} onClick={() => handleRoleSelect('worker')}>
          <span className="role-title worker-title">Worker</span>
        </div>
        <div className={`role-image right-image ${role === 'customer' ? 'selected' : ''}`} onClick={() => handleRoleSelect('customer')}>
          <span className="role-title customer-title">Customer</span>
        </div>
      </div>
      <div className="login-button-container">
        <Button variant="outline-light" onClick={navigateToLogin} className="anmelden-button">
          Falls du bereits ein Konto hast, kannst du dich hier anmelden.
        </Button>
      </div>
    </div>
  );
}