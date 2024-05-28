import React, { useState, useEffect } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBIcon,
} from 'mdb-react-ui-kit';
import './PageOrderCompleted.css';
import { Link, useParams } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavbarComponent from '../navbar/NavbarComponent';
import LoadingIndicator from '../LoadingIndicator';

export function PageOrderCompleted() {
  const { orderId } = useParams();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const { customerId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    isLoading ? <LoadingIndicator /> :
    <>
      <div className="background-image-completed">
          <NavbarComponent />
        <div className="centered-container">
          <MDBCard className="card-completed">
            <MDBCardHeader>
              <h3>Bestellung abgeschlossen</h3>
            </MDBCardHeader>
            <MDBCardBody>
              <p>Vielen Dank fÃ¼r Ihre Bestellung. Ihre Bestellnummer ist <strong>{orderId}</strong>.</p>
              <p>Sie haben am <strong>{new Date().toLocaleDateString()}</strong> ihren Auftrag beendet.</p>
              <h5>Bewertung abgeben:</h5>
              <div className="rating">
                {[...Array(5)].map((star, index) => {
                  index += 1;
                  return (
                    <button
                    type="button"
                    key={index}
                    style={{ color: index <= (hover || rating) ? 'gold' : 'grey' }} // Direkte Inline-Style Zuweisung
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <MDBIcon fas icon="star" size="2x" />
                  </button>
                  );
                })}
              </div>
              <form>
                <div className="form-group">
                  <label htmlFor="comments">Kommentare:</label>
                  <textarea id="comments" className="form-control" rows={3}></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Bewertung absenden</button>
              </form>
            </MDBCardBody>
            <MDBCardFooter>
              <div className="d-flex justify-content-between">
                <Link to={`/customer/${customerId}`} className="btn btn-secondary">Zur Startseite</Link>
                <Link to="/orders" className="btn btn-secondary">Bestellverlauf</Link>
              </div>
            </MDBCardFooter>
          </MDBCard>
        </div>
      </div>
    </>
  );
}