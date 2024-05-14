import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import für Navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import './DesignVorlage.css';
import './PageAdminDienstleistungen.css';
import { Link } from 'react-router-dom';
import { login } from "../backend/api";
import { Col, Container, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';
import { LoginInfo } from './LoginManager';


export function PageAdminDienstleistungen() {
    const [loginInfo, setLoginInfo] = useState<LoginInfo | false | undefined>(undefined);


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

                        {loginInfo && loginInfo.admin ==="admin" && <Nav.Link href="#settings">
                            <img
                                src={"/clock.png"}
                                height="35"
                                className="d-inline-block align-top"
                                alt="SFAE Logo" />
                        </Nav.Link>}

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

                    {/* Static template */}
                    <table>
                        <th>
                            <td>Name</td>
                            <td>Id</td>
                            <td>Delete</td>
                            <td>Search</td>
                            <td>Edit</td>

                        </th>
                        <tbody>

                        <tr>
                        <td>Person 1</td>
                        <td>1</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        </tr>

                        <tr>
                        <td>Person 2</td>
                        <td>2</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        </tr>
                        </tbody>
                        
                    </table>






                </div>
            </div>
        </>
    );
}
