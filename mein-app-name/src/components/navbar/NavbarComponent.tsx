
import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './NavbarComponent.css';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoginInfo, useLoginContext } from '../LoginManager';
import { checkLoginStatus, deleteCookie } from '../../backend/api';

export function NavbarComponent() {
  const {loginInfo} = useLoginContext();
 
  async function doLogout() {
      await deleteCookie();
      window.location.href = "/login";
  }


  return (
      <>
          <nav className="page-background">
    <img src="/Sfae_Logo.png" alt="Logo" style={{height: 100, width: 100}}/>
              <ul>
                  {loginInfo && (
                      <li><a href={`/customer/${loginInfo.userId}`}>Home</a></li>
                  )}
                  {loginInfo && (
                      <li><a href={`/customer/${loginInfo.userId}/profil`}>Profil</a></li>
                  )}
                  {loginInfo && (
                      <li><a href={`/customer/${loginInfo.userId}/uebersicht`}>Übersicht</a></li>
                  )}
                  {loginInfo && (
                      <li><a href={`/customer/${loginInfo.userId}/faq`}>Faq</a></li>
                  )}
                   {loginInfo && loginInfo.admin ==="ADMIN" && (
                      <li><a href={`/admin/${loginInfo.userId}/dienstleistungen`}>Admin</a></li>
                  )}
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


export default NavbarComponent;