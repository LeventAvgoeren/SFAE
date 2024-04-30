import { LoginInfo } from "../components/LoginManager";
import { fetchWithErrorHandling } from "./fetchWithErrorHandling";


export async function getCustomerByName(name: String): Promise<any> {

    const url =  process.env.REACT_APP_API_SERVER_URL + `/customer/usr/${name}`;
    const response = await fetchWithErrorHandling(url,{credentials: 'include' as RequestCredentials})
    
    return  response;
}
export async function getWorkerbyID(id: number | undefined): Promise<any> {
    if (typeof id !== 'number') {
        throw new Error("Worker ID must be provided.");
    }

    const url = `${process.env.REACT_APP_API_SERVER_URL}/worker/${id}`;
    const response = await fetchWithErrorHandling(url, { credentials: 'include' as RequestCredentials });

    return response;
}


export async function login(email: string, passwort: string): Promise<LoginInfo | false> {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/worker/login`;

    try {
        const response = await fetchWithErrorHandling(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, password: passwort }),
            credentials: "include" as RequestCredentials
        });

        const i = await response.json();

        if (i && i.id) {
            const id = i.id; // Korrekt deklarierte lokale Variable
            console.log(id); // Logging der ID, falls notwendig

            // Angenommen, die Antwort enthält auch 'admin' als booleschen Wert
            return { userId: id, admin: i.admin ?? false }; // Rückgabe eines LoginInfo-Objekts
        } else {
            return false; // Rückgabe von false, wenn die Antwort ungültig ist oder keine ID enthält
        }
    } catch (error) {
        console.error("Login failed:", error);
        return false; // Rückgabe von false im Fehlerfall
    }
}
            
