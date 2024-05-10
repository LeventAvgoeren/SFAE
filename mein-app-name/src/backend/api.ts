import { WorkerResource } from "../Resources";
import { LoginInfo } from "../components/LoginManager";
import { fetchWithErrorHandling } from "./fetchWithErrorHandling";


export async function getCustomerByName(name: String): Promise<any> {

    const url =  process.env.REACT_APP_API_SERVER_URL + `/customer/usr/${name}`;
    const response = await fetchWithErrorHandling(url,{credentials: 'include' as RequestCredentials})
    
    return  response;
}

export async function getWorkerbyID(id: number | undefined): Promise<WorkerResource> {
    if (typeof id !== 'number') {
        throw new Error("Worker ID must be provided.");
    }

    const url = `${process.env.REACT_APP_API_SERVER_URL}/worker/${id}`;
    const response = await fetchWithErrorHandling(url, { credentials: 'include' as RequestCredentials });

    const answer = await response.json()
    return answer;
}


export async function login(email:string, password:string, userType:string):Promise <LoginInfo | false> {
    const requestOptions = {
      method: 'POST',
      headers: { Accept: "application/json",
      "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      
    };
  
    try {
      const path = userType === 'worker' ? '/worker/login' : '/customer/login';
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}${path}`, requestOptions);
      if (!response.ok) {
        throw new Error('Login failed: ' + response.status);
      }
      
      const token = await response.json(); // oder response.json(), falls der Server JSON zurückgibt
      if(token.id){
        console.log(token)
        return { userId: token.id, admin: token.role };
      }
      
    } catch (error) {
      console.error('Login error:', error);
      return false; // Oder geeignete Fehlerbehandlung
    }

    return false;
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

export async function registrationWorker(name: string, location: string, email:string, password:string, jobType:string, minPayment:number) {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/worker`;

    jobType = jobType.toUpperCase();

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

export async function getWorkerByName(name: string): Promise<any> {
    // Überprüfe zunächst, ob der Name nicht leer oder ungültig ist
    if (!name.trim()) {
        throw new Error("Name must be provided.");
    }

    const url = `${process.env.REACT_APP_API_SERVER_URL}/usr/${name}`;
    try {
        const response = await fetchWithErrorHandling(url, { credentials: 'include' as RequestCredentials });

        if (!response.ok) {
            throw new Error(`Worker not found: ${response.status}`);
        }

        const workerData = await response.json();
        return workerData;
    } catch (error) {
        console.error('Error fetching worker by name:', error);
        throw error; // Weitergeben des Fehlers für eine mögliche Fehlerbehandlung in der Anwendung
    }
}