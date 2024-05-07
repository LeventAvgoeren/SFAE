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
public class ContractTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private PlatformTransactionManager transactionManager;

  @Test
  public void testCreateContract() throws Exception {
    String json = "{" +
    "\"jobType\": \"GÄRTNER\"," +
    "\"adress\": \"Quizostrasse 32\"," +
    "\"payment\": \"CASH\"," +
    "\"description\": \"Ich habe meinen hund gegesssen weil ich dachte er wäre ein chicken wing mein name ist\"," +
    "\"statusOrder\": \"UNDEFINED\"," +
    "\"range\": \"2.2\"," +
    "\"customer\": \"1\"," +
    "\"worker\": 6" +
"}";
      System.out.println(json);
      TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

      mockMvc.perform(post("/contract")
              .contentType(MediaType.APPLICATION_JSON)
              .content(json))
              .andExpect(status().isCreated());

      transactionManager.commit(status);  
  }
  
}
