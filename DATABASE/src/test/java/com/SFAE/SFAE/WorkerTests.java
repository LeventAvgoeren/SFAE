package com.SFAE.SFAE;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import com.SFAE.SFAE.DTO.WorkerDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;



/**
 * @author Levent
 */


@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class WorkerTests{

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PlatformTransactionManager transactionManager;

    @Test
    public void testCreateWorker() throws Exception {
        String json = "{\r\n" + //
                        "    \"name\": \"Kalb Hund\",\r\n" + //
                        "    \"location\": \"Köln\",\r\n" + //
                        "    \"password\": \"hahahhdaasd21\",\r\n" + //
                        "    \"email\": \"adadad@gmail.com\",\r\n" + //
                        "    \"status\": \"AVAIBLE\",\r\n" + //
                        "    \"statusOrder\": \"ACCEPTED\",\r\n" + //
                        "    \"range\": 1.1,\r\n" + //
                        "    \"jobType\": \"GÄRTNER\",\r\n" + //
                        "    \"minPayment\": 1.1,\r\n" + //
                        "    \"rating\": 1.1,\r\n" + //
                        "    \"verification\": true\r\n" + //
                        "}";
        System.out.println(json);
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(post("/worker")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated());

        transactionManager.commit(status);  
    }

      @Test
    public void testGetWorkerByName() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/usr/Kenno"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
    }

    @Test
    public void testGetWorkerByTowNames() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/usr/Max_Mustermann"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
    }

    @Test
    public void testGetWorkerrByid() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/47"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
    }

    @Test
    public void testDeleteWorkerrByid() throws Exception {

         MvcResult mvcResult = mockMvc.perform(delete("/worker/47"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
   }

   @Test
    public void testFindAllWorker() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
   }

 @Test
public void testUpdateWorker() throws Exception {
    
    WorkerDTO worker = new WorkerDTO();
    worker.setId(27L);
    worker.setEmail("XaloSelam@gmail.com");
    worker.setLocation("Bremen");
    worker.setJobType("HAUSMEISTER");
    worker.setMinPayment(0.9);
    worker.setName("Kenno");
    worker.setPassword("Meinhund123");
    worker.setRange(0.8);
    worker.setRating(0.5);
    worker.setStatus("INAVIBLE");
    worker.setStatusOrder("FINISHED");
    worker.setVerification(true);

    
    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

   
    ObjectMapper objectMapper = new ObjectMapper();
    String workerJson = objectMapper.writeValueAsString(worker);

    
    mockMvc.perform(put("/worker") 
            .contentType(MediaType.APPLICATION_JSON)
            .content(workerJson)) 
            .andExpect(status().isAccepted());

    
    transactionManager.commit(status);  
}

@Test
public void loginWorker() throws Exception{

        String json = "{ \"password\": \"passwort123\", \"email\": \"Leventavgoren@gmail.com\"}";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        MvcResult mvcResult = mockMvc.perform(post("/worker/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isOk())
        .andReturn();
            

        transactionManager.commit(status);  

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);

}

}
