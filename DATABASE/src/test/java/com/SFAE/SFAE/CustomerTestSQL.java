package com.SFAE.SFAE;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import com.SFAE.SFAE.DTO.CustomerDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class CustomerTestSQL {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PlatformTransactionManager transactionManager;

    @Test
    public void testCreateCustomer() throws Exception {
        String json = "{ \"name\": \"MaxMuster\", \"password\": \"passwort123\", \"email\": \"M@gmail.com\"}";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(post("/customer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated());
                transactionManager.commit(status);
    }

    @Test
    public void testCreateCustomerEmptyValue() throws Exception {
        String json = "{ \"name\":, \"password\": \"passwort123\", \"email\": \"erayor045@gmail.com\"}";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(post("/customer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());

        transactionManager.commit(status);
    }

    @Test
    public void testGetCustomerByName() throws Exception {

        mockMvc.perform(get("/customer/usr/Eray Kaan"))
                .andExpect(status().isOk())
                .andReturn();

    }

    @Test
    public void testGetCustomerByNameEmptyValue() throws Exception {

        mockMvc.perform(get("/customer/usr/ "))
                .andExpect(status().isBadRequest())
                .andReturn();

    }

    @Test
    public void testGetCustomerBySecName() throws Exception {

        mockMvc.perform(get("/customer/usr/Admin"))
                .andExpect(status().isOk())
                .andReturn();

    }

    @Test
    public void testGetCustomerByID() throws Exception {

        mockMvc.perform(get("/customer/C3"))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    public void testGetCustomerByNegativeID() throws Exception {

        mockMvc.perform(get("/customer/-7"))
                .andExpect(status().isBadRequest())
                .andReturn();
    }

    @Test
    public void testUpdateCustomerByID() throws Exception {
        CustomerDTO customerData = new CustomerDTO();
        customerData.setId("C3");
        customerData.setName("Test Name");
        customerData.setEmail("test@example.com");
        customerData.setRole("ADMIN");
        customerData.setPassword("test123");
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(put("/customer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(customerData)))
                .andExpect(status().isOk());

        transactionManager.commit(status);
    }

    @Test
    public void testUpdateCustomerWithoutID() throws Exception {
        CustomerDTO customerData = new CustomerDTO();
        customerData.setName("Test Name");
        customerData.setEmail("test@example.com");
        customerData.setRole("ADMIN");
        customerData.setPassword("test123");
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(put("/customer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(customerData)))
                .andExpect(status().isBadRequest());

        transactionManager.commit(status);
    }

    @Test
    public void testUpdateCustomerEmptyName() throws Exception {
        CustomerDTO customerData = new CustomerDTO();
        customerData.setId("C3");
        customerData.setEmail("test@example.com");
        customerData.setRole("ADMIN");
        customerData.setPassword("test123");
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(put("/customer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(customerData)))
                .andExpect(status().isBadRequest());

        transactionManager.commit(status);
    }

    @Test
    public void testUpdateCustomerWrongRole() throws Exception {
        CustomerDTO customerData = new CustomerDTO();
        customerData.setId("C3");
        customerData.setName("Test Name");
        customerData.setEmail("test@example.com");
        customerData.setRole("KILOBYTE");
        customerData.setPassword("test123");
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(put("/customer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(customerData)))
                .andExpect(status().isBadRequest());

        transactionManager.commit(status);
    }

    @Test
    public void testLoginCustomer() throws Exception {
        String json = "{ \"password\": \"admin\", \"email\": \"admin@gmail.com\"}";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(post("/customer/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andReturn();

        transactionManager.commit(status);
    }

    @Test
    public void testLoginCustomerWithoutPassword() throws Exception {
        String json = "{ \"password\":, \"email\": \"erayzor045@gmail.com\"}";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(post("/customer/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest())
                .andReturn();

        transactionManager.commit(status);
    }

    @Test
    public void testLoginCustomerWithoutEmail() throws Exception {
        String json = "{ \"password\": \"passwort123\", \"email\":}";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(post("/customer/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest())
                .andReturn();

        transactionManager.commit(status);
    }

    @Test
    public void testLoginCustomerWrongEmail() throws Exception {
        String json = "{ \"password\": \"passwort123\", \"email\": \"iDontExist@gmail.com\"}";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(post("/customer/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isNotFound())
                .andReturn();

        transactionManager.commit(status);
    }

       @Test
    public void testCountAllCustomers() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/customer/all"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
   }

   @Test
public void testImageGetWorkerById() throws Exception {
    MvcResult mvcResult = mockMvc.perform(get("/customer/C1/image"))
            .andExpect(status().isOk())
            .andReturn();

    String contentAsString = mvcResult.getResponse().getContentAsString();
    System.out.println("HAAAAAAAALLLLLLLLLLOOOOOOOO " + contentAsString);  

}


@Test
public void testImageGetWorkerByIdNotFound() throws Exception {
    MvcResult mvcResult = mockMvc.perform(get("/customer/C100/image"))
            .andExpect(status().isNotFound())
            .andReturn();

    String contentAsString = mvcResult.getResponse().getContentAsString();
    System.out.println("HAAAAAAAALLLLLLLLLLOOOOOOOO " + contentAsString);  

}

@Test
public void testImageGetWorkerByIdBadRequest() throws Exception {
    MvcResult mvcResult = mockMvc.perform(get("/customer//image"))
            .andExpect(status().isBadRequest())
            .andReturn();

    String contentAsString = mvcResult.getResponse().getContentAsString();
    System.out.println("HAAAAAAAALLLLLLLLLLOOOOOOOO " + contentAsString);  

}

@Test
public void testImageGetWorkerByIdServerError() throws Exception {
    MvcResult mvcResult = mockMvc.perform(get("/customer/HALLO/image"))
            .andExpect(status().isInternalServerError())
            .andReturn();

    String contentAsString = mvcResult.getResponse().getContentAsString();
    System.out.println("HAAAAAAAALLLLLLLLLLOOOOOOOO " + contentAsString);  

}



}
