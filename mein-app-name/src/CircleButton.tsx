import { useNavigate } from "react-router-dom";

import './CircleButton.css'; 

export function CircleButton (){
  const navigate = useNavigate();
return(

  <div className="circle-button" onClick={() => navigate('/chatBot')}>
  💬
</div>
)
}