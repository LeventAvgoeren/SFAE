import { ContractResource, ContractResourceforWorker, CustomerResource, Position, RatingRessource, TokenRessource, WorkerResource, WorkerResourcePreferences, WorkerResourceProfil } from "../Resources";
import { LoginInfo } from "../components/LoginManager";
import { HttpError } from "../components/Order/HTTPError";
import { fetchWithErrorHandling } from "./fetchWithErrorHandling";

// get/delete/update Customer
export async function getAllCustomers(): Promise<CustomerResource[]> {
  const cachedWorkers = localStorage.getItem('customers');
  if (cachedWorkers) {
    return JSON.parse(cachedWorkers);
  }

  const url = `${process.env.REACT_APP_API_SERVER_URL}/customer`;
  const response = await fetchWithErrorHandling(url, {
    credentials: "include" as RequestCredentials,
  });
  const customers = await response.json();
  localStorage.setItem('customers', JSON.stringify(customers));
  return customers;
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

  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include" as RequestCredentials,
  });

  console.log(response.status, response.ok+" -------------")
  if (!response.ok) {
    throw new HttpError(response);
  }

  return response;
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
  email: string,
) {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/customer`;

  try {
    const response = await fetchWithErrorHandling(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name}), // Ensure field names match your backend
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
  jobTypes: string[], // Changed to array
  minPayment: number,
  LongLat: Position,
  slogan: string
) {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/worker`;
  console.log(jobTypes)
  const upperJobTypes = jobTypes.map(type => type.toUpperCase());

  console.log(upperJobTypes)
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
        jobType: upperJobTypes,
        minPayment,
        latitude,
        longitude,
        slogan
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
      credentials: 'include'
    },
    body: JSON.stringify(contract)
  });

  if (!response.ok) {
    throw new HttpError(response);
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


export async function getContractByCustomerId(id: string | undefined): Promise<ContractResourceforWorker[]> {
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
): Promise<{result: LoginInfo | false, status?: number}> {
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
      return { result: false, status: response.status };
    }

    const token = await response.json(); // oder response.json(), falls der Server JSON zurückgibt
    if (token.id) {
      return { result: { userId: token.id, admin: token.role } };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { result: false }; // Oder geeignete Fehlerbehandlung
  }

  return { result: false };
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
      body: JSON.stringify({ id: contractData.id,   adress: contractData.adress,description: contractData.description, jobType: contractData.jobType, payment: contractData.payment,range: contractData.range, statusOrder: contractData.statusOrder, customerId: contractData.customer!.id,  workerId: contractData.worker!.id}),
      credentials: "include" as RequestCredentials,
    };
  
    await fetchWithErrorHandling(url, options);
  }



  export async function getAllWorker(): Promise<WorkerResource[]> {
    const cachedWorkers = localStorage.getItem('workers');
    if (cachedWorkers) {
      return JSON.parse(cachedWorkers);
    }

    const url = `${process.env.REACT_APP_API_SERVER_URL}/worker`;
    const response = await fetchWithErrorHandling(url, {
      credentials: "include" as RequestCredentials,
    });

    const workers = await response.json();
    localStorage.setItem('workers', JSON.stringify(workers));
    return workers;
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
  export async function getCustomerImage(customerId: string): Promise<string> {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/customer/${customerId}/image`;
    const response = await fetchWithErrorHandling(url, {
      credentials: "include" as RequestCredentials,
    });
    
    const status = await response.text(); 
    return status;
  }

  export async function updateWorkerStatus(workerId: string, status: string): Promise<string> {
    const url = `${process.env.REACT_APP_API_SERVER_URL}/worker/status/${workerId}`;
    const response = await fetchWithErrorHandling(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(  status ),
        credentials: 'include' as RequestCredentials,
    });

    const result = await response.text();
    return result;
}

export async function updateContractStatus(contractId: number, status: string): Promise<string> {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/contract/status/${contractId}`;
  const response = await fetchWithErrorHandling(url, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(status),
    credentials: 'include' as RequestCredentials,
  });

  const result = await response.text();
  return result;
}

export async function deleteChat(user1: string, user2: string): Promise<void> {
  console.log("WERDE AUS")
  const url = `${process.env.REACT_APP_API_SERVER_URL}/chat/history?user1=${user1}&user2=${user2}`;
  const response = await fetchWithErrorHandling(url, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  });
}

export async function updateWorkerOrderStatus(workerId: string, status: string): Promise<string> {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/worker/statusOrder/${workerId}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(status), 
    credentials: 'include' as RequestCredentials,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.text();
  return result;
}



export async function updateWorkerPreferences(workerData: WorkerResourcePreferences): Promise<WorkerResourcePreferences> {

  const url = `${process.env.REACT_APP_API_SERVER_URL}/worker/preferences`;
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

export async function updateWorkerProfile(workerData: WorkerResourceProfil): Promise<WorkerResource> {

  const url = `${process.env.REACT_APP_API_SERVER_URL}/worker/profil`;
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
export async function getTokenContent(token: string): Promise<TokenRessource | false> {

  const url = `${process.env.REACT_APP_API_SERVER_URL}/token/${token}`;
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


export async function verifyEmail(token: string): Promise<void> {

  let url = `${process.env.REACT_APP_API_SERVER_URL}/customer/verifyEmail/${token}`;

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include" as RequestCredentials,
  };

  await fetchWithErrorHandling(url, options);
}


export async function verifyEmailWorker(token: string): Promise<void> {

  let url = `${process.env.REACT_APP_API_SERVER_URL}/worker/verifyEmailWorker/${token}`;

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include" as RequestCredentials,
  };

  await fetchWithErrorHandling(url, options);
}

export async function chatBot(input: string): Promise<string> {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/api/chatBot`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const data = await response.text(); 
  return data; 
}

