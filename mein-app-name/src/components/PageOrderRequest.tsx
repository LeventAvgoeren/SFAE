import React, { useState } from 'react';

interface PageOrderRequestProps {
  onSubmit: (data: { address: string; service: string; description: string; budget: number; range: number; verified: boolean }) => void;
}

export const PageOrderRequest: React.FC<PageOrderRequestProps> = ({ onSubmit }) => {
  const [address, setAddress] = useState('');
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(10000);
  const [range, setRange] = useState(1);
  const [verified, setVerified] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ address, service, description, budget, range, verified });
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'blue', color: 'white', padding: '20px' }}>
      <div>
        <label htmlFor="address">Ihre Adresse</label>
        <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Straße..." />
      </div>
      <div>
        <label>Dienstleistung</label>
        <select value={service} onChange={(e) => setService(e.target.value)}>
          <option value="Handwerker">Handwerker</option>
          <option value="Babysitter">Babysitter</option>
          <option value="Putzkraft">Putzkraft</option>
          <option value="Gartenarbeit">Gartenarbeit</option>
        </select>
      </div>
      <div>
        <label htmlFor="description">Beschreibung</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Maximales Budget (€)</label>
        <input type="number" value={budget} onChange={(e) => setBudget(parseInt(e.target.value))} />
      </div>
      <div>
        <label>Reichweite (km)</label>
        <input type="number" value={range} onChange={(e) => setRange(parseInt(e.target.value))} />
      </div>
      <div>
        <label>Verifiziert</label>
        <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
      </div>
      <button type="submit">Suchen</button>
    </form>
  );
};

export default PageOrderRequest;
