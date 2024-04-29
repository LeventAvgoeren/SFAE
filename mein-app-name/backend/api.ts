import { fetchWithErrorHandling } from "./fetchWithErrorHandling";


export async function getCustomerByName(name: String): Promise<any> {

    const url = `https://localhost:8443/customer/user/Max`;
    const response = await fetch('http://localhost:8081/customer/user/Max')
    .then(response => {
      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }
      return response.json();
    })
    .then(data => {
      // Behandle die Antwort
      console.log(data);
    })
    .catch(error => {
      console.error('Fetch Fehler:', error);
    });
    
    return await response.json();
}
