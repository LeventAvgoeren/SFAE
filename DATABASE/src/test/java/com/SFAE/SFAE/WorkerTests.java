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

import java.util.Random;

import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;

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

     @Autowired
    private TransactionTemplate transactionTemplate;
    @Test
    public void testCreateWorker() throws Exception {
                String json = "{" +
                "\"name\": \"TestRating\"," +
                "\"location\": \"BERLIN\"," +
                "\"password\": \"COLORBOX\"," +
                "\"email\": \"leventavgorensss@gmail.com\"," +
                "\"range\": 1.5," +
                "\"jobType\":\"INSTALLATEUR\"," +
                "\"minPayment\": 35.0," +
                "\"latitude\":  54.5164521479732," +
                "\"longitude\": 13.350172988628778" +
            "}";
            try {
                mockMvc.perform(post("/worker")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                        .andExpect(status().isCreated());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
    }

    @Test
    public void testCreateWorkerWithNull() throws Exception {
        String json = "";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(post("/worker")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());

        transactionManager.commit(status);  
    }

    @Test
    public void testCreateWorkerWithNotAllAttributes() throws Exception {
        String json = "{" +
    "\"name\": \"Levent Avgören\"," +
    "\"location\": \"Köln\"," +
    "\"password\": \"passwordsasdsad1234\"," +
    "\"email\": \"Levenstavgorendsssdddddsdsa@gmail.com\"," +
    "\"range\": 1.1," +
"}";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(post("/worker")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());

        transactionManager.commit(status);  
    }



      @Test
    public void testGetWorkerByName() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/usr/RISA"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
    }

    @Test
    public void testGetWorkerByTowNames() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/usr/test"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
    }

    @Test
    public void testGetWorkerrByid() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/W5"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
    }

    @Test
    public void testGetWorkerrByNegativeId() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/-1"))
                .andExpect(status().isBadRequest())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
    }
    @Test
    public void testGetWorkerrByNotExistingId() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/W423"))
                .andExpect(status().isNotFound())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
    }

    @Test
    public void testDeleteWorkerrByid() throws Exception {

         MvcResult mvcResult = mockMvc.perform(delete("/worker/W15"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
   }

   @Test
   public void testDeleteWorkerrByNegativeId() throws Exception {

        MvcResult mvcResult = mockMvc.perform(delete("/worker/-1"))
               .andExpect(status().isBadRequest())
               .andReturn();

       String contentAsString = mvcResult.getResponse().getContentAsString();
       System.out.println("A " + contentAsString);
  }

  @Test
   public void testDeleteWorkerNotFound() throws Exception {

        MvcResult mvcResult = mockMvc.perform(delete("/worker/W1000"))
               .andExpect(status().isNotFound())
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
    worker.setId("W1");
    worker.setEmail("XalooosSelam@gmail.com");
    worker.setLocation("Bremen");
    worker.setJobType("HAUSMEISTER");
    worker.setMinPayment(0.9);
    worker.setName("Kenno");
    worker.setPassword("Meinhund123");
    worker.setRange(0.8);
    worker.setRating(0.5);
    worker.setStatus("AVAILABLE");
    worker.setStatusOrder("FINISHED");
    worker.setVerification(true);
    worker.setLatitude( 2.5347706933045);
    worker.setLongitude( 13.35002718682623);
    
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
public void testUpdateWorkerWithNull() throws Exception {
    
        String json = "";

    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(put("/worker") 
            .contentType(MediaType.APPLICATION_JSON)
            .content(json)) 
            .andExpect(status().isBadRequest());

    transactionManager.commit(status);  
}

@Test
public void testUpdateWorkerWithNotAllAttributes() throws Exception {
        WorkerDTO worker = new WorkerDTO();
        worker.setId("W2");
        worker.setEmail("XalooosSelam@gmail.com");
        worker.setMinPayment(0.9);
        worker.setName("Kenno");
        worker.setPassword("Meinhund123");
        worker.setRange(0.8);
        worker.setRating(0.5);
        worker.setStatus("AVAILABLE");
        worker.setStatusOrder("FINISHED");
        worker.setVerification(true);
    
        
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());
    
       
        ObjectMapper objectMapper = new ObjectMapper();
        String workerJson = objectMapper.writeValueAsString(worker);

    mockMvc.perform(put("/worker") 
            .contentType(MediaType.APPLICATION_JSON)
            .content(workerJson)) 
            .andExpect(status().isBadRequest());

    transactionManager.commit(status);  
}
@Test
public void testUpdateWorkerWithNotExistingId() throws Exception {
        WorkerDTO worker = new WorkerDTO();
        worker.setId("100L");
        worker.setEmail("XalooosSelam@gmail.com");
        worker.setMinPayment(0.9);
        worker.setName("Kenno");
        worker.setPassword("Meinhund123");
        worker.setRange(0.8);
        worker.setRating(0.5);
        worker.setStatus("AVAILABLE");
        worker.setStatusOrder("FINISHED");
        worker.setVerification(true);
    
        
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());
    
       
        ObjectMapper objectMapper = new ObjectMapper();
        String workerJson = objectMapper.writeValueAsString(worker);

    mockMvc.perform(put("/worker") 
            .contentType(MediaType.APPLICATION_JSON)
            .content(workerJson)) 
            .andExpect(status().isBadRequest());

    transactionManager.commit(status);  
}



@Test
public void loginWorker() throws Exception{

        String json = "{ \"password\": \"COLORBOX\", \"email\": \"COLORBOX@gmail.com\"}";
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

@Test
public void loginWorkerWithNull() throws Exception{

        String json = "";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        MvcResult mvcResult = mockMvc.perform(post("/worker/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isBadRequest())
        .andReturn();
            

        transactionManager.commit(status);  

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);

}

@Test
public void loginWorkerWithEmailNull() throws Exception{

        String json = "{ \"password\": \"passwordsdsad1234\" }";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        MvcResult mvcResult = mockMvc.perform(post("/worker/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isBadRequest())
        .andReturn();
            

        transactionManager.commit(status);  

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);

}
@Test
public void loginWorkerNotExistingWorker() throws Exception{

        String json = "{ \"password\": \"passwordsdsad1234\", \"email\": \"dnuadnaui@gmail.com\"}";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        MvcResult mvcResult = mockMvc.perform(post("/worker/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isNotFound())
        .andReturn();
            
        transactionManager.commit(status);  
        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);

}

@Test
public void testCountAllWorkers() throws Exception {

     MvcResult mvcResult = mockMvc.perform(get("/worker/all"))
            .andExpect(status().isOk())
            .andReturn();

    String contentAsString = mvcResult.getResponse().getContentAsString();
    System.out.println("A " + contentAsString);
}

@Test
public void testAvgRating() throws Exception {

String json = "{\"rating\": 1.0, " +
               " \"id\": \"W13\"} ";
MvcResult mvcResult = mockMvc.perform(put("/worker/rating")
.contentType(MediaType.APPLICATION_JSON)
.content(json))
.andExpect(status().isOk())
.andReturn();

    String contentAsString = mvcResult.getResponse().getContentAsString();
    System.out.println("A " + contentAsString);
}

}
