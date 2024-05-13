import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './NavbarComponent.css';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';
import { checkLoginStatus } from '../backend/api';
import { useEffect, useState } from 'react';
import { LoginInfo } from './LoginManager';

export function NavbarComponent() {
  
    const [loginInfo, setLoginInfo] = useState<LoginInfo | false | undefined>(undefined);
  
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
        <>
        <nav className="page-background">
             <div className="navbar-left">
                <img src="/Sfae_Logo.png" alt="Logo" className="navbar-logo" />
            </div>
        <ul>
        {loginInfo && (
            <LinkContainer to={`/customer/${loginInfo.userId}`}>
            <li><a href="/">Home</a></li>
            </LinkContainer>
        )}
            {loginInfo && ( // Überprüfe, ob loginInfo gesetzt ist
                <LinkContainer to={`/customer/${loginInfo.userId}/profil`}>
                    <li><a href={`/customer/${loginInfo.userId}/profil`}>Profil</a></li>
                </LinkContainer>
            )}

            <LinkContainer to={"/profil"}>
            <li><a href="/settings">Einstellungen</a></li>
            </LinkContainer>
        </ul>
        </nav>
        </>
    );
}

export default NavbarComponent;
