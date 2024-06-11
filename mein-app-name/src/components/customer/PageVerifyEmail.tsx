import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "../../backend/api"

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
    <p>HALLLLLLLLLLLLLLOOOOOOOO</p>
    <button onClick={verify}>Bestätigen</button>
    </>
  )
}