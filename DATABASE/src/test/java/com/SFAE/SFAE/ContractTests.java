package com.SFAE.SFAE;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ContractTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private PlatformTransactionManager transactionManager;

  @Test
  public void testCreateContract() throws Exception {

    String json = "{" +
        "\"jobType\": \"GÄRTNER\"," +
        "\"adress\": \"Quizostrasse32\"," +
        "\"payment\": \"CASH\"," +
        "\"description\": \"Ich\"," +
        "\"statusOrder\": \"UNDEFINED\"," +
        "\"range\": 2.2," + // Als Zahl, korrekt für Double
        "\"customerId\": 1," + // Long-Wert, korrekt für die ID des Kunden
        "\"workerId\": 6" + // Long-Wert, korrekt für die ID des Arbeiters und ohne zusätzliche Leerzeichen
        "}";

    System.out.println(json);
    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(post("/contract")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isCreated());

    transactionManager.commit(status);
  }

  @Test
  public void testGetContract() throws Exception {

    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(get("/contract/4"))
        .andExpect(status().isOk())
        .andReturn();

    transactionManager.commit(status);
  }

  @Test
  public void testDeleteContract()throws Exception{
    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(delete("/contract/4"))
        .andExpect(status().isOk())
        .andReturn();

    transactionManager.commit(status);
  }

  @Test
  public void testUpdateContract() throws Exception {

    String json = "{" +
        "\"id\":\"4\","+
        "\"jobType\": \"HAUSMEISTER\"," +
        "\"adress\": \"Quizostrasse32\"," +
        "\"payment\": \"CASH\"," +
        "\"description\": \"ASD\"," +
        "\"statusOrder\": \"UNDEFINED\"," +
        "\"range\": 2.2," + 
        "\"customerId\": 1," + 
        "\"workerId\": 6" + 
        "}";

    System.out.println(json);
    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(put("/contract")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isOk());

    transactionManager.commit(status);
  }

  @Test
  public void testUpdateContractNULL() throws Exception {

    String json = "";

    System.out.println(json);
    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(put("/contract")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isBadRequest());

    transactionManager.commit(status);
  }

  @Test
  public void testUpdateContractWrongValue() throws Exception {

    String json = "{" +
        "\"id\":\"4\","+
        "\"jobType\": \"HAUSMEISTER\"," +
        "\"adress\": \"Quizostrasse32\"," +
        "\"payment\": \"Kreidtkarte\"," +
        "\"description\": \"ASD\"," +
        "\"statusOrder\": \"UNDEFINED\"," +
        "\"range\": 2.2," + 
        "\"customerId\": 1," + 
        "\"workerId\": 6" + 
        "}";

    System.out.println(json);
    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(put("/contract")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isBadRequest());

    transactionManager.commit(status);
  }

  
  @Test
  public void testUpdateContractWithoutAValue() throws Exception {

    String json = "{" +
        "\"id\":\"4\","+
        "\"jobType\": \"HAUSMEISTER\"," +
        "\"adress\":," +
        "\"payment\": \"CASH\"," +
        "\"description\": \"ASD\"," +
        "\"statusOrder\": \"UNDEFINED\"," +
        "\"range\": 2.2," + 
        "\"customerId\": 1," + 
        "\"workerId\": 6" + 
        "}";

    System.out.println(json);
    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(put("/contract")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isBadRequest());

    transactionManager.commit(status);
  }

}
