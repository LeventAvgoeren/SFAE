import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "../../backend/api"
import './PageVerifyEmail.css';

export function PageVerifyEmail(){
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tokenID = searchParams.get("token");

async function verify() {
  await verifyEmail(tokenID!)
  //navigate("/login")
}
  return(
    <>
    
    <div className="confirmation-page-container2">
    <div className="card2">
      <p>Fast geschafft! Klicke auf bestätigen, um fortzufahren.</p>
      <button onClick={verify}>Bestätigen</button>
    </div>
    </div>
    
    </>
  )
}