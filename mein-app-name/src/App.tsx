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
import { PageProfil } from "./components/customer/PageProfil";
import { PageUebersicht } from "./components/customer/PageUebersicht";
import { PageOrderOverview } from "./components/Order/PageOrderOverview";
import PageRegistration from "./components/customer/PageRegistration";
import PageRegistrationAdmin from "./components/admin/PageRegistrationAdmin";
import { PageIndexAdmin } from "./components/admin/PageIndexAdmin";
import { PageAdminDienstleistungen } from "./components/admin/PageAdminDienstleistungen";
import { PageDeclineJob } from "./components/worker/PageDeclineJob";
import { PageRequestPasswordReset } from "./components/PageRequestPasswordReset";
import PageError from "./components/Error";
import LoadingIndicator from "./components/LoadingIndicator";



function App() {
  const [loginInfo, setLoginInfo] = useState<LoginInfo | false>();
  const [isLoading, setLoading] = useState(true);

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

  if(isLoading){
    return <LoadingIndicator/>
  }
  return (

    <><LoginContext.Provider value={{ loginInfo, setLoginInfo }}>
        <Routes>
            
                  {/* Gemeinsame Routen */}
                  <Route path="/" element={ loginInfo ? ( loginInfo.userId.startsWith("C") ? 
                        ( <Navigate to={`/customer/${loginInfo.userId}`} replace /> ) :
                         (<Navigate to={`/worker/${loginInfo.userId}`} replace />)) :
                          (<PageIndex />)
                    }
                  />

                  <Route path="/login" element={<PageLogin />} />
                  <Route path="/registration/customer" element={<PageRegistration />} />
                  <Route path="/registration/worker" element={<PageRegistrationWorker />}/>
                  <Route path="/passwordreset" element={<PageRequestPasswordReset/>}/>
                  <Route path="/mainmenu" element={<MainMenu/>}/> 
                  <Route path="/newPassword" element={<PagePasswordReset/>}/>


                  {/* Customer */}
                  <Route path="/customer/:customerId" element={(loginInfo && loginInfo.userId.startsWith("C") )? <PageIndexCustomer />  : < Navigate to="/NotAuth" replace />} />
                  <Route path="/customer/:customerId/faq" element={(loginInfo && loginInfo.userId.startsWith("C") ) ? <PageCustomerFAQ />  : < Navigate to="/NotAuth" replace />} />
                  <Route path="/customer/:customerId/uebersicht" element={(loginInfo && loginInfo.userId.startsWith("C") ) ? <PageUebersicht />  : < Navigate to="/NotAuth" replace />} />
                  <Route path="/customer/:customerId/profil" element={(loginInfo && loginInfo.userId.startsWith("C") ) ? <PageProfil /> : < Navigate to="/NotAuth" replace />} />
                  {/* Order */}
                  <Route path="/customer/:customerId/order/new"element={(loginInfo && loginInfo.userId.startsWith("C") ) ?  <PageOrderRequest/> : < Navigate to="/NotAuth" replace />}/>
                  <Route path="/customer/:customerId/order/:orderId" element={(loginInfo && loginInfo.userId.startsWith("C") ) ? <PageOrderOverview /> : < Navigate to="/NotAuth" replace />} />
                  <Route path="/customer/:customerId/orders/:order/completed"element={(loginInfo && loginInfo.userId.startsWith("C") ) ? <PageOrderCompleted /> : < Navigate to="/NotAuth" replace />}/>
                  <Route path="/customer/:customerId/orders/:order/rating"element={(loginInfo && loginInfo.userId.startsWith("C") ) ? <PageOrderRating /> : < Navigate to="/NotAuth" replace />}/>
             

                
            
                  {/* Worker */}
                  <Route path="/worker/:workerId" element={(loginInfo && loginInfo.userId.startsWith("W") ) ? <PageWorkerIndex/> : < Navigate to="/NotAuth" replace />} />
                  <Route path="/worker/:workerId/orders/overview"element={(loginInfo && loginInfo.userId.startsWith("W") ) ?  <PageWorkerOrderOverview /> : < Navigate to="/NotAuth" replace />}/>
                  <Route path="/worker/:workerId/finances"element={(loginInfo && loginInfo.userId.startsWith("W") ) ? <PageWorkerFinances /> : < Navigate to="/NotAuth" replace />}/>
                  <Route path="/worker/:workerId/profile"element={(loginInfo && loginInfo.userId.startsWith("W") ) ? <PageWorkerProfile />: < Navigate to="/NotAuth" replace />}/>
                  <Route path="/worker/:workerId/preferences"element={(loginInfo && loginInfo.userId.startsWith("W") ) ? <PageWorkerPreferences />: < Navigate to="/NotAuth" replace />}/>
                  <Route path="/worker/:workerId/faq" element={(loginInfo && loginInfo.userId.startsWith("W") ) ? <PageWorkerFAQ />: < Navigate to="/NotAuth" replace />} />
                  <Route path="/worker/:workerId/orders" element={(loginInfo && loginInfo.userId.startsWith("W") ) ? <PageWorkerOrders />: < Navigate to="/NotAuth" replace />} />
             
                     
                
                  <Route path="/NotAuth" element={<PageError error={401}/>} />
                  <Route path="/contract" element={<PageDeclineJob />} />

                  <Route path="*" element={<Navigate to="/NotFound" replace />} />
                  <Route path="/NotFound" element={<PageError error={404}/>} />  
          

        </Routes>
      </LoginContext.Provider>
    </>
  );
}

export default App;
