import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { CustomerResource } from "../../Resources"
import { checkLoginStatus, deleteCookie, deleteCustomer, getCustomerbyID, updateCustomer } from "../../backend/api"
import { Button, Modal } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { LoginInfo } from "../LoginManager"
import NavbarComponent from "../navbar/NavbarComponent"


export function PageCustomerProfil(){

  const params=useParams()
  let customerId=params.customerId!

  
  
  const[customer,setCustomer]=useState<CustomerResource>();
  const[name,setName]=useState("");
  const[password,setPassword]=useState("");
  const[email,setEmail]=useState("");
  const[login,setLogin]=useState<LoginInfo | false | undefined>(undefined);

  const[status,setStatus]=useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
 


  

async function upCustomer(){
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
    await updateCustomer(updateData)
  }
  catch(error){
    console.log("Fehler:"+error)
  }
}

async function deleten(){
  setStatus(true)
  try{
      await deleteCustomer(customerId)
      await deleteCookie()
      window.location.href = "/";
    }
  catch(error){
    console.log(error)
  }
  
}

  useEffect(()=>{

    async function getCustomer() {
      try{
        let customer=await getCustomerbyID(customerId)
        setName(customer.name)
        setPassword(customer.password)
        setEmail(customer.email)
        setCustomer(customer)
      }
      catch(error){
        console.log("Fehler:"+error)
      }
    }
    getCustomer()
  },[])
  return (
    <>
      <NavbarComponent />
      <div className="background-image">
        <form onSubmit={upCustomer}>
          <div className="mb-3">
            <label htmlFor="exampleInputName" className="form-label">Name</label>
            <input type="text" className="form-control" id="exampleInputName" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        <button type="button" className="btn btn-danger" onClick={handleShow}>
          Delete Your Account
        </button>
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete your account? This action cannot be undone.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="danger" onClick={deleten}>Delete Account</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
export{}