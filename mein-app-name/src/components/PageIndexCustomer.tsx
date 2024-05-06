import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import für Navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import './DesignVorlage.css';
import './PageIndexCustomer.css';
import { Link } from 'react-router-dom';
import { login } from "../backend/api";
import { Col, Container, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';

export function PageIndexCustomer() {

    return (

        <>
            <Navbar      variant="dark" expand="lg">
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

                    <h1>Willkommen</h1>

                    <Row className="mb-3">
    <Col className="text-center"> {/* Verwende die text-center Klasse hier */}
        <form className="mx-auto">
            <div className='input-group mb-3'>
                <input
                    type="input"
                    className="form-control search-field"
                    placeholder="Was brauchen sie ?..."
                />
                <button className="btn btn-primary" type="button">Suchen</button>
            </div>
        </form>
    </Col>
</Row>






                </div>
            </div>
        </>
    );
}
