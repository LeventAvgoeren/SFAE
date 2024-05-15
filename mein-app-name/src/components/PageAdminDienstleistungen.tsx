import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import für Navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import './DesignVorlage.css';
import './PageAdminDienstleistungen.css';
import { Link } from 'react-router-dom';
import { login } from "../backend/api";
import { Table, Button, Container, Nav, NavDropdown, Navbar, Modal } from 'react-bootstrap';
// import { Trash, Search, Pencil, Modem } from 'react-bootstrap-icons';
import { LoginInfo } from './LoginManager';
import { CustomerResource } from "../Resources";
import { getAllCustomers, deleteCustomer, updateCustomer } from "../backend/api";


export function PageAdminDienstleistungen() {
    const [loginInfo, setLoginInfo] = useState<LoginInfo | false | undefined>(undefined);
    const [showDeleteC, setShowDeleteC] = useState<boolean>(false);
    const [showEditC, setShowEditC] = useState<boolean>(false);
    const [customertData, setCustomerData] = useState<CustomerResource[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerResource | null>(null);

    const selectDeleteCustomer = (cus: CustomerResource) => {
        setSelectedCustomer(cus);
        setShowDeleteC(true);
    }

    const selectEditCustomer = (cus: CustomerResource) => {
        setSelectedCustomer(cus);
        setShowEditC(true);
    }

    const removeCustomer = () => {
        if(selectedCustomer?.id){
            try{
                deleteCustomer(selectedCustomer.id)
                setSelectedCustomer(null);
            } catch{
                console.log("error")
            }
        }
        setShowDeleteC(false);
    }

    const editCustomer = () => {
        if(selectedCustomer?.id){
            try{
                updateCustomer(selectedCustomer)
                setSelectedCustomer(null);
            } catch{
                console.log("error")
            }
        }
        setShowEditC(false);
    }

    const closeDeleteConstomerDialog = () => {
        setShowDeleteC(false);
    }

    const closeEditConstomerDialog = () => {
        setShowEditC(false);
    }

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
                                    {/* <td><Trash size={24} color='red' onClick={() => selectDeleteCustomer(customer)} /></td>
                                    <td><Search size={24} color='green'/></td>
                                    <td><Pencil size={24} color='orange' onClick={() => selectEditCustomer(customer)}/></td> */}
                                </tr>
                            })
                        }
                        </tbody>
                    </Table>
                </div>
            </div>
            {selectedCustomer && <Modal show={showDeleteC}>
                <Modal.Header>
                    <Modal.Title>Delete Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Möchten sie wirklich {selectedCustomer?.name} löschen?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeDeleteConstomerDialog}>Close</Button>
                    <Button variant='primary' onClick={removeCustomer}>Delete</Button>
                </Modal.Footer>
            </Modal>}
            {selectedCustomer && <Modal show={showEditC}>
                <Modal.Header>
                    <Modal.Title>Customer Bearbeiten</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeEditConstomerDialog}>Close</Button>
                    <Button variant='primary'>Bearbeiten</Button>
                </Modal.Footer>
            </Modal>}
        </>
    );
}
