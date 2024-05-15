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

    private final double baseLatitude = 52.5200;
    private final double baseLongitude = 13.4050;

    private final Random random = new Random();
    
    @Test
    public void testCreateWorker() throws Exception {
      
                double latitude = baseLatitude + (random.nextDouble() - 0.5) / 100; // Variation von +/- 0.005
                double longitude = baseLongitude + (random.nextDouble() - 0.5) / 100; // Variation von +/- 0.005
                
                double minPayment = 10 + (90 * random.nextDouble()); // Zufälliger minPayment zwischen 10 und 100
                double range = 2 + (3 * random.nextDouble()); // Zufälliger range zwischen 2 und 5
                String json = "{" +
                "\"name\": \"COLORBOX\"," +
                "\"location\": \"BERLIN\"," +
                "\"password\": \"COLORBOX\"," +
                "\"email\": \"COLORBOX@gmail.com\"," +
                "\"range\": 1.5," +
                "\"jobType\": \"GÄRTNER\"," +
                "\"minPayment\": 16.0," +
                "\"latitude\": 52.53300544067164," +
                "\"longitude\": 13.348867173967935" +
            "}";
    
                transactionTemplate.execute(status -> {
                    try {
                        mockMvc.perform(post("/worker")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json))
                                .andExpect(status().isCreated());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    return null;
                });
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

         MvcResult mvcResult = mockMvc.perform(get("/worker/usr/TANKSTELLE"))
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

         MvcResult mvcResult = mockMvc.perform(get("/worker/W1"))
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

         MvcResult mvcResult = mockMvc.perform(get("/worker/W323"))
                .andExpect(status().isNotFound())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
    }

    @Test
    public void testDeleteWorkerrByid() throws Exception {

         MvcResult mvcResult = mockMvc.perform(delete("/worker/W1"))
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


}
