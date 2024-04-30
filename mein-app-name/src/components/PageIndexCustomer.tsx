import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './PageIndexCustomer.css'; 


export function PageIndexCustomer() {
  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={"/SFAE_Logo.png"}
              height="65"
              className="d-inline-block align-top"
              alt="SFAE Logo"
            />
          </Navbar.Brand>
          <Nav className="me-auto">
            </Nav>

            <Nav>
            <Nav.Link href="#home">Chat</Nav.Link>
            <Nav.Link href="#features">Finanzen</Nav.Link>
            <Nav.Link href="#pricing">Support</Nav.Link>

          <NavDropdown title={<img src={"/logo192.png"} height="35" alt="Dropdown Logo" />} id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>

  );
}

export default PageIndexCustomer;