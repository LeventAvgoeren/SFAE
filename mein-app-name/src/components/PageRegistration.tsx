import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DesignVorlage.css';
import { Button, Col, Row } from 'react-bootstrap';
import './PageRegistration.css';
import { Link } from 'react-router-dom';

export function PageRegistration() {

    return (
        <div className="background">
            <div className="container-frame">

            <div style={{ height: '300px' }}></div>
            <img src={'/SFAE_Logo.png'} alt="SFAE Logo" className="img-fluid" />
            <h1 className="text-center">Registrieren</h1>
            <form className="w-50 mx-auto">
            <div style={{ height: '20px' }}></div>

            <div className="input-group mb-3">

                
    </div>


<Row className="mb-3">
  <Col>
    <div className="d-flex flex-row">
      <input 
      type="text" 
      className="form-control me-2" 
      id="inputName1" 
      placeholder="Vorname"
      required/>

      <input type="text" 
      className="form-control" 
      id="inputName2" 
      placeholder="Nachname"
      required/>
    </div>
  </Col>
</Row>

<div className="input-group mb-3">
  <input type="text" 
  className="form-control" 
  id="inputAddress1" 
  placeholder="Addresse"
  required 
  />
</div>

<div className="input-group mb-3">
  <input type="email" 
  className="form-control" 
  id="emailInput" 
  placeholder="name@example.com"
  required
  />
</div>

<div className="input-group mb-3">
  <input type="password" 
  className="form-control" 
  id="password" 
  placeholder="Password"
  required />
</div>

{/* 
<div className="input-group mb-3">
  <select className="form-select" id="inputGroupSelect02">
    <option selected>Choose...</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
  <label className="input-group-text" htmlFor="inputGroupSelect02">Options</label>
</div> */}


{/* anmelden abbrechen button */}
  <Row>
                      <Col xs="6" className="text-right">
                        <Button>                     
                      <Link to="/login" className="link text-decoration-none ">Abbrechen</Link>
                      </Button> 
                      </Col>
                      <Col xs="6" className="text-right">
                      <button type="submit" className="btn btn-primary">Registrieren</button>
                        {/* <Button color="link" className="link text-decoration-none">Registrieren</Button> */}
                      </Col>
                    </Row>
                    </form>
            </div>

        </div>
    );
}
