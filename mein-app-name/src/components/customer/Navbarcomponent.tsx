import React, { useState } from 'react';
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';

export function Navbarcomponent(){


    return(
        <>
        <Navbar className="navbar-component" variant="dark" expand="lg">
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
        </>
    )
}
