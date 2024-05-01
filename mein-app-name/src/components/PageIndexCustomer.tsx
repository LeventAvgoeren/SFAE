import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './PageIndexCustomer.css';


export function PageIndexCustomer() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Nav>
          <NavDropdown title={<img src={"/logo192.png"} height="35" alt="Dropdown Logo" />} id="collapsible_nav_dropdown">
            <NavDropdown.Item 
            href="#profil">
            <img
              src={"/Profil.png"}
              height="35"
              className="d-inline-block align-top"
              alt="SFAE Logo"
              />
            Action
            </NavDropdown.Item>

            <NavDropdown.Item 
            href="#support">
            <img
              src={"/Q&A_Logo.png"}
              height="35"
              className="d-inline-block align-top"
              alt="SFAE Logo"
            />
              Another action
            </NavDropdown.Item>

            <NavDropdown.Item 
            href="#settings">
            <img
              src={"/Einstellung.png"}
              height="35"
              className="d-inline-block align-top"
              alt="SFAE Logo"
            />
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
              alt="SFAE Logo"
            />
          </Nav.Link>

          <Nav.Link href="#support">
            <img
              src={"/Q&A_Logo.png"}
              height="35"
              className="d-inline-block align-top"
              alt="SFAE Logo"
            />
          </Nav.Link>

          <Nav.Link href="#settings">
            <img
              src={"/Einstellung.png"}
              height="35"
              className="d-inline-block align-top"
              alt="SFAE Logo"
            />
          </Nav.Link>

          {/* <Nav.Link href="#features">Finanzen</Nav.Link>
          <Nav.Link href="#pricing">Support</Nav.Link> */}
        </Nav>
        <Nav className="me-auto"></Nav>
        <Navbar.Brand href="/">
          <img
            src={"/SFAE_Logo.png"}
            height="65"
            className="d-inline-block align-top"
            alt="SFAE Logo"
          />
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default PageIndexCustomer;