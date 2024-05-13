import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button, Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { Left } from 'react-bootstrap/lib/Media';
import { Link, useParams } from 'react-router-dom';
import { getCustomerbyID } from '../../backend/api';

function PageOrderRating() {
  const [rating, setRating] = useState<number>(0);
  const params = useParams();
  const worId = params.workerId;

  const handleRatingClick = (newRating: number) => {
    setRating(newRating);
  };

  const getFeedback = (rating: number) => {
    if (rating === 1) return 'Schlecht';
    if (rating === 2) return 'Unzufrieden';
    if (rating === 3) return 'Ok';
    if (rating === 4) return 'Gut';
    if (rating === 5) return 'Perfekt';
    return '';
  };


  return (


    <>


      <div className="container-frame">

        <h2 style={{ color: 'white' }}>Vielen dank für deine Bezahlung.</h2>
        <img
          src="/Working_man.png"
          alt="working_man"
          className='Left-Picture'
          height="250"
          style={{ float: 'left', borderRadius: '50%' }} />

        <div className='question' style={{ color: 'white' }}> Hinterlasse bitte noch eine Bewertung für S.Müller.</div>
        <div style={{ color: 'white' }}>
          {[1, 2, 3, 4, 5].map((index) => (
            <span
              key={index}
              onClick={() => handleRatingClick(index)}
              style={{
                cursor: 'pointer',
                color: index <= rating ? 'gold' : 'grey',
                fontSize: '80px', // Ändere hier die Größe der Sterne
              }}
            >
              &#9733;
            </span>
          ))}

        </div>
        {/* <p style={{color: "white"}}>{getFeedback(rating)}</p> */}
        <Row>
          <Col xs={6}>
            <Link to={`/customer/${worId}`} style={{ textDecoration: 'none', color: 'black', marginRight: '10px' }}>
              <Button style={{backgroundColor:"green"}}>Bewerten</Button>
            </Link>
          </Col>
          <Col xs={6}>
            <Link to={`/customer/${worId}`} style={{ textDecoration: 'none', color: 'black' }}>
              <Button style={{backgroundColor:"#B71C1C"}}>Schließen</Button>
            </Link>
          </Col>
        </Row>
      </div>

    </>
  )
}


export default PageOrderRating;