import { Link, useNavigate, useParams } from 'react-router-dom';
import { checkLoginStatus,deleteCookie } from '../../backend/api';
import { useEffect, useState } from 'react';
import { LoginInfo } from '../LoginManager';

export function NavbarWComponent() {
  const [loginInfo, setLoginInfo] = useState<LoginInfo | false | undefined>(undefined);
  const { workerId } = useParams<{ workerId?: string }>();


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
          <Link to={`/chat/${loginInfo.userId}`} className="notification-icon">
            <img src="/icons8-notification-100.png" alt="Benachrichtigungen"/>
          </Link>
        )}
          </nav>
      </>
  );
}


export default NavbarWComponent;