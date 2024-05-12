import React, { useState } from 'react';
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { Left } from 'react-bootstrap/lib/Media';

function PageOrderRating() {
  const [rating, setRating] = useState<number>(0);

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
      <Navbar variant="dark" expand="lg">
        <Container>
          <Nav className='mx-auto'>
            <NavDropdown title={<img src={"/SFAE_Logo.png"} height="35" alt="Dropdown Logo" />} id="collapsible_nav_dropdown">
              <NavDropdown.Item
                href="#profil">
                <img
                  src={"/Profil.png"}
                  height="35"
                  className="d-inline-block align-top"
                  alt="SFAE Logo" />
                Action
              </NavDropdown.Item>

              <NavDropdown.Item
                href="#support">
                <img
                  src={"/Q&A_Logo.png"}
                  height="35"
                  className="d-inline-block align-top"
                  alt="SFAE Logo" />
                Another action
              </NavDropdown.Item>

              <NavDropdown.Item
                href="#settings">
                <img
                  src={"/Einstellung.png"}
                  height="35"
                  className="d-inline-block align-top"
                  alt="SFAE Logo" />
                Something
              </NavDropdown.Item>

              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#profile">
              <img
                src={"/Profil.png"}
                height="35"
                className="d-inline-block align-top"
                alt="SFAE Logo" />
            </Nav.Link>

            <Nav.Link href="#support">
              <img
                src={"/Q&A_Logo.png"}
                height="35"
                className="d-inline-block align-top"
                alt="SFAE Logo" />
            </Nav.Link>

            <Nav.Link href="#settings">
              <img
                src={"/Einstellung.png"}
                height="35"
                className="d-inline-block align-top"
                alt="SFAE Logo" />
            </Nav.Link>

            {/* <Nav.Link href="#features">Finanzen</Nav.Link>
    <Nav.Link href="#pricing">Support</Nav.Link> */}
          </Nav>

        </Container>
      </Navbar>

      <div className="background-city">
        <div className="container-frame">
          <Navbar.Brand href="/">
            <img
              src={"/SFAE_Logo.png"}
              className="img-fluid"
              alt="SFAE Logo"
            />
          </Navbar.Brand>


          <h1>Profil</h1>
          <div>Vorname:</div>
          <img 
          src="/Working_man.png" 
          alt="working_man" 
          className='Left-Picture' 
          style={{ float: 'left', marginRight: '50%' , borderRadius: '50%' }} />
          
          <div className='question' style={{color: 'white'}}> Wie fandest du es ?</div>
          <div style={{color: 'white'}}>Bewertung:
            {[1, 2, 3, 4, 5].map((index) => (
              <span
                key={index}
                onClick={() => handleRatingClick(index)}
                style={{
                  cursor: 'pointer',
                  color: index <= rating ? 'gold' : 'grey',
                  fontSize: '30px', // Ändere hier die Größe der Sterne
                }}
              >
                &#9733;
              </span>
            ))}

          </div>
          <p style={{color: "white"}}>{getFeedback(rating)}</p>
          </div>
          </div>

        </>
        )
}


        export default PageOrderRating;