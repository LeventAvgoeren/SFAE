import React, { ReactNode, useEffect, useState } from "react";
import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// Komponentenimporte
import { PageIndex } from "./components/PageIndex";
import { PageLogin } from "./components/PageLogin";
import PageRegistrationWorker from "./components/worker/PageRegistrationWorker";
import { PageWorkerIndex } from "./components/worker/PageWorkerIndex";
import { PageWorkerOrderOverview } from "./components/worker/PageWorkerOrderOverview";
import { PageWorkerFinances } from "./components/worker/PageWorkerFinances";
import { PageWorkerProfile } from "./components/worker/PageWorkerProfile";
import { PageWorkerPreferences } from "./components/worker/PageWorkerPreferences";
import { PageWorkerOrders } from "./components/worker/PageWorkerOrders";
import { PagePasswordReset } from "./components/PagePasswordReset";
import { LoginContext, LoginInfo } from "./components/LoginManager";
import { checkLoginStatus } from "./backend/api";
import PageOrderRating from "./components/Order/PageOrderRating";
import PageOrderRequest from "./components/Order/PageOrderRequest";
import { PageOrderCompleted } from "./components/Order/PageOrderCompleted";
import { PageCustomerFAQ } from "./components/customer/PageCustomerFAQ";
import { PageIndexCustomer } from "./components/customer/PageIndexCustomer";
import { PageProfil } from "./components/customer/PageProfil";
import { PageUebersicht } from "./components/customer/PageUebersicht";
import { PageOrderOverview } from "./components/Order/PageOrderOverview";
import PageRegistration from "./components/customer/PageRegistration";
import { PageDeclineJob } from "./components/worker/PageDeclineJob";
import { PageRequestPasswordReset } from "./components/PageRequestPasswordReset";
import PageError from "./components/Error";
import LoadingIndicator from "./components/LoadingIndicator";
import { PageIntroduction } from "./components/PageIntroduction";
import { PageIndexAdmin } from "./components/admin/PageIndexAdmin";
import { PageAdminDienstleistungen } from "./components/admin/PageAdminDienstleistungen";
import { PageWorkerFAQ } from "./components/worker/PageWorkerFAQ";
import PageAGB from "./components/PageAGB";
import ChatComponent from "./components/ChatComponent";
import { ImprintPage } from "./components/ImprintPage";
import { TermsAndConditions } from "./components/TermsAndConditions";

import { Toolbar, Typography } from "@mui/material";
import { PageVerifyEmail } from "./components/customer/PageVerifyEmail";
import { PageVerifyWorkerEmail } from "./components/customer/PageVerfyWorkerEmail";





function App() {
  const [loginInfo, setLoginInfo] = useState<LoginInfo | false>();
  const [isLoading, setLoading] = useState(true);
  const location = useLocation(); 


  async function fetchLoginStatus() {
    try {
      const loginStatus = await checkLoginStatus();
      console.log("CHECK " + loginStatus)
      if (loginStatus) {
        setLoginInfo(loginStatus);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLoginStatus();
  }, []);


  if (isLoading) {
    return <LoadingIndicator />
  }
  return (

    <>
      <LoginContext.Provider value={{ loginInfo, setLoginInfo }}>

        <Routes>
        
                  {/* Gemeinsame Routen */}
                  <Route path="/agb" element={<PageAGB />} />
                  <Route path ="/" element={<PageIntroduction/>}/>
                  <Route path="/index" element={ loginInfo ? ( loginInfo.userId.startsWith("C") ? 
                        ( <Navigate to={`/customer/${loginInfo.userId}`} replace /> ) :
                         (<Navigate to={`/worker/${loginInfo.userId}`} replace />)) :
                          (<PageIndex />)
                    }
                  />
                  <Route path="/admin/:adminId" element={<PageIndexAdmin />} />
                  <Route path="/admin/:adminId/dienstleistungen" element={<PageAdminDienstleistungen />} />
                  <Route path="/login" element={<PageLogin />} />
                  <Route path="/registration/customer" element={<PageRegistration />} />
                  <Route path="/registration/worker" element={<PageRegistrationWorker />}/>
                  <Route path="/passwordreset" element={<PageRequestPasswordReset/>}/>
                  <Route path="/newPassword" element={<PagePasswordReset/>}/>


          {/* Customer */}
          <Route path="/customer/:customerId" element={(loginInfo && loginInfo.userId.startsWith("C")) ? <PageIndexCustomer /> : < Navigate to="/NotAuth" replace />} />
          <Route path="/customer/:customerId/faq" element={(loginInfo && loginInfo.userId.startsWith("C")) ? <PageCustomerFAQ /> : /* <Navigate to="/NotAuth" replace /> */ null} />
          <Route path="/customer/:customerId/uebersicht" element={(loginInfo && loginInfo.userId.startsWith("C")) ? <PageUebersicht /> : < Navigate to="/NotAuth" replace />} />
          <Route path="/customer/:customerId/profil" element={(loginInfo && loginInfo.userId.startsWith("C")) ? <PageProfil /> : < Navigate to="/NotAuth" replace />} />
          {/* Order */}
          <Route path="/customer/:customerId/order/new" element={(loginInfo && loginInfo.userId.startsWith("C")) ? <PageOrderRequest /> : < Navigate to="/NotAuth" replace />} />
          <Route path="/customer/:customerId/order/:orderId" element={(loginInfo && loginInfo.userId.startsWith("C")) ? <PageOrderOverview /> : < Navigate to="/NotAuth" replace />} />
          <Route path="/customer/:customerId/orders/:orderId/completed" element={(loginInfo && loginInfo.userId.startsWith("C")) ? <PageOrderCompleted /> : < Navigate to="/NotAuth" replace />} />
          <Route path="/customer/:customerId/orders/:orderId/rating" element={(loginInfo && loginInfo.userId.startsWith("C")) ? <PageOrderRating /> : < Navigate to="/NotAuth" replace />} />
          {/* Chat Route */}
       



          {/* Worker */}
          <Route path="/worker/:workerId" element={(loginInfo && loginInfo.userId.startsWith("W")) ? <PageWorkerIndex /> : < Navigate to="/NotAuth" replace />} />
          <Route path="/worker/:workerId/orders/overview" element={(loginInfo && loginInfo.userId.startsWith("W")) ? <PageWorkerOrderOverview /> : < Navigate to="/NotAuth" replace />} />
          <Route path="/worker/:workerId/profile" element={(loginInfo && loginInfo.userId.startsWith("W")) ? <PageWorkerProfile /> : < Navigate to="/NotAuth" replace />} />
          <Route path="/worker/:workerId/preferences" element={(loginInfo && loginInfo.userId.startsWith("W")) ? <PageWorkerPreferences /> : < Navigate to="/NotAuth" replace />} />
          <Route path="/worker/:workerId/faq" element={(loginInfo && loginInfo.userId.startsWith("W")) ? <PageWorkerFAQ /> : < Navigate to="/NotAuth" replace />} />
          <Route path="/worker/:workerId/orders" element={(loginInfo && loginInfo.userId.startsWith("W")) ? <PageWorkerOrder /> : < Navigate to="/NotAuth" replace />} />



          <Route path="/NotAuth" element={<PageError error={401} />} />
          <Route path="/contract" element={<PageDeclineJob />} />
          <Route path="/verifyEmail" element={<PageVerifyEmail />} />
          <Route path="/verifyEmailWorker" element={<PageVerifyWorkerEmail />} />
          <Route path="*" element={<Navigate to="/NotFound" replace />} />
          <Route path="/NotFound" element={<PageError error={404} />} />
          <Route path="/imprint" element={<ImprintPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
         </Routes>

      </LoginContext.Provider>
      <footer style={{ bottom:0, backgroundColor: "#001325", position: "fixed",textAlign: 'center',  width:"100%",height:"3.3vh"}}>
            <Typography variant="body1" style={{ color: 'white', flex: 1,fontSize:"15px" }}>
              © 2024 SFAE von Ahmad Sfarjalani, Eray Zor, Levent Avgören, Duc Dai Nguyen, Danyal Mahrous. Alle Rechte vorbehalten.
              <a href="/imprint" style={{ textDecoration: 'underline', color: 'white', marginLeft: '10px' }}>Impressum</a>
              <span style={{ margin: "10px" }}>|</span>
                <a href="/agb" style={{ textDecoration: 'underline', color: 'white', marginLeft: '10px' }}>Allgemeine Geschäftsbedingungen</a>
              </Typography>
          </footer>
      
    </>
  );
}

export default App; 