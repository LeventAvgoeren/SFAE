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


export async function login(email:string, password:string) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password },),
      credentials: 'include' as RequestCredentials 
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/worker/login`, requestOptions);
      if (!response.ok) {
        throw new Error('Login failed: ' + response.status);
      }
      const token = await response.text(); // oder response.json(), falls der Server JSON zurückgibt
      return token;
    } catch (error) {
      console.error('Login error:', error);
      return null; // Oder geeignete Fehlerbehandlung
    }
  }
