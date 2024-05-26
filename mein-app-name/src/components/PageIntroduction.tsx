import React, { useState } from 'react';
import './PageIntroduction.css';

export function PageIntroduction() {
  const [page, setPage] = useState(1);

  const nextPage = () => {
    setPage(2);
  };

  return (
    <div className="welcome-container">
        <h1 className="welcome-title">Welcome to SfÆ</h1>
        <button className="arrow-button" onClick={nextPage}>➡️</button>
      {page === 2 && (
        <div className="welcome-content">
          <h1 className="welcome-title">Die dritte Info</h1>
        </div>
      )}
    </div>
  );
}

export default PageIntroduction;
