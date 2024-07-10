package com.SFAE.SFAE;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
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
import org.springframework.transaction.support.DefaultTransactionDefinition;

import com.SFAE.SFAE.DTO.WorkerDTO;
import com.SFAE.SFAE.DTO.WorkerPrefrencesDTO;
import com.SFAE.SFAE.DTO.WorkerProfileDTO;
import com.SFAE.SFAE.ENUM.JobList;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.io.IOException;
import jakarta.transaction.Transactional;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;




/**
 * @author Levent
 */


@SpringBootTest
@AutoConfigureMockMvc
public class WorkerTests{

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PlatformTransactionManager transactionManager;

    @Autowired
    private ObjectMapper objectMapper;
    @Test
    public void testCreateWorker() throws Exception {
        String json = "{" +
            "\"name\": \"TestRating\"," +
            "\"location\": \"Rathenowerstrasse 36\"," +
            "\"password\": \"Levent123!\"," +
            "\"email\": \"leventavgoren@gmail.com\"," +
            "\"range\": 1.5," +
            "\"jobType\": [\"INSTALLATEUR\",\"WÄSCHER\"]," +
            "\"minPayment\": 35.0," +
            "\"latitude\": 54.5134521479732," +
            "\"longitude\": 13.354172988628778," +
            "\"slogan\": \"Ich stehe auf ahmad und ducs vateradadadada\"" +
        "}";

        mockMvc.perform(post("/worker")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated());
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
    }

    @Test
    public void testGetWorkerByTowNames() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/usr/test"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
    }

    @Test
    public void testGetWorkerrByid() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/W1"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
    }

    @Test
    public void testGetWorkerrByNegativeId() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/-1"))
                .andExpect(status().isBadRequest())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
    }
    @Test
    public void testGetWorkerrByNotExistingId() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/W323"))
                .andExpect(status().isNotFound())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
    }

    @Test
    public void testDeleteWorkerrByid() throws Exception {

        //Fix foreigns 
         MvcResult mvcResult = mockMvc.perform(delete("/worker/W7"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
   }

   @Test
   public void testDeleteWorkerrByNegativeId() throws Exception {

        MvcResult mvcResult = mockMvc.perform(delete("/worker/-1"))
               .andExpect(status().isBadRequest())
               .andReturn();

       String contentAsString = mvcResult.getResponse().getContentAsString();
  }

  @Test
   public void testDeleteWorkerNotFound() throws Exception {

        MvcResult mvcResult = mockMvc.perform(delete("/worker/W1000"))
               .andExpect(status().isNotFound())
               .andReturn();

       String contentAsString = mvcResult.getResponse().getContentAsString();
  }

  @Test
   public void testDeleteWorkerWithOpenContracts() throws Exception {

        MvcResult mvcResult = mockMvc.perform(delete("/worker/W1"))
               .andExpect(status().isConflict())
               .andReturn();

       String contentAsString = mvcResult.getResponse().getContentAsString();
  }

   @Test
    public void testFindAllWorker() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
   }

@Test
    public void testUpdateWorker() throws Exception {
        String base64Image = encodeFileToBase64Binary("static/images/default_profile.jpeg");
        
        WorkerDTO worker = new WorkerDTO();
        worker.setId("W6");
        worker.setEmail("playerahmad@gmail.com");
        worker.setLocation("Berlin");
        worker.setMinPayment(0.9);
        worker.setJobType(new String[]{"INSTALLATEUR", "AUTOBESORGER"});
        worker.setName("Kenno");
        worker.setPassword("Meinhund123!ASDSA");
        worker.setRange(2.0);
        worker.setRating(2.0);
        worker.setStatus("AVAILABLE");
        worker.setStatusOrder("FINISHED");
        worker.setVerification(true);
        worker.setProfileBase64(base64Image);
        worker.setSlogan("Lebens lang grün weissdads");

        transactionManager.getTransaction(new DefaultTransactionDefinition());

        ObjectMapper objectMapper = new ObjectMapper();
        String workerJson = objectMapper.writeValueAsString(worker);

        mockMvc.perform(put("/worker")
                .contentType(MediaType.APPLICATION_JSON)
                .content(workerJson))
                .andExpect(status().isAccepted());

    }

    public static String encodeFileToBase64Binary(String resourcePath) throws IOException, FileNotFoundException, java.io.IOException {
        ClassPathResource resource = new ClassPathResource(resourcePath);
        File file = resource.getFile();
        try (FileInputStream fileInputStream = new FileInputStream(file)) {
            byte[] bytes = new byte[(int) file.length()];
            fileInputStream.read(bytes);
            return Base64.getEncoder().encodeToString(bytes);
        }
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
        worker.setId("W6");
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

}
@Test
public void loginWorkerWithoutAuth() throws Exception{

        String json = "{ \"password\": \"COLORBOX\", \"email\": \"COLORBOX@gmail.com\"}";
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        MvcResult mvcResult = mockMvc.perform(post("/worker/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isOk())
        .andReturn();
            

        transactionManager.commit(status);  

        String contentAsString = mvcResult.getResponse().getContentAsString();

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

}

@Test
public void testCountAllWorkers() throws Exception {

     MvcResult mvcResult = mockMvc.perform(get("/worker/all"))
            .andExpect(status().isOk())
            .andReturn();

    String contentAsString = mvcResult.getResponse().getContentAsString();
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
}

@Test
public void testImageGetWorkerById() throws Exception {
    MvcResult mvcResult = mockMvc.perform(get("/worker/W1/image"))
            .andExpect(status().isOk())
            .andReturn();

    String contentAsString = mvcResult.getResponse().getContentAsString();

}

@Test
public void testUpdateWorkerStatus() throws Exception {

  String json = "INAVAILABLE";
  

  MvcResult mvcResult = mockMvc.perform(put("/worker/status/W2")
      .contentType(MediaType.APPLICATION_JSON)
      .content(json))
      .andExpect(status().isOk())
      .andReturn();

  String contentAsString = mvcResult.getResponse().getContentAsString();
}
@Test
public void testUpdateWorkerStatusNotFound() throws Exception {

  String json = "INAVAILABLE";
  

  MvcResult mvcResult = mockMvc.perform(put("/worker/status/W20")
      .contentType(MediaType.APPLICATION_JSON)
      .content(json))
      .andExpect(status().isNotFound())
      .andReturn();

  String contentAsString = mvcResult.getResponse().getContentAsString();
}


@Test
public void testUpdateWorkerStatusWithOutEnum() throws Exception {

  String json = "IchBinKeinEnum";
  

  MvcResult mvcResult = mockMvc.perform(put("/worker/status/W2")
      .contentType(MediaType.APPLICATION_JSON)
      .content(json))
      .andExpect(status().isInternalServerError())
      .andReturn();

  String contentAsString = mvcResult.getResponse().getContentAsString();
}

@Test
public void testUpdateWorkerStatusWithOutInput() throws Exception {

  String json = "";
  

  MvcResult mvcResult = mockMvc.perform(put("/worker/status/W2")
      .contentType(MediaType.APPLICATION_JSON)
      .content(json))
      .andExpect(status().isBadRequest())
      .andReturn();

  String contentAsString = mvcResult.getResponse().getContentAsString();
}

@Test
public void testUpdateWorkerStatusOrder() throws Exception {

  String json = "DECLINED";
  

  MvcResult mvcResult = mockMvc.perform(put("/worker/statusOrder/W2")
      .contentType(MediaType.APPLICATION_JSON)
      .content(json))
      .andExpect(status().isOk())
      .andReturn();

  String contentAsString = mvcResult.getResponse().getContentAsString();
}

@Test
public void testUpdateWorkerStatusOrderWithOutEnum() throws Exception {

  String json = "IchBinKeinEnum";
  

  MvcResult mvcResult = mockMvc.perform(put("/worker/statusOrder/W2")
      .contentType(MediaType.APPLICATION_JSON)
      .content(json))
      .andExpect(status().isInternalServerError())
      .andReturn();

  String contentAsString = mvcResult.getResponse().getContentAsString();
}

@Test
public void testUpdateWorkerStatusOrderNotFound() throws Exception {

  String json = "DECLINED";
  

  MvcResult mvcResult = mockMvc.perform(put("/worker/statusOrder/W20")
      .contentType(MediaType.APPLICATION_JSON)
      .content(json))
      .andExpect(status().isNotFound())
      .andReturn();

  String contentAsString = mvcResult.getResponse().getContentAsString();
}

@Test
public void testUpdateWorkerStatusOrderBadReq() throws Exception {

  String json = "";
  

  MvcResult mvcResult = mockMvc.perform(put("/worker/statusOrder/W2")
      .contentType(MediaType.APPLICATION_JSON)
      .content(json))
      .andExpect(status().isBadRequest())
      .andReturn();

  String contentAsString = mvcResult.getResponse().getContentAsString();
}

@Test
    public void testGetWorkerStatuse() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/statuse/W1"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
    }


    @Test
    public void testGetWorkerStatuseServerError() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/statuse/afajnf"))
                .andExpect(status().isInternalServerError())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
    }

    @Test
    public void testupdateWorkerProfil() throws Exception {
        String base64Image = encodeFileToBase64Binary("static/images/koestliche-donuts-wurden-automatisch-generiert.jpg");
        
        WorkerProfileDTO worker = new WorkerProfileDTO();
        worker.setId("W12");
        worker.setEmail("HALLOTESadsaadadT@gmail.com");
        worker.setLocation("Bremen");
  
        worker.setName("Kenno");
        worker.setPassword("Meinhund123");
        worker.setLatitude(2.5347706933045);
        worker.setLongitude(13.35002718682623);
        worker.setProfileBase64(base64Image);
        worker.setSlogan("Duc mag hunde ");

       
        transactionManager.getTransaction(new DefaultTransactionDefinition());

        ObjectMapper objectMapper = new ObjectMapper();
        String workerJson = objectMapper.writeValueAsString(worker);

        mockMvc.perform(put("/worker/profil")
                .contentType(MediaType.APPLICATION_JSON)
                .content(workerJson))
                .andExpect(status().isAccepted());

    }


    @Test
    public void testGetWorkerPreferences() throws Exception {        
        WorkerPrefrencesDTO worker = new WorkerPrefrencesDTO();
        worker.setId("W12");
        worker.setJobType(new String[]{"INSTALLATEUR", "AUTOBESORGER"});
        worker.setMinPayment(20.0);
        worker.setRange(5.0);

        String workerJson = objectMapper.writeValueAsString(worker);

        mockMvc.perform(put("/worker/preferences")
                .contentType(MediaType.APPLICATION_JSON)
                .content(workerJson))
                .andExpect(status().isAccepted());

    }


    @Test
    public void testNewsLetter() throws Exception{
      
        List<JobList> jobtype = new ArrayList<>();
        jobtype.add(JobList.KAMMERZOFEN);
        String workerJson = objectMapper.writeValueAsString(jobtype);

        mockMvc.perform(post("/newsLetter/sendNews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(workerJson))
                .andExpect(status().isOk());

    }

    @Test
    public void testNewsLetterError() throws Exception{
      
        List<JobList> jobtype = new ArrayList<>();
        jobtype.add(JobList.BABYSITTER);
        String workerJson = objectMapper.writeValueAsString(jobtype);

        mockMvc.perform(post("/newsLetter/sendNews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(workerJson))
                .andExpect(status().isNoContent());

    }


    @Test
    public void testNewsLetterWithReg() throws Exception{
        String json = "{" +
        "\"name\": \"TestRating\"," +
        "\"location\": \"Rathenowerstrasse 36\"," +
        "\"password\": \"Levent123!\"," +
        "\"email\": \"Xalofr@gmail.com\"," +
        "\"range\": 1.5," +
        "\"jobType\": [\"KAMMERZOFEN\"]," +
        "\"minPayment\": 35.0," +
        "\"latitude\": 54.5134521479732," +
        "\"longitude\": 13.354172988628778," +
        "\"slogan\": \"Ich stehe auf ahmad und ducs vateradadadada\"" +
    "}";

    mockMvc.perform(post("/worker")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json))
            .andExpect(status().isCreated());
      
        List<JobList> jobtype = new ArrayList<>();
        jobtype.add(JobList.KAMMERZOFEN);
        String workerJson = objectMapper.writeValueAsString(jobtype);

        mockMvc.perform(post("/newsLetter/sendNews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(workerJson))
                .andExpect(status().isOk());

    }
    }

