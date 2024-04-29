package com.SFAE.SFAE;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
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
        String json = "{ \"name\": \"Max\", \"password\": \"passwort123\", \"email\": \"levo@example.com\", \"role\": \"ADMIN\"}";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(post("/customer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated());

        transactionManager.commit(status);  
    }

    @Test
    public void testGetCustomerByName() throws Exception {

            mockMvc.perform(get("/customer/usr/Max"))
                .andExpect(status().isOk())
                .andReturn();

    }

    @Test
    public void testGetCustomerByID() throws Exception {

            mockMvc.perform(get("/customer/1"))
                .andExpect(status().isOk())
                .andReturn();

    }
    
   
    @Test 
    public void testDeleteCustomerByID() throws Exception {

            mockMvc.perform(delete("/customer/101"))
                .andExpect(status().isOk())
                .andReturn();

    }


    
    @Test
    public void testUpdateCustomerByID() throws Exception {
        CustomerDTO customerData = new CustomerDTO();
        customerData.setId(2L);
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
    public void testLoginCustomer() throws Exception {
        String json = "{ \"password\": \"passwort123\", \"email\": \"levo@example.com\"}";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        MvcResult mvcResult = mockMvc.perform(put("/customer/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isOk())
        .andReturn();
            

        transactionManager.commit(status);  

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
    }
}

