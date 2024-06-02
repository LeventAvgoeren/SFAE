import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CustomerResource } from "../../Resources";
import { checkLoginStatus, deleteCookie, deleteCustomer, getCustomerbyID, updateCustomer } from "../../backend/api";
import { Button, Modal } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { LoginInfo } from "../LoginManager";
import NavbarComponent from "../navbar/NavbarComponent";
import { MDBProgress, MDBProgressBar } from "mdb-react-ui-kit";

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

export function PageCustomerProfil() {

  const params = useParams();
  let customerId = params.customerId!;
  const [customer, setCustomer] = useState<CustomerResource>();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [login, setLogin] = useState<LoginInfo | false | undefined>(undefined);
  const [status, setStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(getPasswordStrength(newPassword));
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  async function upCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validatePassword(password)) {
      setPasswordError('Das Passwort muss mindestens einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwörter sind nicht identisch.');
      return;
    }

    setPasswordError('');

    const updateData: CustomerResource = {
      name: name,
      password: password,
      email: email,
      role: "CUSTOMER",
      id: customerId,
      profileBase64: ""
    };
    if (password.trim() !== "") {
      updateData.password = password;
    }
    try {
      await updateCustomer(updateData);
    } catch (error) {
      console.log("Fehler:" + error);
    }
  }

  async function deleten() {
    setStatus(true);
    try {
      await deleteCustomer(customerId);
      await deleteCookie();
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function getCustomer() {
      try {
        let customer = await getCustomerbyID(customerId);
        setName(customer.name);
        setPassword(customer.password);
        setEmail(customer.email);
        setCustomer(customer);
      } catch (error) {
        console.log("Fehler:" + error);
      }
    }
    getCustomer();
  }, [customerId]);

  return (
    <>
      <div className="background-image">
        <NavbarComponent />
        <form onSubmit={upCustomer}>
          <div className="mb-3">
            <label htmlFor="exampleInputName" className="form-label">Name</label>
            <input type="text" className="form-control" id="exampleInputName" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">E-Mail Adresse</label>
            <input type="email" className="form-control" id="exampleInputEmail1" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div id="emailHelp" className="form-text">Wir werden Ihre E-Mail-Adresse niemals mit anderen teilen.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Passwort</label>
            <input type="password" className="form-control" id="exampleInputPassword1" onChange={handlePasswordChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Passwort bestätigen</label>
            <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} />
          </div>
          {passwordError && (
            <div style={{ color: 'red' }}>{passwordError}</div>
          )}
          <MDBProgress className='mb-4'>
            <MDBProgressBar width={passwordStrength * 25} valuemin={0} valuemax={100}>
              {passwordStrength * 25}%
            </MDBProgressBar>
          </MDBProgress>
          <button type="submit" className="btn btn-primary">Aktualisieren</button>
        </form>
        <button type="button" className="btn btn-danger" onClick={handleShow}>
          Account löschen
        </button>
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Account löschen</Modal.Title>
          </Modal.Header>
          <Modal.Body>Sind Sie sicher, dass Sie Ihren Account löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Schließen</Button>
            <Button variant="danger" onClick={deleten}>Account löschen</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
