import { ContractResource, ContractResourceforWorker, CustomerResource, Position, RatingRessource, TokenRessource, WorkerResource } from "../Resources";
import { LoginInfo } from "../components/LoginManager";
import { fetchWithErrorHandling } from "./fetchWithErrorHandling";

// get/delete/update Customer
export async function getAllCustomers(): Promise<CustomerResource[]> {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/customer`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include" as RequestCredentials,
  });
  return response.json();
}

export async function getCustomerByName(name: String): Promise<any> {
  const url = process.env.REACT_APP_API_SERVER_URL + `/customer/usr/${name}`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include" as RequestCredentials,
  });

  return response;
}

export async function getCustomerbyID(id: string): Promise<CustomerResource> {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/customer/${id}`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include" as RequestCredentials,
  });
  return response.json();
}

export async function deleteCustomer(id: string) {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/customer/${id}`;
  const isCustomerAdmin = await getCustomerbyID(id);
  if (isCustomerAdmin.role === 'ADMIN') {
    throw new Error('Cannot delete an admin user');
  }
  const options = {
    method: "DELETE",
    credentials: "include" as RequestCredentials,
  };

  await fetchWithErrorHandling(url, options);
}

export async function updateCustomer(customerData: CustomerResource) {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/customer`;
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(customerData),
    credentials: "include" as RequestCredentials,
  };

  const response = await fetchWithErrorHandling(url, options);
  return response.json();
}

// get/delete/deleteCookie/update Worker

export async function getWorkerbyID(id: string): Promise<WorkerResource> {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/worker/${id}`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include" as RequestCredentials,
  });

  const answer = await response.json();
  return answer;
}

export async function getWorkerByName(name: string): Promise<any> {
  // Überprüfe zunächst, ob der Name nicht leer oder ungültig ist
  if (!name.trim()) {
    throw new Error("Name must be provided.");
  }

  const url = `${process.env.REACT_APP_API_SERVER_URL}/usr/${name}`;
  try {
    const response = await fetchWithErrorHandling(url, {
      credentials: "include" as RequestCredentials,
    });

    if (!response.ok) {
      throw new Error(`Worker not found: ${response.status}`);
    }

    const workerData = await response.json();
    return workerData;
  } catch (error) {
    console.error("Error fetching worker by name:", error);
    throw error; // Weitergeben des Fehlers für eine mögliche Fehlerbehandlung in der Anwendung
  }
}

export async function updateWorker(workerData: WorkerResource): Promise<WorkerResource> {

  const url = `${process.env.REACT_APP_API_SERVER_URL}/worker`;
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(workerData),
    credentials: "include" as RequestCredentials,
  };
  try {
    const response = await fetchWithErrorHandling(url, options);
    const updatedWorker = await response.json();
    console.log("ASD" + updatedWorker)
    return updatedWorker;
  } catch (error) {
    console.error("Failed to update worker:", error);
    throw error;
  }
}

export async function deleteWorker(id: string) {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/worker/${id}`;
  const options = {
    method: "DELETE",
    credentials: "include" as RequestCredentials,
  };

  await fetchWithErrorHandling(url, options);
}

export async function deleteCookieWorker() {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/worker/logout`;
  const options = {
    method: "DELETE",
    credentials: "include" as RequestCredentials,
  }
  const response = await fetchWithErrorHandling(url, options)
  return response;
}

//count all Customer/Workers/Contracts

export async function countAllCustomers(): Promise<number> {


  const url = `${process.env.REACT_APP_API_SERVER_URL}/customer/all`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include" as RequestCredentials,
  });

  const answer = await response.json();
  return answer;
}

export async function countAllWorkers(): Promise<number> {


  const url = `${process.env.REACT_APP_API_SERVER_URL}/worker/all`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include" as RequestCredentials,
  });

  const answer = await response.json();
  return answer;
}

export async function countAllContracts(): Promise<number> {


  const url = `${process.env.REACT_APP_API_SERVER_URL}/contract/all`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include" as RequestCredentials,
  });

  const answer = await response.json();
  return answer;
}


//registration Admin/Customer/Worker

export async function registrationAdmin(
  name: string,
  password: string,
  email: string
) {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/admin`;

  try {
    const response = await fetchWithErrorHandling(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }), // Ensure field names match your backend
      credentials: "include" as RequestCredentials,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
}

export async function registrationCustomer(
  name: string,
  password: string,
  email: string
) {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/customer`;

  try {
    const response = await fetchWithErrorHandling(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }), // Ensure field names match your backend
      credentials: "include" as RequestCredentials,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
}

export async function registrationWorker(
  name: string,
  location: string,
  email: string,
  password: string,
  jobType: string,
  minPayment: number,
  LongLat: Position
) {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/worker`;

  jobType = jobType.toUpperCase();
  let latitude = LongLat.latitude;
  let longitude = LongLat.longitude;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        location,
        email,
        password,
        jobType,
        minPayment,
        latitude,
        longitude
      }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
}


//Contract create/deleteID/get/getByWorkerId/accept or decline/get Customer by ID

export async function createContract(contract: ContractResource): Promise<ContractResource> {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/contract`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      credentials: "include" as RequestCredentials,
    },
    body: JSON.stringify(contract)

  });
  if (!response.ok) {
    throw new Error('levent mag sucki .');
  }
  return response.json();

}


export async function deleteContractById(id: number): Promise<boolean> {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/contract/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      credentials: "include" as RequestCredentials,
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete contract with id: ' + id);
  }

  return true;
}


export async function getContract(id: number): Promise<ContractResource> {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/contract/${id}`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include" as RequestCredentials,
  });

  const answer = await response.json();
  return answer;
}

export async function getContractByWorkerId(id: string): Promise<ContractResourceforWorker[]> {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/contract/worker/${id}`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include" as RequestCredentials,
  });

  const answer = await response.json();
  return answer;
}


export async function getContractByCustomerId(id: string | undefined): Promise<ContractResource[]> {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/contract/customer/${id}`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include" as RequestCredentials,
  });

  const answer = await response.json();
  return answer;
}

//Login/loginstatus
export async function login(
  email: string,
  password: string,
  userType: string
): Promise<LoginInfo | false> {
  const requestOptions = {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include" as RequestCredentials,
  };

  try {
    const path = userType === "worker" ? "/worker/login" : "/customer/login";
    const response = await fetch(
      `${process.env.REACT_APP_API_SERVER_URL}${path}`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error("Login failed: " + response.status);
    }

    const token = await response.json(); // oder response.json(), falls der Server JSON zurückgibt
    if (token.id) {
      return { userId: token.id, admin: token.role };
    }
  } catch (error) {
    console.error("Login error:", error);
    return false; // Oder geeignete Fehlerbehandlung
  }

  return false;
}

export async function checkLoginStatus(): Promise<LoginInfo | false> {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/customer/login`;

  try {
    const response = await fetchWithErrorHandling(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include" as RequestCredentials,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.sub) {
      return { userId: data.sub, admin: data.role };
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }

  return false;
}

//request/update Password

export async function requestPassword(email: String): Promise<void> {
  let url = `${process.env.REACT_APP_API_SERVER_URL}/customer/passwordreset`;

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(email),
    credentials: "include" as RequestCredentials,
  };

  await fetchWithErrorHandling(url, options);
}

export async function updatePassword(token: String, password: String): Promise<void> {

  let url = `${process.env.REACT_APP_API_SERVER_URL}/customer/updatepassword`;

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ token: token, password: password }),
    credentials: "include" as RequestCredentials,
  };

  await fetchWithErrorHandling(url, options);
}

export async function validateToken(token: string): Promise<TokenRessource | false> {

  const url = `${process.env.REACT_APP_API_SERVER_URL}/contract/token/${token}`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include" as RequestCredentials,
  };

  const response = await fetchWithErrorHandling(url, options);
  const jsonData = await response.json();

  return jsonData;
}

export async function deleteCookie() {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/customer/logout`;
  const options = {
    method: "DELETE",
    credentials: "include" as RequestCredentials,
  }
  const response = await fetchWithErrorHandling(url, options)
  return response;
}

export async function getUserFromEmail(email: String): Promise<CustomerResource | WorkerResource | false> {


  const url = `${process.env.REACT_APP_API_SERVER_URL}/contract/email`;

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email }),
    credentials: "include" as RequestCredentials,
  };

  const response = await fetchWithErrorHandling(url, options);

  return response.json();
}

export async function setRating(data:RatingRessource) :Promise <Boolean > {
  console.log("BIN DRINNE");
  const url = `${process.env.REACT_APP_API_SERVER_URL}/worker/rating`;

  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
    credentials: "include" as RequestCredentials,
  };


  const response = await fetchWithErrorHandling(url, options);
  
  if (response.ok) {
    console.log("HALLLLLLLLOOOOOO")
    return true;
  } else {
    return false;
  }
}
  
  

  
  export async function contractAcceptOrDecline(accepted: boolean, contractData:ContractResource): Promise<void> {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/contract/${accepted}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id: contractData.id,   adress: contractData.adress,description: contractData.description, jobType: contractData.jobType, payment: contractData.payment,range: contractData.range, statusOrder: contractData.statusOrder, customerId: contractData.customerId,  workerId: contractData.worker!.id}),
      credentials: "include" as RequestCredentials,
    };
  
    await fetchWithErrorHandling(url, options);
  }



  export async function getAllWorker(): Promise<WorkerResource[]> {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/worker`;
    const response = await fetchWithErrorHandling(url, {
      credentials: "include" as RequestCredentials,
    });

    const status = await response.json(); 
    return status;
  }

  export async function getContractStatus(contractId: number): Promise<string> {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/contract/status/${contractId}`;
    const response = await fetchWithErrorHandling(url, {
      credentials: "include" as RequestCredentials,
    });
    
    const status = await response.text(); 
    return status;
  }

  export async function getWorkerImage(workerId: string): Promise<string> {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/worker/${workerId}/image`;
    const response = await fetchWithErrorHandling(url, {
      credentials: "include" as RequestCredentials,
    });
    
    const status = await response.text(); 
    return status;
  }