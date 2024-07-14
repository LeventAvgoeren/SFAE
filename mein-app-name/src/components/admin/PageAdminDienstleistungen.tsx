import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DesignVorlage.css';
import './PageAdminDienstleistungen.css';
import { Table, Button, Container, Nav, NavDropdown, Navbar, Modal, Form, Badge } from 'react-bootstrap';
import { Trash, Search, Pencil, Modem } from 'react-bootstrap-icons';
import { CustomerResource, SendNews, WorkerResource, WorkerResourceProfil } from '../../Resources';
import { deleteCustomer, deleteWorker, getAllCustomers, getAllWorker, getCustomerImage, getWorkerImage, sendOwnNews, updateCustomer, updateWorker, updateWorkerProfile } from '../../backend/api';
import { LoginInfo } from '../LoginManager';
import NavbarComponent from '../navbar/NavbarComponent';
import { HttpError } from '../Order/HTTPError';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function PageAdminDienstleistungen() {
    const [loginInfo, setLoginInfo] = useState<LoginInfo | false | undefined>(undefined);
    const [showDeleteC, setShowDeleteC] = useState<boolean>(false);
    const [showDeleteW, setShowDeleteW] = useState<boolean>(false);
    const [showSearchC, setshowSearchC] = useState<boolean>(false);
    const [showSearchW, setshowSearchW] = useState<boolean>(false);
    const [customerData, setCustomerData] = useState<CustomerResource[]>([]);
    const [customerFilterData, setCustomerFilterData] = useState<CustomerResource[]>([]);
    const [workerData, setWorkerData] = useState<WorkerResource[]>([]);
    const [workerFilterData, setWorkerFilterData] = useState<WorkerResource[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerResource | null>();
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
    const [text, setText] = useState("");
    const [titel, setTitel] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [showNewsModal, setShowNewsModal] = useState(false);


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
        setIsAdmin(cus.role === "ADMIN")
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
            let resp = await updateCustomer(updatedCustomer);
            if (resp) {
                toast.success("Customer wurde erfolgreich aktualisiert");
                updateCustomerInCache(updatedCustomer);
                updateLocalStorage(customerData, workerData);
                handleClose();
            }
        } catch (error) {
            toast.error("Es ist ein Fehler aufgetreten");
            console.error('Fehler beim Aktualisieren des Kunden:', error);
        }
    }

    const handleUpdateWorker = async (updatedWorker: WorkerResourceProfil) => {
        try {
            let resp = await updateWorkerProfile(updatedWorker);
            if (resp) {
                toast.success("Worker wurde erfolgreich aktualisiert");
                updateWorkerInCache(updatedWorker);
                updateLocalStorage(customerData, workerData);
                handleClose();
            }
        } catch (error) {
            toast.error("Es ist ein Fehler aufgetreten");
            console.error('Fehler beim Aktualisieren des Workers:', error);
        }
    }

    const handleSave = async () => {
        let pic = await getCustomerImage(selectedCustomer!.id!);

        const updatedCustomer: CustomerResource = {
            id: selectedCustomer?.id,
            name: costumerName || selectedCustomer!.name,
            email: costumerEmail || selectedCustomer!.email,
            password: costumerPassword || selectedCustomer!.password,
            profileBase64: pic,
            role: selectedCustomer!.role,
            statusOrder: selectedCustomer!.statusOrder
        };
        handleUpdateCustomer(updatedCustomer);
    };

    const handleSaveWorkerUpdate = async () => {
        let pic = await getWorkerImage(selectedWorker!.id!);
        const updatedWorker: WorkerResourceProfil = {
            id: selectedWorker!.id,
            name: WorkerName || selectedWorker!.name!,
            email: WorkerEmail || selectedWorker?.email!,
            password: WorkerPassword || selectedWorker!.password!,
            location: selectedWorker!.location!,
            profileBase64: pic,
            slogan: selectedWorker!.slogan!,
            latitude: selectedWorker!.latitude,
            longitude: selectedWorker!.longitude,
        };
        handleUpdateWorker(updatedWorker);
    };

    const removeCustomer = async () => {
        if (selectedCustomer?.id) {
            try {
                let res = await deleteCustomer(selectedCustomer.id);
                if (res.ok) {
                    toast.success('Customer wurde erfolgreich gelöscht.');
                    removeCustomerFromCache(selectedCustomer.id);
                    updateLocalStorage(customerData, workerData);
                    setSelectedCustomer(null);
                }
            } catch (error) {
                handleDeleteError(error);
            } finally {
                setShowDeleteC(false);
            }
        }
    };

    const removeWorker = async () => {
        if (selectedWorker?.id) {
            try {
                let res = await deleteWorker(selectedWorker.id);
                if (res.ok) {
                    toast.success('Worker wurde erfolgreich gelöscht.');
                    removeWorkerFromCache(selectedWorker.id);
                    updateLocalStorage(customerData, workerData);
                    setSelectedWorker(null);
                }
            } catch (error) {
                handleDeleteError(error);
            } finally {
                setShowDeleteW(false);
            }
        }
    };

    const handleDeleteError = async (error: any) => {
        if (error instanceof HttpError) {
            const status = error.response.status;
            const errorMessage = await error.response.text();
            console.log("Status:", status);
            console.log("Error Message:", errorMessage);
            handleErrorMessages(status, errorMessage);
        } else {
            console.error('Fehler beim Löschen:', error);
            toast.error('Fehler beim Löschen.');
        }
    };

    const handleErrorMessages = (status: number, errorMessage: string) => {
        if (status === 409 && errorMessage.includes("You have open contracts")) {
            toast.error('Es gibt noch offene Verträge.');
        } else if (status === 400 && errorMessage.includes("ID is not for Worker")) {
            toast.error('ID ist keine gültige Worker-ID.');
        } else if (status === 404) {
            toast.error('ID konnte nicht gefunden werden.');
        } else if (status === 500) {
            toast.error('Serverfehler.');
        } else {
            toast.error('Fehler beim Löschen.');
        }
    };

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
        if (customerButtonClicked) {
            const newCustomers = customerData.filter(element => {
                if (!value) {
                    return true;
                } else {
                    return element.name.toLowerCase().startsWith(value.toLowerCase());
                }
            })
            setCustomerFilterData(newCustomers);
        } else {
            const newWorkers = workerData.filter(element => {
                if (!value) {
                    return true;
                } else {
                    return element.name.toLowerCase().startsWith(value.toLowerCase());
                }
            })
            setWorkerFilterData(newWorkers);
        }
    }

    const changeAdmin = () => {
        setIsAdmin(!isAdmin);
        if (selectedCustomer) {
            setSelectedCustomer(prevCustomer => ({
                ...prevCustomer!,
                role: isAdmin ? 'USER' : 'ADMIN'
            }));
        }
    }

    const fetchData = useCallback(async () => {
        try {
            const storedCustomers = localStorage.getItem('customerData');
            const storedWorkers = localStorage.getItem('workerData');
            if (storedCustomers && storedWorkers) {
                setCustomerData(JSON.parse(storedCustomers));
                setCustomerFilterData(JSON.parse(storedCustomers));
                setWorkerData(JSON.parse(storedWorkers));
                setWorkerFilterData(JSON.parse(storedWorkers));
            } else {
                const [customerData, workerData] = await Promise.all([getAllCustomers(), getAllWorker()]);
                setCustomerData(customerData);
                setCustomerFilterData(customerData);
                setWorkerData(workerData);
                setWorkerFilterData(workerData);
                updateLocalStorage(customerData, workerData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timeoutId);

    }, []);

    const updateLocalStorage = (customerData: CustomerResource[], workerData: WorkerResource[]) => {
        localStorage.setItem('customerData', JSON.stringify(customerData));
        localStorage.setItem('workerData', JSON.stringify(workerData));
    };

    const updateCustomerInCache = (updatedCustomer: CustomerResource) => {
        setCustomerData(prevData => {
            const newData = prevData.map(customer => customer.id === updatedCustomer.id ? updatedCustomer : customer);
            updateLocalStorage(newData, workerData);
            return newData;
        });
        setCustomerFilterData(prevData => prevData.map(customer => customer.id === updatedCustomer.id ? updatedCustomer : customer));
    }

    const updateWorkerInCache = (updatedWorker: WorkerResourceProfil) => {
        setWorkerData(prevData => {
            const newData = prevData.map(worker => worker.id === updatedWorker.id ? ({
                ...worker,
                name: updatedWorker.name,
                email: updatedWorker.email,
                password: updatedWorker.password,
                location: updatedWorker.location,
                profileBase64: updatedWorker.profileBase64,
                slogan: updatedWorker.slogan,
                latitude: updatedWorker.latitude,
                longitude: updatedWorker.longitude,
            }) : worker);
            updateLocalStorage(customerData, newData);
            return newData;
        });
        setWorkerFilterData(prevData => prevData.map(worker => worker.id === updatedWorker.id ? ({
            ...worker,
            name: updatedWorker.name,
            email: updatedWorker.email,
            password: updatedWorker.password,
            location: updatedWorker.location,
            profileBase64: updatedWorker.profileBase64,
            slogan: updatedWorker.slogan,
            latitude: updatedWorker.latitude,
            longitude: updatedWorker.longitude,
        }) : worker));
    }

    const removeCustomerFromCache = (customerId: string) => {
        setCustomerData(prevData => {
            const newData = prevData.filter(customer => customer.id !== customerId);
            updateLocalStorage(newData, workerData);
            return newData;
        });
        setCustomerFilterData(prevData => prevData.filter(customer => customer.id !== customerId));
    }

    const removeWorkerFromCache = (workerId: string) => {
        setWorkerData(prevData => {
            const newData = prevData.filter(worker => worker.id !== workerId);
            updateLocalStorage(customerData, newData);
            return newData;
        });
        setWorkerFilterData(prevData => prevData.filter(worker => worker.id !== workerId));
    }

    const clearLocalStorage = () => {
        localStorage.removeItem('customerData');
        localStorage.removeItem('workerData');
        localStorage.removeItem('workers');
        localStorage.removeItem('customers');
        fetchData();
        window.location.reload()
    };
    const sendNews = () => {
        setShowNewsModal(true);
    }
    const closeNewsModal = () => {
        setShowNewsModal(false);
    }
    const handleSendNews = async () => {
        const send: SendNews = {
            titel: titel,
            text: text
        };

        try {
            await sendOwnNews(send);
            toast.success("Emails wurden erfolgreich gesendet");
        } catch (error) {
            toast.error("Email konnte nicht gesendet werden");
        }
        
        setShowNewsModal(false);
    }
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className='background-image-Diesntleistungen'>
                <NavbarComponent />
                <div className="background-city">
                    <div className="container-frame glassmorphism" style={{ display: "flex", flexDirection: "column", flexWrap: "nowrap", position: "relative" }}>
                        <div className="grid-container margin-container" style={{ display: "flex", flexDirection: "row", position: "relative" }}>
                            <Container className='search-field'>
                                <input
                                    type='text'
                                    className='form-control glassmorphism'
                                    placeholder='Suchen'
                                    onChange={e => changeSearch(e.target.value)}
                                />
                            </Container>
                            <>
                            <Button style={{ backgroundColor: '#007bff', color: 'white' }} onClick={handleWorkerClick}>Workers</Button>
                            <Button style={{ backgroundColor: '#004085', color: 'white' }} onClick={handleCustomerClick}>Customers</Button>
                            <Button style={{ backgroundColor: '#28a745', color: 'white',borderColor: '#28a745', borderStyle: 'solid' }} onClick={sendNews}>Send news</Button>


                                <Button variant="danger" onClick={clearLocalStorage} style={{ width: '500px' }}>
    <img src="/reload.png" alt="Reload" style={{ width: 20, height: 20 }} />
</Button>
                            </>
                        </div>
                        <div className="table-container">
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
                </div>
                {selectedCustomer && (
                    <Modal show={showDeleteC} onHide={closeDeleteCustomerDialog} centered>
                        <Modal.Header className="custom-modal-header">
                            <Modal.Title>Delete Customer</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="custom-modal-body">
                            Möchten Sie wirklich {selectedCustomer?.name} löschen?
                        </Modal.Body>
                        <Modal.Footer className="custom-modal-footer">
                            <Button variant='secondary' onClick={closeDeleteCustomerDialog}>Close</Button>
                            <Button className="custom-modal-button" onClick={removeCustomer}>Delete</Button>
                        </Modal.Footer>
                    </Modal>
                )}
                {selectedWorker && (
                    <Modal show={showDeleteW} onHide={closeDeleteWorkerDialog} centered>
                        <Modal.Header className="custom-modal-header">
                            <Modal.Title>Delete Worker</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="custom-modal-body">
                            Möchten Sie wirklich {selectedWorker?.name} löschen?
                        </Modal.Body>
                        <Modal.Footer className="custom-modal-footer">
                            <Button variant='secondary' onClick={closeDeleteWorkerDialog}>Close</Button>
                            <Button className="custom-modal-button" onClick={removeWorker}>Delete</Button>
                        </Modal.Footer>
                    </Modal>
                )}
                {selectedCustomer && (
                    <Modal show={showSearchC} onHide={closeSearchDialog} centered>
                        <Modal.Header className="custom-modal-header">
                            <Modal.Title>{selectedCustomer.name} Daten</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="custom-modal-body">
                            <Container>
                                <p><strong>Id:</strong> {selectedCustomer.id}</p>
                                <p><strong>Name:</strong> {selectedCustomer.name}</p>
                                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                                <p><strong>Role:</strong> {selectedCustomer.role}</p>
                            </Container>
                        </Modal.Body>
                        <Modal.Footer className="custom-modal-footer">
                            <Button variant='secondary' onClick={closeSearchDialog}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                )}
                {selectedWorker && (
                    <Modal show={showSearchW} onHide={closeSearchWorkerDialog} centered>
                        <Modal.Header className="custom-modal-header">
                            <Modal.Title>{selectedWorker.name} Daten</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="custom-modal-body">
                            <Container>
                                <p><strong>Id:</strong> {selectedWorker.id}</p>
                                <p><strong>Name:</strong> {selectedWorker.name}</p>
                                <p><strong>Email:</strong> {selectedWorker.email}</p>
                                <p><strong>Location:</strong> {selectedWorker.location}</p>
                            </Container>
                        </Modal.Body>
                        <Modal.Footer className="custom-modal-footer">
                            <Button variant='secondary' onClick={closeSearchWorkerDialog}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                )}
                {selectedCustomer && (
                    <Modal show={showDialog} onHide={handleClose} centered>
                        <Modal.Header className="custom-modal-header">
                            <Modal.Title>{selectedCustomer.name} Daten</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="custom-modal-body">
                            <Form>
                                <Form.Group>
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control type="text" defaultValue={selectedCustomer.name} onChange={e => setCostumerName(e.target.value)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control type="email" defaultValue={selectedCustomer.email} onChange={(e) => setCostumerEmail(e.target.value)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control type="password" defaultValue={selectedCustomer.password} onChange={e => setCostumerPassword(e.target.value)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Admin: <Form.Check type="checkbox" checked={isAdmin} onChange={e => changeAdmin()} /></Form.Label>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className="custom-modal-footer">
                            <Button variant='secondary' onClick={handleSave}>Speichern</Button>
                            <Button variant='secondary' onClick={handleClose}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                )}
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

                <Modal show={showNewsModal} onHide={closeNewsModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Send News</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Title:</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    onChange={(e) => setText(e.target.value)} 
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Content:</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3} 
                                    onChange={(e) => setTitel(e.target.value)} 
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeNewsModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSendNews}>
                            Send
                        </Button>
                    </Modal.Footer>
                </Modal>

                
            </div>
        </>
    );
}
