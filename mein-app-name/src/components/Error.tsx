import { Alert } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "react-bootstrap";
import {useEffect } from "react";
import { LoginInfo } from "./LoginManager";
import { deleteCookie } from "../backend/api";
import "./Error.css"
import { Typewriter } from 'react-simple-typewriter'

interface PageErrorProps {
    error: number;
}

enum ErrorCode {
    NotFound = 404,
    Forbidden = 403,
    Unauthorized = 401,
    BadRequest = 400,
    Gone = 410
}

interface ErrorMessage {
    [key: number]: string;
}



export function BackToSite(){

    async function setLog() {
       await deleteCookie()
    }

   
    return(<>
    <p className="textMessage2">Sie wurden abgemeldet. Bitte Erneut anmelden.</p>
    <LinkContainer to={"/"} >
         <Button className="buttonContainer" onClick={() => { setLog()}}> Zurück auf die Hauptseite </Button>
         </LinkContainer>
    </> )
}

export default function PageError({ error }: PageErrorProps){


    const errorMessages: ErrorMessage = {
        [ErrorCode.NotFound]: "Seite wurde nicht gefunden (404)",
        [ErrorCode.Forbidden]: "Keine Berechtigung (403)",
        [ErrorCode.Unauthorized]: "Nicht Autorisiert (401)",
        [ErrorCode.BadRequest]: "Anfrage war fehlerhaft (400)",
        [ErrorCode.Gone]: "Auftrag abegelaufen(410)"
      };

    return (
            <div className="Container">
                	<img src="https://images.plurk.com/5pHVCIyRNMdudWmVrrtQ.png" alt=""></img>
                    <div className="textMessage">
                        <Typewriter words={[`${errorMessages[error]}`]}  loop={0}  cursor   cursorStyle='/'  cursorColor="red" typeSpeed={200}    deleteSpeed={150}   delaySpeed={1000}/> 
                    </div>
                   
                    <BackToSite />
            </div>
    );
 
}