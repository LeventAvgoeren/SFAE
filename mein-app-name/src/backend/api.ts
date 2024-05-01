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
      body: JSON.stringify({ email, password })
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

export async function registrationCustomer(name: string, password: string, email: string) {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/customer`;

    try {
        const response = await fetchWithErrorHandling(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, name }), // Ensure field names match your backend
            credentials: "include" as RequestCredentials
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error; 
    }
}

export async function registrationWorker(name: string, location: string, email:string, password:string, job:string, minPayment:number) {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/worker`;

    let jobType = job.toUpperCase;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, location, email, password,  jobType, minPayment }),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}