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
        <h1 className="welcome-text">Willkommen bei SfÆ!</h1>
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
<<<<<<< HEAD
=======
      <Card className="container-frame text-center" style={{ width: '600px', backgroundColor: '#2D5277', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.5)', borderRadius: '20px', color: "white" }}>
        <Card.Header>Willkommen auf SfÆ</Card.Header>
        <Card.Body>
          <h1>Wähle deine Rolle aus und melde dich an!</h1>
        </Card.Body>
        <Card.Footer>Wenn du etwas nicht verstehen solltest oder überfordert bist Drück gerne hier damit ich dir alles erkläre.</Card.Footer>
        <Button variant="outline-light" onClick={navigateToLogin} style={{ marginTop: '20px', fontSize: '16px', padding: '10px 20px' }}>
            Falls du bereits ein Konto hast, kannst du dich hier anmelden.
          </Button>
      </Card>
>>>>>>> 60225ece152fb3b46d5c8f2af42c603faa0fa69d
    </div>
  );
}