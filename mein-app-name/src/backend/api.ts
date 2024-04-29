import { fetchWithErrorHandling } from "./fetchWithErrorHandling";


export async function getCustomerByName(name: String): Promise<any> {

    const url = "https://localhost:8443" + `/customer/usr/${name}`;
    const response = await fetchWithErrorHandling(url,{credentials: 'include' as RequestCredentials})
    
    return await response;
}
