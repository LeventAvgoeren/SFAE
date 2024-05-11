import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import { createMemoryHistory } from "history";
import { PageIndex } from "./components/PageIndex";
import { PageLogin } from "./components/PageLogin";
import PageRegistration from './components/PageRegistration';
import  PageRegistrationWorker  from "./components/worker/PageRegistrationWorker";
import { PageWorkerIndex } from "./components/worker/PageWorkerIndex";
import PageOrderRequest from "./components/Order/PageOrderRequest";
import PageOrderOverview  from "./components/Order/PageOrderOverview";
import { PageOrderCompleted } from "./components/Order/PageOrderCompleted";
import { PageOrderRating } from "./components/Order/PageOrderRating";
import { PageWorkerOrderOverview } from "./components/worker/PageWorkerOrderOverview";
import { PageWorkerFinances } from "./components/worker/PageWorkerFinances";
import { PageWorkerProfile } from "./components/worker/PageWorkerProfile";
import { PageWorkerPreferences } from "./components/worker/PageWorkerPreferences";
import { PageWorkerOrders } from "./components/worker/PageWorkerOrders";
import { PagePasswordReset } from "./components/PagePasswordReset";
import { LoginInfo } from "./components/LoginManager";
import { login } from "./backend/api";
import { PageIndexCustomer } from "./components/PageIndexCustomer";
import { MainMenu } from "./components/MainMenu";
import PageWorkerFAQ from "./components/worker/PageWorkerFAQ";
import { PageCustomerFAQ } from "./components/PageCustomerFAQ";
import PageRegistrationAdmin from "./components/PageRegistrationAdmin";
import { PageIndexAdmin } from "./components/PageIndexAdmin";
import { PageAdminDienstleistungen } from "./components/PageAdminDienstleistungen";


const history = createMemoryHistory();

function App() {
  const [loginInfo, setLoginInfo] = useState<LoginInfo | false | undefined>(undefined);
  const [email, setEmail] = useState(""); // Fügen Sie Zustände für E-Mail und Passwort hinzu
  const [password, setPassword] = useState("");


  useEffect(() => {
    // Dieser Code wird nicht ausgeführt, da er falsch ist
    // const loginFromServer = await login();
    // setLoginInfo(loginFromServer);
  }, []);



  return (
    
    <>
      <Routes>
        {/* Gemeinsame Routen */}
        <Route path="/" element={<PageIndex />} />
        <Route path="/login" element={<PageLogin />} />
        <Route path="/registration/customer" element={<PageRegistration />} />
        <Route path="/registration/worker" element={<PageRegistrationWorker />}/>
        <Route path="/registration/admin" element={<PageRegistrationAdmin />} />
        <Route path="/passwordreset" element={<PagePasswordReset/>}/>
        <Route path="/mainmenu" element={<MainMenu/>}/>
        {/* Customer */}
        <Route path="/customer/:customerId" element={<PageIndexCustomer />} />
        <Route path="/customer/:customerId/faq" element={<PageCustomerFAQ />} />
        {/* Order */}
        <Route path="/customer/:customerId/order/new"element={<PageOrderRequest/>}/>
        <Route path="/customer/:customerId/order/:order/overview"element={<PageOrderOverview/>}/>
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

      </Routes>
    </>
  );
}

export default App;
