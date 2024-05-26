import { Alert } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "react-bootstrap";
import {useEffect } from "react";
import { LoginInfo, useLoginContext } from "./LoginManager";
import { deleteCookie } from "../backend/api";
import "./Error.css"
import { Typewriter } from 'react-simple-typewriter'
import { Err404 } from "./Errorpages/404";

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
    const{setLoginInfo} = useLoginContext()
    async function setLog() {
       await deleteCookie();
       setLoginInfo(false);
    }

   
    return(<>
    <p className="textMessage2">Sie wurden abgemeldet. Bitte Erneut anmelden.</p>
        <LinkContainer to="/">
            <Button className="buttonContainer" onClick={() => { setLog()}}> Zurück auf die Hauptseite </Button>
        </LinkContainer>
    </> )
}

export default function PageError({ error }: PageErrorProps){


    const errorMessages: ErrorMessage = {
        [ErrorCode.NotFound]: "404",
        [ErrorCode.Forbidden]: "403",
        [ErrorCode.Unauthorized]: "401",
        [ErrorCode.BadRequest]: "400",
        [ErrorCode.Gone]: "410"
      };

    return (
                	<Err404 code={errorMessages[error]}/>
    );
 
}