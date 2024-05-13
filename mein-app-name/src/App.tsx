import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Router, Routes , useNavigate} from "react-router-dom";
import { createMemoryHistory } from "history";
import { PageIndex } from "./components/PageIndex";
import { PageLogin } from "./components/PageLogin";
import PageRegistration from './components/PageRegistration';
import  PageRegistrationWorker  from "./components/worker/PageRegistrationWorker";
import { PageWorkerIndex } from "./components/worker/PageWorkerIndex";

import { PageWorkerOrderOverview } from "./components/worker/PageWorkerOrderOverview";
import { PageWorkerFinances } from "./components/worker/PageWorkerFinances";
import { PageWorkerProfile } from "./components/worker/PageWorkerProfile";
import { PageWorkerPreferences } from "./components/worker/PageWorkerPreferences";
import { PageWorkerOrders } from "./components/worker/PageWorkerOrders";
import { PagePasswordReset } from "./components/PagePasswordReset";

import { PageIndexCustomer } from "./components/customer/PageIndexCustomer";
import { PageCustomerFAQ } from "./components/customer/PageCustomerFAQ";


import { PageOrderCompleted } from "./components/customer/PageOrderCompleted";
import { MainMenu } from "./components/MainMenu";

import { LoginContext, LoginInfo } from "./components/LoginManager";
import { checkLoginStatus, login } from "./backend/api";

import PageRegistrationAdmin from "./components/PageRegistrationAdmin";
import { PageIndexAdmin } from "./components/PageIndexAdmin";
import { PageAdminDienstleistungen } from "./components/PageAdminDienstleistungen";
import { PageProfil } from "./components/CustomerProfil";

import NavbarComponent from "./components/NavbarComponent";
import { PageWorkerFAQ } from "./components/worker/PageWorkerFAQ";
import PageOrderRating from "./components/Order/PageOrderRating";
import PageOrderRequest from "./components/Order/PageOrderRequest";
import PageOrderOverview from "./components/Order/PageOrderOverview";
import { PageUebersicht } from "./components/customer/PageUebersicht";



const history = createMemoryHistory();

function App() {
  const [loginInfo, setLoginInfo] = useState<LoginInfo | false | undefined>(undefined);
  const [email, setEmail] = useState(""); // Fügen Sie Zustände für E-Mail und Passwort hinzu
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function fetchLoginStatus() {
    try{
      const loginStatus = await checkLoginStatus();
      console.log(loginStatus)
        if (loginStatus) {
          setLoginInfo(loginStatus);
        } 
    } catch (e){
      console.log(e)
    }  
  }



  useEffect(() => {
    fetchLoginStatus();
  }, []); 




  return (

    <><LoginContext.Provider value={{ loginInfo, setLoginInfo }}>

            
{loginInfo && <NavbarComponent></NavbarComponent>}

      <Routes>
        {/* Gemeinsame Routen */}
        {!loginInfo && <>
        <Route path="/" element={<PageIndex />} />
        <Route path="/login" element={<PageLogin />} />
        <Route path="/registration/customer" element={<PageRegistration />} />
        <Route path="/registration/worker" element={<PageRegistrationWorker />}/>
        <Route path="/passwordreset" element={<PagePasswordReset/>}/>
        <Route path="/mainmenu" element={<MainMenu/>}/>
        </>}
   

        {loginInfo && <>
        <Route path="/registration/admin" element={<PageRegistrationAdmin />} />
        {/* Customer */}
        <Route path="/customer/:customerId" element={<PageIndexCustomer />} />
        <Route path="/customer/:customerId/faq" element={<PageCustomerFAQ />} />
        <Route path="/customer/:customerId/profil" element={<PageProfil />} />
        <Route path="/customer/:customerId/uebersicht" element={<PageUebersicht />} />
        {/* Order */}
        <Route path="/customer/:customerId/order/new"element={<PageOrderRequest/>}/>
        <Route path="/customer/:customerId/order/:order/overview"element={<PageOrderOverview onSubmit={function (data: { address: string; service: string; description: string; budget: number; range: number; verified: boolean; }): void {
            throw new Error("Function not implemented.");
          } }/>}/>
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
         {/* Admin */}
         <Route path="/admin/:adminId" element={<PageIndexAdmin />} />
        <Route path="/admin/:adminId/dienstleistungen" element={<PageAdminDienstleistungen />} />
        </>
        }
      </Routes>
      </LoginContext.Provider>
    </>
  );
}

export default App;
