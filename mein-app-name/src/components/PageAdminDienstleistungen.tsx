import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import für Navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import './DesignVorlage.css';
import './PageAdminDienstleistungen.css';
import { Link } from 'react-router-dom';
import { login } from "../backend/api";
import { Table, Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { Trash, Search, Pencil } from 'react-bootstrap-icons';
import { LoginInfo } from './LoginManager';
import { CustomerResource } from "../Resources";
import { getAllCustomers } from "../backend/api";


export function PageAdminDienstleistungen() {
    const [loginInfo, setLoginInfo] = useState<LoginInfo | false | undefined>(undefined);
    const [customertData, setCustomerData] = useState<CustomerResource[]>([]);


  useEffect(() => {
    async function fetchCustomerData() {
      try {
        const data = await getAllCustomers();
        setCustomerData(data);
      } catch (error) {
        console.error("Error fetching customers data:", error);
      }
    }
    fetchCustomerData();
  }, []);


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
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Id</th>
                            <th>Delete</th>
                            <th>Search</th>
                            <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            customertData.map((customer, idx) =>{
                                return <tr key={idx}>
                                    <td>{idx+1}</td>
                                    <td>{customer.name}</td>
                                    <td>{customer.id}</td>
                                    <td><Trash size={24} color='red' /></td>
                                    <td><Search size={24} color='green'/></td>
                                    <td><Pencil size={24} color='orange' /></td>
                                </tr>
                            })
                        }
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    );
}
