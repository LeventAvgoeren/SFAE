import React, { ReactNode, useEffect, useRef, useState } from "react";
import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { PageIndex } from "./components/PageIndex";
import { PageLogin } from "./components/PageLogin";
import PageRegistrationWorker from "./components/worker/PageRegistrationWorker";
import { PageWorkerIndex } from "./components/worker/PageWorkerIndex";
import { PageWorkerOrderOverview } from "./components/worker/PageWorkerOrderOverview";
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

import { Box, Fab, IconButton, Modal, Toolbar, Typography } from "@mui/material";
import { PageVerifyEmail } from "./components/customer/PageVerifyEmail";
import { PageVerifyWorkerEmail } from "./components/customer/PageVerfyWorkerEmail";
import { PageWorkerOrder } from "./components/worker/PageWorkerOrder";
import { CircleButton } from "./CircleButton";
import PageFinishContract from "./components/worker/PageFinishContract";
import { PageChatBot } from "./components/PageChatBot";

function App() {
  const [loginInfo, setLoginInfo] = useState<LoginInfo | false>();
  const [isLoading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const location = useLocation(); 
  const chatBodyRef = useRef<HTMLDivElement>(null);


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

  useEffect(() => {
    if (showChat && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [showChat]);


  if (isLoading) {
    return <LoadingIndicator />
  }

  const isPageIntroduction = location.pathname === '/';

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
                  <Route path="/admin/:adminId/dienstleistungen" element={(loginInfo && loginInfo.admin === "ADMIN")  ?<PageAdminDienstleistungen /> :< Navigate to="/NotAuth" replace />} />
                  <Route path="/login" element={<PageLogin />} />
                  <Route path="/registration/customer" element={<PageRegistration />} />
                  <Route path="/registration/worker" element={<PageRegistrationWorker />}/>
                  <Route path="/passwordreset" element={<PageRequestPasswordReset/>}/>
                  <Route path="/newPassword" element={<PagePasswordReset/>}/>
                  <Route path="/chatBot" element={ <PageChatBot/>}/>


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
          <Route path="/worker/:workerId/orders" element={(loginInfo && loginInfo.userId.startsWith("W")) ? <PageWorkerOrders /> : < Navigate to="/NotAuth" replace />} />
          <Route path="/worker/:workerId/finishcontract" element={(loginInfo && loginInfo.userId.startsWith("W")) ? <PageFinishContract /> : <Navigate to="/NotAuth" replace />} />




          <Route path="/contract" element={<PageDeclineJob />} />
          <Route path="/verifyEmail" element={<PageVerifyEmail />} />
          <Route path="/verifyEmailWorker" element={<PageVerifyWorkerEmail />} />
          <Route path="*" element={<Navigate to="/NotFound" replace />} />
          <Route path="/NotFound" element={<PageError error={404} />} />
          <Route path="/imprint" element={<ImprintPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
         </Routes>

      </LoginContext.Provider>

      {!isPageIntroduction && (
          <>
      <Fab
        color="primary"
        className="chat-button"
        aria-label="chat"
        style={{ position: "fixed", bottom: 30, right: 3, backgroundColor:"#021128", width:"8vh", height:"8vh"}}
        onClick={() => setShowChat(!showChat)}
      >
        <img src="/chatbot-icon.png" alt="chatbot" style={{ width: '6vh', height: '6vh' }} />
      </Fab>
      
      {showChat && (
        <div className="chat-popup">
          <div className="chat-header">
            <IconButton onClick={() => setShowChat(false)} style={{ color: 'white' }}>
              <img src="/close-button.png" alt="close-button" style={{width:"3vh", height:"3vh"}} />
            </IconButton>
            ChatBot
          </div>
          <div className="chat-body" ref={chatBodyRef}>
            <PageChatBot />
          </div>
        </div>
      )}
       </>
      )}
    
      
    </>
  );
}

export default App;