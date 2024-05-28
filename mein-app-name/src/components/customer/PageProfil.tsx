import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CustomerResource } from '../../Resources';
import { deleteCustomer, getCustomerImage, getCustomerbyID, updateCustomer } from '../../backend/api';
import "./PageProfil.css";
import { MDBTypography } from 'mdb-react-ui-kit';
import { LinkContainer } from 'react-router-bootstrap';
import NavbarComponent from '../navbar/NavbarComponent';

export function PageProfil() {
    const params = useParams();
    const customerId = params.customerId!;
    const navigate = useNavigate();

    const [customer, setCustomer] = useState<CustomerResource>();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState(password);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
    const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.value == null){
            setPassword(password)
        } else{
             setPassword(event.target.value);
        }
    };

    async function handleUpdateCustomer(){
        const updateData:CustomerResource={
          name:name,
          password: password,
          email:email,
          role:"CUSTOMER",
          id:customerId
        }
        if(password.trim()!==""){
          updateData.password=password
        }
        try{
          await updateCustomer(updateData);
          if (newProfileImage) {
            await uploadProfileImage(customerId, newProfileImage);
          }
        }
        catch(error){
          console.log("Fehler:"+error)
        }
      }

    const handleDeleteCustomer = async () => {
        try {
            await deleteCustomer(customerId);
            console.log("Konto erfolgreich gelöscht.");
            navigate('/');
        } catch (error) {
            console.error('Fehler beim Löschen des Kontos:', error);
        }
    };

    useEffect(() => {
        async function getCustomer() {
            try {
                let customer = await getCustomerbyID(customerId);
                setName(customer.name);
                setPassword(customer.password);
                setEmail(customer.email);
                setCustomer(customer);
                fetchCustomerImage(customerId);
            } catch (error) {
                console.log('Fehler:' + error);
            }
        }
        getCustomer();
    }, [customerId]);

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setNewProfileImage(file);
          
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };

    const fetchCustomerImage = async (id: string) => {
        try {
            const base64Image = await getCustomerImage(id);
            setProfileImage(`data:image/jpeg;base64,${base64Image}`);
        } catch (error) {
            console.error("Fehler beim Laden des Profilbildes:", error);
        }
    };

    const uploadProfileImage = async (id: string, image: File) => {
        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await fetch(`/customer/${id}/image`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Profilbild erfolgreich aktualisiert");
                fetchCustomerImage(id); // Fetch updated profile image
            } else {
                console.error("Fehler beim Hochladen des Profilbildes");
            }
        } catch (error) {
            console.error("Fehler beim Hochladen des Profilbildes:", error);
        }
    };

    return (
        <>
            <NavbarComponent />
            <div className='Backg'>
            <div className="custom-container2">                             
            <h1>PROFILE</h1>
            <div className="mt-5 Back">
                <div className="row">
                    <div className="container col-lg-4 pb-5">
                        {/* Account Sidebar */}
                            <div className="author-card-profile">
                                {previewImage || profileImage ? (
                                    <img src={previewImage || profileImage} alt="Profilbild" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                                ) : (
                                    <div className="placeholder bg-secondary d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px', borderRadius: '50%', color: 'white' }}>
                                        <span>Kein Bild</span>
                                    </div>
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

                    {/* Profile Settings */}
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

                            <form onSubmit={handleUpdateCustomer} className='col-md-6' style={{ width: "200%"}}>
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="account-pass">New Password</label>
                                        <input className="form-control"
                                            type="password"
                                            id="account-pass"
                                            onChange={handleNewPasswordChange} />
                                    </div>
                                </div>
                                <div>
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
                            </form>

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
