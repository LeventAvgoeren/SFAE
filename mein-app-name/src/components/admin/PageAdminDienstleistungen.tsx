import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import für Navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import './DesignVorlage.css';
import './PageAdminDienstleistungen.css';
import { Link } from 'react-router-dom';
import { Table, Button, Container, Nav, NavDropdown, Navbar, Modal, Form, Badge } from 'react-bootstrap';
import { Trash, Search, Pencil, Modem } from 'react-bootstrap-icons';
import { CustomerResource, WorkerResource } from '../../Resources';
import { deleteCustomer, deleteWorker, getAllCustomers, getAllWorker, updateCustomer } from '../../backend/api';
import { LoginInfo } from '../LoginManager';
import NavbarComponent from '../navbar/NavbarComponent';

interface PageAdminComponentProps {
    isAdminPage?: boolean;
  }

export function PageAdminDienstleistungen({ isAdminPage }: PageAdminComponentProps) {
    const [loginInfo, setLoginInfo] = useState<LoginInfo | false | undefined>(undefined);
    const [showDeleteC, setShowDeleteC] = useState<boolean>(false);
    const [showDeleteW, setShowDeleteW] = useState<boolean>(false);
    const [showSearchC, setshowSearchC] = useState<boolean>(false);
    const [showSearchW, setshowSearchW] = useState<boolean>(false);
    const [customerData, setCustomerData] = useState<CustomerResource[]>([]);
    const [customerFilterData, setCustomerFilterData] = useState<CustomerResource[]>([]);
    const [workerData, setWorkerData] = useState<WorkerResource[]>([]);
    const [workerFilterData, setWorkerFilterData] = useState<WorkerResource[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerResource | null>(null);
    const [selectedWorker, setSelectedWorker] = useState<WorkerResource | null>(null);
    const [customerButtonClicked, setCustomerButtonClicked] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(true);

    const [costumerName, setCostumerName] = useState("");
    const [costumerEmail, setCostumerEmail] = useState("");
    const [costumerPassword, setCostumerPassword] = useState("");
    const [WorkerName, setWorkerName] = useState("");
    const [WorkerEmail, setWorkerEmail] = useState("");
    const [WorkerPassword, setWorkerPassword] = useState("");


    const navigate = useNavigate();

    const handleCustomerClick = (): void => {
        setCustomerButtonClicked(true);
    }

    const handleWorkerClick = (): void => {
        setCustomerButtonClicked(false);
    }

    const selectDeleteCustomer = (cus: CustomerResource) => {
        setSelectedCustomer(cus);
        setShowDeleteC(true);
    }
    const selectSearchCustomer = (cus: CustomerResource) => {
        setSelectedCustomer(cus);
        setshowSearchC(true);
    }

    const selectEditCustomer = (cus: CustomerResource) => {
        setSelectedCustomer(cus);
        setShowDialog(true);
    }
    const handleClose = () => {
        setShowDialog(false);
        setSelectedCustomer(null);
        setSelectedWorker(null);
    }
    const selectDeleteWorker = (cus: WorkerResource) => {
        setSelectedWorker(cus);
        setShowDeleteW(true);
    }

    const selectEditWorker = (cus: WorkerResource) => {
        setSelectedWorker(cus);
        setShowDialog(true)
    }
    const selectSearchWorker = (cus: WorkerResource) => {
        setSelectedWorker(cus);
        setshowSearchW(true);
    }
    
const handleUpdateCustomer = async (updatedCustomer: CustomerResource) => {
    try {
        await updateCustomer(updatedCustomer);
        handleClose();
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Kunden:', error);
    }
}


const handleSave = () => {
    const updatedCustomer: CustomerResource = {
        ...selectedCustomer!,
        name: costumerName,
        email: costumerEmail,
        password: costumerPassword
    };
    handleUpdateCustomer(updatedCustomer);
};

const handleSaveWorkerUpdate = () => {
    const updatedWorker: any  = {
        ...selectedCustomer!,
        name: WorkerName,
        email: WorkerEmail,
        password: WorkerPassword,
    };
    handleUpdateCustomer(updatedWorker);
};


    const removeCustomer = () => {
        if (selectedCustomer?.id) {
            try {
                deleteCustomer(selectedCustomer.id)
                setSelectedCustomer(null);
            } catch {
                console.log("error")
            }
        }
        setShowDeleteC(false);
    }

    const removeWorker = () => {
        if (selectedWorker?.id) {
            try {
                deleteWorker(selectedWorker.id)
                setSelectedWorker(null);
            } catch {
                console.log("error")
            }
        }
        setShowDeleteW(false);
    }


    const closeDeleteCustomerDialog = () => {
        setShowDeleteC(false);
    }

    const closeSearchDialog = () => {
        setshowSearchC(false);
    }

    const closeDeleteWorkerDialog = () => {
        setShowDeleteW(false);
    }

    const closeSearchWorkerDialog = () => {
        setshowSearchW(false);
    }

    const changeSearch = (value: string) => {

        if (customerButtonClicked){
            const newCustomers = customerData.filter(element => {
                if(!value){
                    return true;
                }else{
                    return element.name.toLowerCase().startsWith(value.toLowerCase());
                }
            })
            setCustomerFilterData(newCustomers)
        }else{
            const newWorkers = workerData.filter(element => {
                if(!value){
                    return true;
                }else{
                    return element.name.toLowerCase().startsWith(value.toLowerCase());
                }
            })
            setWorkerFilterData(newWorkers)
        }
    }
    
    
   
    const fetchData = useCallback(async () => {
        try {
            const [customerData, workerData] = await Promise.all([getAllCustomers(), getAllWorker()]);
            setCustomerData(customerData);
            setCustomerFilterData(customerData);
            setWorkerData(workerData);
            setWorkerFilterData(workerData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 100); 

        return () => clearTimeout(timer); 
    }, []);

    return (
        <>
     
            <div className='background-image-Diesntleistungen'>
                   <NavbarComponent/>
                <div className="background-city">
                    <div className="container-frame glassmorphism">
                        <div className="grid-container margin-container">
                        <Container className='search-field'>
                            <input 
                                type='text' 
                                className='form-control glassmorphism' 
                                placeholder='Suchen'
                                onChange={e => changeSearch(e.target.value)}  
                            />
                        </Container>
                    {(
                        <>
                        <Button onClick={handleWorkerClick}>Workers</Button>
                        <Button onClick={handleCustomerClick}>Customers</Button>
                        </>
                    )}
                    </div>

                        <Table striped hover bordered className="table" data-bs-theme="dark" variant="primary"> 
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
    {customerButtonClicked ? (
        customerFilterData.map((customer, idx) => (
            <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{customer.name}</td>
                <td>{customer.id}</td>
                <td colSpan={1}>
                    <Trash size={24} color='red' onClick={() => selectDeleteCustomer(customer)} />
                </td>
                <td colSpan={1}>
                    <Search size={24} color='green' onClick={() => selectSearchCustomer(customer)} />
                </td>
                <td colSpan={1}>
                    <Pencil size={24} color='orange' onClick={() => selectEditCustomer(customer)} />
                </td>
            </tr>
        ))
    ) : (
        workerFilterData.map((worker, idx) => (
            <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{worker.name}</td>
                <td>{worker.id}</td>
                <td colSpan={1}>
                    <Trash size={24} color='red' onClick={() => selectDeleteWorker(worker)} />
                </td>
                <td colSpan={1}>
                    <Search size={24} color='green' onClick={() => selectSearchWorker(worker)} />
                </td>
                <td colSpan={1}>
                    <Pencil size={24} color='orange' onClick={() => selectEditWorker(worker)} />
                </td>
            </tr>
        ))
    )}
</tbody>


                        </Table> 
                    </div>
                </div>
                {selectedCustomer && <Modal show={showDeleteC}>
                    <Modal.Header style={{ backgroundColor: '#d1e7dd' }}>
                        <Modal.Title>Delete Customer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Möchten sie wirklich {selectedCustomer?.name} löschen?
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: '#d1e7dd' }}>
                        <Button variant='secondary' onClick={closeDeleteCustomerDialog}>Close</Button>
                        <Button variant='primary' onClick={removeCustomer}>Delete</Button>
                    </Modal.Footer >
                </Modal>}
                {selectedWorker && <Modal show={showDeleteW}>
                    <Modal.Header style={{ backgroundColor: '#d1e7dd' }}>
                        <Modal.Title>Delete Worker</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Möchten sie wirklich {selectedWorker?.name} löschen?
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: '#d1e7dd' }}>
                        <Button variant='secondary' onClick={closeDeleteWorkerDialog}>Close</Button>
                        <Button variant='primary' onClick={removeWorker}>Delete</Button>
                    </Modal.Footer>
                </Modal>}

                {selectedCustomer && (
    <Modal show={showSearchC}>
        <Modal.Header style={{ backgroundColor: '#d1e7dd' }}>
            <Modal.Title>{selectedCustomer.name} Daten</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#ffffff' }}>
            <Container>
                <p><strong>Id:</strong> {selectedCustomer.id}</p>
            </Container>
            <Container>
                <p><strong>Name:</strong> {selectedCustomer.name}</p>
            </Container>
            <Container>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
            </Container>
            <Container>
                <p><strong>Role:</strong> {selectedCustomer.role}</p>
            </Container>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#d1e7dd' }}>
            <Button variant='secondary' onClick={closeSearchDialog}>Close</Button>
        </Modal.Footer>
    </Modal>
)}


{selectedWorker && (
    <Modal show={showSearchW}>
        <Modal.Header style={{ backgroundColor: '#d1e7dd' }}>
            <Modal.Title>{selectedWorker.name} Daten</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#ffffff' }}>
            <Container>
                <p><strong>Id:</strong> {selectedWorker.id}</p>
            </Container>
            <Container>
                <p><strong>Name:</strong> {selectedWorker.name}</p>
            </Container>
            <Container>
                <p><strong>Email:</strong> {selectedWorker.email}</p>
            </Container>
            <Container>
                <p><strong>Location:</strong> {selectedWorker.location}</p>
            </Container>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#d1e7dd' }}>
            <Button variant='secondary' onClick={closeSearchWorkerDialog}>Close</Button>
        </Modal.Footer>
    </Modal>
)}
                {selectedCustomer && <Modal show={showDialog}>
                    <Modal.Header style={{ backgroundColor: '#d1e7dd' }}>
                        <Modal.Title>{selectedCustomer.name} Daten</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
    <Form >
<Form.Group>
    <Form.Label>Name:</Form.Label>
    <Form.Control type="text" defaultValue={selectedCustomer.name} onChange={e => setCostumerName(e.target.value)} />
</Form.Group>
<Form.Group>
    <Form.Label>Email:</Form.Label>
    <Form.Control type="email" defaultValue={selectedCustomer.email} onChange={e => setCostumerEmail(e.target.value)} />
</Form.Group>
<Form.Group>
    <Form.Label>Password:</Form.Label>
    <Form.Control type="password" defaultValue={selectedCustomer.password} onChange={e => setCostumerPassword(e.target.value)} />
</Form.Group>
    </Form>
</Modal.Body>
                    <Modal.Footer style={{ backgroundColor: '#d1e7dd' }}>
                        <Button variant='secondary' onClick={handleSave}>Speichern</Button>
                        <Button variant='secondary' onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>}

                {selectedWorker && <Modal show={showDialog}>
                    <Modal.Header style={{ backgroundColor: '#d1e7dd' }}>
                        <Modal.Title>{selectedWorker.name} Daten</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
    <Form>
<Form.Group>
    <Form.Label>Name:</Form.Label>
    <Form.Control type="text" defaultValue={selectedWorker.name} onChange={e => setWorkerName(e.target.value)} />
</Form.Group>
<Form.Group>
    <Form.Label>Email:</Form.Label>
    <Form.Control type="email" defaultValue={selectedWorker.email} onChange={e => setWorkerEmail(e.target.value)} />
</Form.Group>
<Form.Group>
    <Form.Label>Password:</Form.Label>
    <Form.Control type="password" defaultValue={selectedWorker.password} onChange={e => setWorkerPassword(e.target.value)} />
</Form.Group>
    </Form>
</Modal.Body>
                    <Modal.Footer style={{ backgroundColor: '#d1e7dd' }}>
                        <Button variant='secondary' onClick={handleSaveWorkerUpdate}>Speichern</Button>
                        <Button variant='secondary' onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>}
            </div>
        </>
    );
}


