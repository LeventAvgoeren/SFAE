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
    <div className="role-background" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="role-selection">
        <div className={`role-image left-image ${role === 'customer' ? 'selected' : ''}`} onClick={() => handleRoleSelect('customer')}></div>
        <div className={`role-image right-image ${role === 'worker' ? 'selected' : ''}`} onClick={() => handleRoleSelect('worker')}></div>
      </div>
      <Card className="container-frame text-center" style={{ width: '600px', backgroundColor: '#2D5277', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.5)', borderRadius: '20px' }}>
        <Card.Header>Willkommen auf SfÆ</Card.Header>
        <Card.Body>
          <h1>Wähle deine Rolle aus und melde dich an!</h1>
        </Card.Body>
        <Card.Footer>Wenn du etwas nicht verstehen solltest oder überfordert bist Drück gerne hier damit ich dir alles erkläre.</Card.Footer>
        <Button variant="outline-light" onClick={navigateToLogin} style={{ marginTop: '20px', fontSize: '16px', padding: '10px 20px' }}>
            Falls du bereits ein Konto hast, kannst du dich hier anmelden.
          </Button>
      </Card>
    </div>
  );
}