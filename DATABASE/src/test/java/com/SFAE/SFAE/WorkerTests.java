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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;



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

    @Test
    public void testCreateWorker() throws Exception {
        String json = "{\r\n" + //
                        "    \"name\": \"Max Mustermann\",\r\n" + //
                        "    \"location\": \"Berlin\",\r\n" + //
                        "    \"password\": \"passwort123\",\r\n" + //
                        "    \"email\": \"Leventavgoren@gmail.com\",\r\n" + //
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

         MvcResult mvcResult = mockMvc.perform(get("/worker/usr/Max_Mustermann"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
    }

    @Test
    public void testGetWorkerrByid() throws Exception {

         MvcResult mvcResult = mockMvc.perform(get("/worker/6"))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = mvcResult.getResponse().getContentAsString();
        System.out.println("A " + contentAsString);
    }

   // @Test
  //  public void testDeleteWorkerrByid() throws Exception {

    //     MvcResult mvcResult = mockMvc.perform(delete("/worker/6"))
    //            .andExpect(status().isOk())
    //            .andReturn();

     //   String contentAsString = mvcResult.getResponse().getContentAsString();
    //    System.out.println("A " + contentAsString);
  // }

   
}
