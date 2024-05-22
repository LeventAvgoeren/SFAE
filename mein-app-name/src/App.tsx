import React, { ReactNode, useEffect, useState } from "react";
import "./App.css";
import { Navigate, Route, Router, Routes , useNavigate} from "react-router-dom";
import { PageIndex } from "./components/PageIndex";
import { PageLogin } from "./components/PageLogin";
import  PageRegistrationWorker  from "./components/worker/PageRegistrationWorker";
import { PageWorkerIndex } from "./components/worker/PageWorkerIndex";
import { PageWorkerOrderOverview } from "./components/worker/PageWorkerOrderOverview";
import { PageWorkerFinances } from "./components/worker/PageWorkerFinances";
import { PageWorkerProfile } from "./components/worker/PageWorkerProfile";
import { PageWorkerPreferences } from "./components/worker/PageWorkerPreferences";
import { PageWorkerOrders } from "./components/worker/PageWorkerOrders";
import { PagePasswordReset } from "./components/PagePasswordReset";
import { MainMenu } from "./components/MainMenu";
import { LoginContext, LoginInfo } from "./components/LoginManager";
import { checkLoginStatus, login } from "./backend/api";


import { PageWorkerFAQ } from "./components/worker/PageWorkerFAQ";
import PageOrderRating from "./components/Order/PageOrderRating";
import PageOrderRequest from "./components/Order/PageOrderRequest";
import { PageOrderCompleted } from "./components/Order/PageOrderCompleted";
import { PageCustomerFAQ } from "./components/customer/PageCustomerFAQ";
import { PageIndexCustomer } from "./components/customer/PageIndexCustomer";
import { PageUebersicht } from "./components/customer/PageUebersicht";
import { PageOrderOverview } from "./components/Order/PageOrderOverview";
import PageRegistration from "./components/customer/PageRegistration";
import PageRegistrationAdmin from "./components/admin/PageRegistrationAdmin";
import { PageIndexAdmin } from "./components/admin/PageIndexAdmin";
import { PageAdminDienstleistungen } from "./components/admin/PageAdminDienstleistungen";
import { PageDeclineJob } from "./components/worker/PageDeclineJob";
import { PageRequestPasswordReset } from "./components/PageRequestPasswordReset";
import PageError from "./components/Error";
import { PageProfil } from "./components/customer/PageProfil";



function App() {
  const [loginInfo, setLoginInfo] = useState<LoginInfo | false | undefined>(undefined);
  const [email, setEmail] = useState(""); // Fügen Sie Zustände für E-Mail und Passwort hinzu
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function fetchLoginStatus() {
    try{
      const loginStatus = await checkLoginStatus();

        if (loginStatus) {
          setLoginInfo(loginStatus);
        } 
    } catch (e){
      console.log(e)
    }  
  }

  async function checkAndRedirect() {
    try {
      const loginStatus = await checkLoginStatus();

      if (loginStatus) {
        
        if (loginStatus.userId) {
          if (loginStatus.userId.startsWith("C")) {
            navigate(`/customer/${loginStatus.userId}`);
          } else {
            navigate(`/worker/${loginStatus.userId}`);
          }}
      } else {
      }
    } catch (error) {
      console.error("Error fetching login status:", error);
    }
  }



  useEffect(() => {
    fetchLoginStatus();
  }, []); 




  return (

    <><LoginContext.Provider value={{ loginInfo, setLoginInfo }}>

      <Routes>
        {/* Gemeinsame Routen */}
        {!loginInfo && <>
          <Route path="/" element={<PageIndex />} />
          <Route path="/login" element={<PageLogin />} />
          <Route path="/registration/customer" element={<PageRegistration />} />
          <Route path="/registration/worker" element={<PageRegistrationWorker />}/>
          <Route path="/passwordreset" element={<PageRequestPasswordReset/>}/>
          <Route path="/mainmenu" element={<MainMenu/>}/> 
          <Route path="/newPassword" element={<PagePasswordReset/>}/>
         
          </>
        }

              {loginInfo ? (<>
              {/* Customer */}
              <Route path="/customer/:customerId" element={<PageIndexCustomer />} />
              <Route path="/customer/:customerId/faq" element={<PageCustomerFAQ />} />
              <Route path="/customer/:customerId/uebersicht" element={<PageUebersicht />} />
              <Route path="/customer/:customerId/profil" element={<PageProfil />} />
              {/* Order */}
              <Route path="/customer/:customerId/order/new"element={<PageOrderRequest/>}/>
              <Route path="/customer/:customerId/order/:orderId" element={<PageOrderOverview />} />
              <Route path="/customer/:customerId/orders/:order/completed"element={<PageOrderCompleted />}/>
              <Route path="/customer/:customerId/orders/:order/rating"element={<PageOrderRating />}/>

              {/* Worker */}
              <Route path="/worker/:workerId" element={<PageWorkerIndex/>} />
              <Route path="/worker/:workerId/orders/overview"element={<PageWorkerOrderOverview />}/>
              <Route path="/worker/:workerId/finances"element={<PageWorkerFinances />}/>
              <Route path="/worker/:workerId/profile"element={<PageWorkerProfile />}/>
              <Route path="/worker/:workerId/preferences"element={<PageWorkerPreferences />}/>
              <Route path="/worker/:workerId/faq" element={<PageWorkerFAQ />} />
              <Route path="/worker/:workerId/orders" element={<PageWorkerOrders />} />
              {/*Contract*/}
              </>
             ):(<>
              {/* <Route path="*" element={<Navigate to="/NotAuth" replace />} />
              <Route path="/NotAuth" element={<PageError error={401}/>} /> */}
             </>
             )} 

              <Route path="/contract" element={<PageDeclineJob />} />

              {/* <Route path="*" element={<Navigate to="/NotFound" replace />} /> */}
              {/* <Route path="/NotFound" element={<PageError error={404}/>} /> */}

      </Routes>
      </LoginContext.Provider>
    </>
  );
}

export default App;
