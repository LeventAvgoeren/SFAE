import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CustomerResource } from '../../Resources';
import { deleteCustomer, getCustomerImage, getCustomerbyID, updateCustomer } from '../../backend/api';
import "./PageProfil.css";
import { MDBTypography } from 'mdb-react-ui-kit';
import { LinkContainer } from 'react-router-bootstrap';
import NavbarComponent from '../navbar/NavbarComponent';
import LoadingIndicator from '../LoadingIndicator';

export function PageProfil() {
    const params = useParams<{ customerId: string }>();
    const customerId = params.customerId!;
    const navigate = useNavigate();

    const [customer, setCustomer] = useState<CustomerResource | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState(password);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [profileImage, setProfileImage] = useState<string>('');
    const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value == null) {
            setPassword(password)
        } else {
            setPassword(event.target.value);
        }
    };

    const fetchCustomer = async () => {
        if (!customerId) {
            setError("Keine Customer ID in der URL gefunden");
            setLoading(false);
            return;
        }
        try {
            const id = customerId;
            const customerData = await getCustomerbyID(id);
            if (customerData) {
                setName(customerData.name);
                setPassword(customerData.password);
                setEmail(customerData.email);
                setCustomer(customerData);
                fetchCustomerImage(id);
            } else {
                setCustomer(null);
                throw new Error("Keine Daten für diesen Kunden gefunden");
            }
            setLoading(false);
        } catch (error) {
            console.error("Fehler beim Laden der Kundendaten:", error);
            setError("Fehler beim Laden der Daten");
            setLoading(false);
        }
    };

    const fetchCustomerImage = async (id: string) => {
        try {
            const base64Image = await getCustomerImage(id);
            setProfileImage(`data:image/jpeg;base64,${base64Image}`);
            setImageLoading(false); // Bild ist geladen
        } catch (error) {
            console.error("Fehler beim Laden des Profilbildes:", error);
            setImageLoading(false); // Fehler beim Laden des Bildes
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, [customerId]);

    const handleUpdateCustomer = async () => {
        const updatedCustomerData: CustomerResource = {
            id: customerId!,
            name: name,
            email: email,
            password: password,
            role: "CUSTOMER",
            profileBase64: profileImage
        };

        try {
            updatedCustomerData.profileBase64 = updatedCustomerData.profileBase64.slice(23);

            const updatedCustomer = await updateCustomer(updatedCustomerData);
            console.log("Updated Customer:", updatedCustomer);
            alert("Kunde erfolgreich aktualisiert");
        } catch (error) {
            console.error("Fehler beim Aktualisieren des Kunden:", error);
            alert("Fehler beim Aktualisieren des Kunden");
        }
    };

    const handleDeleteCustomer = async () => {
        try {
            await deleteCustomer(customerId!);
            alert('Profil erfolgreich gelöscht.');
            navigate('/');
        } catch (error) {
            console.error('Fehler beim Löschen des Profils:', error);
            alert('Fehler beim Löschen des Profils');
        }
    };

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreviewImage(base64String);
                setProfileImage(base64String);
                setImageLoading(false); // Bild ist geladen
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <div className="loading-screen"><p>Lädt...</p></div>;
    if (error) return <p>Fehler: {error}</p>;

    return (
        isLoading ? <LoadingIndicator /> :
        <>
            <NavbarComponent />
            <div className='Backg'>
                <div className="custom-container2">
                    <h1>PROFILE</h1>
                    <div className="mt-5 Back">
                        <div className="row">
                            <div className="container col-lg-4 pb-5">
                                <div className="author-card-profile">
                                    {imageLoading ? (
                                        <div className="loading-screen">
                                            <p>Lädt...</p>
                                        </div>
                                    ) : (
                                        (previewImage || profileImage) ? (
                                            <img src={previewImage || profileImage} alt="Profilbild" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                                        ) : (
                                            <div className="placeholder bg-secondary d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px', borderRadius: '50%', color: 'white' }}>
                                                <span>Kein Bild</span>
                                            </div>
                                        )
                                    )}
                                    <div className="author-card-details">
                                        <h5 className="author-card-name">{name}</h5>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="profileImage" className="form-label">Profilbild hochladen</label>
                                    <input className="form-control" type="file" id="profileImage" onChange={handleProfileImageChange} />
                                </div>
                            </div>

                            <div className="container col-lg-8 pb-5">
                                <form className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="account-fn">First Name</label>
                                            <input className="form-control" type="text" id="account-fn" value={name} onChange={(e) => setName(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="account-email">E-mail Address</label>
                                            <input className="form-control" type="email" id="account-email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                                        </div>
                                    </div>

                                    <div className="col-md-6"></div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="account-pass">New Password</label>
                                            <input className="form-control"
                                                type="password"
                                                id="account-pass"
                                                onChange={handleNewPasswordChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="account-confirm-pass">Confirm Password</label>
                                            <input className="form-control"
                                                type="password"
                                                id="account-confirm-pass"
                                                value={confirmPassword}
                                            />
                                        </div>
                                        {!passwordsMatch && (
                                            <MDBTypography tag='p' className='text-danger'>
                                                Die Passwörter stimmen nicht überein. Bitte überprüfen Sie Ihre Eingabe.
                                            </MDBTypography>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <hr className="mt-2 mb-3" />
                                        <div className="ButtonsDiv">
                                            <LinkContainer to={`/customer/${customerId}`}>
                                                <Button className="ButtonUpdate" onClick={handleUpdateCustomer}>
                                                    Update Profile
                                                </Button>
                                            </LinkContainer>
                                            <Button type="button" className="btn btn-danger" onClick={handleShow}>
                                                Delete Your Account
                                            </Button>

                                            <Modal show={showModal} onHide={handleClose}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Delete Account</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>Are you sure you want to delete your account? This action cannot be undone.</Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={handleClose}>
                                                        Close
                                                    </Button>
                                                    <Button variant="danger" onClick={handleDeleteCustomer}>
                                                        Delete Account
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PageProfil;
