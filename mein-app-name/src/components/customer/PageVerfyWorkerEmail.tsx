import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail, verifyEmailWorker } from "../../backend/api"

export function PageVerifyWorkerEmail(){
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tokenID = searchParams.get("token");

async function verify() {
  await verifyEmailWorker(tokenID!)
}
  return(
    <>
    <p>HALLLLLLLLLLLLLLOOOOOOOO</p>
    <button onClick={verify}>Bestätigen</button>
    </>
  )
}