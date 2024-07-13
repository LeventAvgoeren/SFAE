import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Modal, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CustomerResource } from '../../Resources';
import { deleteCookie, deleteCustomer, getCustomerImage, getCustomerbyID, updateCustomer } from '../../backend/api';
import "./PageProfil.css";
import { MDBTypography } from 'mdb-react-ui-kit';
import NavbarComponent from '../navbar/NavbarComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../Footer';


function validatePassword(password: string) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasNumber && hasSpecialChar;
}

function getPasswordStrength(password: string) {
    let strength = 0;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    if (password.length >= 8) strength += 1;
    return strength;
}

export function PageProfil() {
    const params = useParams<{ customerId: string }>();
    const customerId = params.customerId!;
    const navigate = useNavigate();

    const [customer, setCustomer] = useState<CustomerResource | null>(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [profileImage, setProfileImage] = useState<string>('');
    const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);

    const [modalShow, setModalShow] = useState(false);
    const [cancelModalShow, setCancelModalShow] = useState(false);
    const handleSuccessClose = () => setShowSuccessModal(false);

    const toggleShow = () => {
        setModalShow(!modalShow);
      };
    
      const toggleCancelShow = () => {
        setCancelModalShow(!cancelModalShow);
      };

    const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;
        setNewPassword(newPassword);
        setPasswordStrength(getPasswordStrength(newPassword));
        setPasswordsMatch(newPassword === confirmPassword);
    };

    const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
        setPasswordsMatch(event.target.value === newPassword);
    };

    const fetchCustomer = async () => {
        if (!customerId) {
            setError("Keine Customer ID in der URL gefunden");
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
        } catch (error) {
            console.error("Fehler beim Laden der Kundendaten:", error);
            setError("Fehler beim Laden der Daten");
        }
    };

    const fetchCustomerImage = async (id: string) => {
        try {
            const base64Image = await getCustomerImage(id);
            setProfileImage(`data:image/jpeg;base64,${base64Image}`);
            setImageLoading(false);
        } catch (error) {
            console.error("Fehler beim Laden des Profilbildes:", error);
            setImageLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, [customerId]);

    const handleUpdateCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Initialisiere das aktualisierte Kundendaten-Objekt
        const updatedCustomerData: CustomerResource = {
            id: customerId!,
            name: name,
            email: email,
            password: password, // Verwende das bestehende Passwort standardmäßig
            role: "CUSTOMER",
            profileBase64: profileImage,
            statusOrder: customer!.statusOrder
        };

        if (newPassword) { // Wenn ein neues Passwort gesetzt ist, führe die Validierung durch
            if (!validatePassword(newPassword)) {
                setPasswordError('Das Passwort muss mindestens einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.');
                return;
            }

            if (!passwordsMatch) {
                setPasswordError('Passwörter sind nicht identisch.');
                return;
            }

            setPasswordError('');
            updatedCustomerData.password = newPassword; // Setze das neue Passwort, wenn validiert
        }

        try {
            updatedCustomerData.profileBase64 = updatedCustomerData.profileBase64.slice(23);
            const updatedCustomer = await updateCustomer(updatedCustomerData);
            console.log("Updated Customer:", updatedCustomer);
            toast.success("Information wurde erfolgreich aktualisiert");
        } catch (error) {
            console.error("Fehler beim Aktualisieren des Kunden:", error);
            toast.error("Fehler beim Aktualisieren des Kunden");
        }
    };

    const handleDeleteCustomer = async () => {
        try {
            await deleteCookie()
            await deleteCustomer(customerId!);
            toast.success('Profil erfolgreich gelöscht.');
            window.location.href = "/index";
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
                setImageLoading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    if (error) return <p>Fehler: {error}</p>;

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
            <div className='Backg'>
                <NavbarComponent />
                <div className="custom-container2">
                    <h1>PROFIL</h1>
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
                                            <img src={previewImage || profileImage} alt="Profilbild" className="profileImageCustomer"/>
                                        ) : (
                                            <div className="" style={{ width: '150px', height: '150px', borderRadius: '50%', color: 'white' }}>
                                                <span>Kein Bild</span>
                                            </div>
                                        )
                                    )}
                                    <div className="author-card-details">
                                        <h5 className="author-card-name">{name}</h5>
                                    </div>
                                </div>
                                <div className="profile-upload-container">
                                    <label htmlFor="profileImage" className="form-label">Profilbild hochladen</label>
                                    <input className="form-control" type="file" id="profileImage" onChange={handleProfileImageChange} style={{color:'white'}}/>
                                </div>
                            </div>

                            <div className="container col-lg-8 pb-5">
                                <form className="row" onSubmit={handleUpdateCustomer}>
                                    <div className="col-12">
                                        <div className="form-group mb-2">
                                            <label htmlFor="account-fn">Vorname</label>
                                            <input className="form-control" type="text" placeholder='Vorname' id="account-fn" value={name} onChange={(e) => setName(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group Margins mb-2">
                                            <label htmlFor="account-email">E-Mail Adresse</label>
                                            <input className="form-control" type="email" id="account-email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group Margins mb-2">
                                            <label htmlFor="account-pass">Neues Passwort</label>
                                            <input className="form-control"
                                                type="password" placeholder='Passwort'
                                                id="account-pass"
                                                onChange={handleNewPasswordChange} />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group Margins">
                                            <label htmlFor="account-confirm-pass">Passwort bestätigen</label>
                                            <input className="form-control"
                                                type="password" placeholder='Passwort bestätigen'
                                                id="account-confirm-pass"
                                                value={confirmPassword}
                                                onChange={handleConfirmPasswordChange}
                                            />
                                        </div>
                                        {!passwordsMatch && (
                                            <MDBTypography tag='p' className='text-danger'>
                                                Die Passwörter stimmen nicht überein. Bitte überprüfen Sie Ihre Eingabe.
                                            </MDBTypography>
                                        )}
                                        {passwordError && (
                                            <MDBTypography tag='p' className='text-danger'>
                                                {passwordError}
                                            </MDBTypography>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <hr className="mt-2 mb-3" />
                                        <div className="ButtonsDiv">
                                            <Button type="submit" className="ButtonUpdate">
                                                Profil aktualisieren
                                            </Button>
                                            <Button type="button" className="btn btn-danger" onClick={toggleShow}>
                                                Account löschen
                                            </Button>
                                        </div>
                                    </div>
                                </form>        
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`modal fade ${modalShow ? 'show' : ''}`} style={{ display: modalShow ? 'block' : 'none',transition: 'opacity 0.15s linear' }} aria-labelledby="modalTitle" aria-hidden={!modalShow}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Account löschen</h5>
              </div>
              <div className="modal-body">
                <p>Bist du sicher, dass du diesen Account wirklich löschen möchtest?<br /> Alle Daten werden unwiderruflich gelöscht.</p>   
              </div>
              <div className="modal-footer">
                <Row style={{ gap: "12px" }}>
                  <button type="button" className="btn btn-secondary" onClick={toggleShow} style={{ width: "150px" }}>Abbrechen</button>
                  <button type="button" className="btn btn-danger" style={{ width: "150px", gap: "12" }} onClick={handleDeleteCustomer}>Löschen</button>
                </Row>
              </div>
            </div>
          </div>
        </div>
        {modalShow && <div className="modal-backdrop fade show"></div>}
          {cancelModalShow && <div className="modal-backdrop fade show"></div>}
        <Footer></Footer>

            </div>
        </>
    );
}

export default PageProfil;
