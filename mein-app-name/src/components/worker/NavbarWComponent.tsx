import { Link, useNavigate, useParams } from 'react-router-dom';
import { checkLoginStatus,deleteCookie } from '../../backend/api';
import { useEffect, useState } from 'react';
import { LoginInfo } from '../LoginManager';
import ChatComponent from '../ChatComponent';

export function NavbarWComponent() {
  const [loginInfo, setLoginInfo] = useState<LoginInfo | false | undefined>(undefined);
  const { workerId } = useParams<{ workerId?: string }>();

  const [showChat, setShowChat] = useState(false);
  async function doLogout() {
      await deleteCookie();
      window.location.href = "/login";
  }

  async function fetchLoginStatus() {
      try {
          const loginStatus = await checkLoginStatus();
          console.log(loginStatus);
          if (loginStatus) {
              setLoginInfo(loginStatus);
          }
      } catch (e) {
          console.log(e);
      }
  }

  const toggleChat = () => {
    setShowChat(!showChat);
  }

  useEffect(() => {
      fetchLoginStatus();
  }, []);

  return (
      <>
          <nav className="page-background">
              <div className="navbar-left">
                  <img src="/Sfae_Logo.png" alt="Logo" style={{height: 80, width:80}}/>
              </div>
              <ul>

                      <li><a  href={ `/worker/${workerId} `} >Home</a></li>
                      <li><a href={ `/worker/${workerId}/profile `}>Profil</a></li>
                      <li><a href={ `/worker/${workerId}/preferences `}>Präferenzen</a></li>
                      <li><a href={ `/worker/${workerId}/faq `}>FAQ</a></li>
                      <li><a href={ `/worker/${workerId}/orders/overview `}>Overview</a></li>


                  <li><a href="#" onClick={doLogout}>Logout</a></li>
              </ul>
              {loginInfo && (
                 <div className="notification-icon" onClick={toggleChat}>
                    <img src="/icons8-notification-100.png" alt="Benachrichtigungen"/>
                  </div>
        )}
          </nav>

          <div className={`chat-container ${showChat ? 'show' : ''}`}>
              <ChatComponent onClose={toggleChat} />
          </div>
      </>
  );
}


export default NavbarWComponent;