package com.SFAE.SFAE;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import com.SFAE.SFAE.IMPLEMENTATIONS.ContractImpl;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ContractTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private PlatformTransactionManager transactionManager;

  @Autowired
  ContractImpl contractDao;

  @Test
  public void testCreateContract() throws Exception {

    String json = "{" +
        "\"jobType\": \"INSTALLATEUR\"," +
        "\"adress\": \"Quizostrasse32\"," +
        "\"payment\": \"CASH\"," +
        "\"description\": \"Ich brauche jeamanden, der sich um die Plfanzen für 2 Studnen kümmert.\"," +
        "\"statusOrder\": \"UNDEFINED\"," +
        "\"range\": 1.5," + 
        "\"customerId\": \"C1\"," + 
        "\"maxPayment\": 50.0," +
        "\"workerId\": \"W1\"," +
        "\"latitude\": 52.5347706933045," +
        "\"longitude\": 13.35002718682623"+
        "}";

    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(post("/contract")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isCreated());

    transactionManager.commit(status);
  }

  @Test 
  public void testCreateContractWithOutData() throws Exception{
    String json="";
    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(post("/contract")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isBadRequest());

    transactionManager.commit(status);
  }

  @Test 
  public void testCreateContractWithNotAllData() throws Exception{
    String json = "{" +
  "\"jobType\": \"GÄRTNER\"," +
  "\"adress\": \"Quizostrasse32\"," +
  "\"payment\": \"CASH\"," +
  "\"description\": \"Ich brauche jeamanden, der sich um die Plfanzen für 2 Studnen kümmert.\"," +
  "\"statusOrder\": \"UNDEFINED\"," +
  "}";
    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(post("/contract")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isBadRequest());

    transactionManager.commit(status);
  }


  @Test
  public void testGetContract() throws Exception {

    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(get("/contract/3"))
        .andExpect(status().isOk())
        .andReturn();

    transactionManager.commit(status);
  }

  @Test
  public void testGetContractWithNegativeID() throws Exception {

    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(get("/contract/-1"))
        .andExpect(status().isBadRequest())
        .andReturn();

    transactionManager.commit(status);
  }

  @Test
  public void testGetContractNotFound() throws Exception {

    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(get("/contract/100"))
        .andExpect(status().isNotFound())
        .andReturn();
    transactionManager.commit(status);
  }

  @Test
  public void testDeleteContract()throws Exception{
    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(delete("/contract/3"))
        .andExpect(status().isOk())
        .andReturn();

    transactionManager.commit(status);
  }

  @Test
  public void testDeleteContractNegativeId() throws Exception{

    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    mockMvc.perform(delete("/contract/-1"))
        .andExpect(status().isBadRequest())
        .andReturn();

    transactionManager.commit(status);

  }

  @Test
  public void testDeleteContractNotExistingId() throws Exception{
    assertThrows(IllegalArgumentException.class, () -> {
            contractDao.deleteContract(1000); 
        });
    }


  @Test
  public void testUpdateContract() throws Exception {

    String json = "{" +
        "\"id\":\"3\","+
        "\"jobType\": \"HAUSMEISTER\"," +
        "\"adress\": \"Quizostrasse32\"," +
        "\"payment\": \"CASH\"," +
        "\"description\": \"ASD\"," +
        "\"statusOrder\": \"UNDEFINED\"," +
        "\"range\": 2.2," + 
        "\"customerId\": \"C2\"," + 
        "\"workerId\": \"W1\"" + 
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
        "\"latitude\": 52.5347706933045," +
        "\"longitude\": 13.35002718682623"+ 
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
public void testCountAllContracts() throws Exception {

     MvcResult mvcResult = mockMvc.perform(get("/contract/all"))
            .andExpect(status().isOk())
            .andReturn();

    String contentAsString = mvcResult.getResponse().getContentAsString();
    System.out.println("A " + contentAsString);
}

@Test
public void testGetContractByCustomerId() throws Exception {

  TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

  mockMvc.perform(get("/contract/customer/C3"))
      .andExpect(status().isOk())
      .andReturn();

  transactionManager.commit(status);
}


@Test
public void testGetContractByWorkerId() throws Exception {

  TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

  MvcResult mvcResult =mockMvc.perform(get("/contract/worker/W4"))
      .andExpect(status().isOk())
      .andReturn();

  transactionManager.commit(status);

  String contentAsString = mvcResult.getResponse().getContentAsString();
  System.out.println("A " + contentAsString);
}

@Test
public void testStatusAndStatusOrder() throws Exception {

  String json = "{" +
  "\"id\": 207," +
  "\"jobType\": \"INSTALLATEUR\"," +
  "\"address\": \"Rathenowerstrasse 36\"," +
  "\"payment\": \"CASH\"," +
  "\"maxPayment\": 34.0," +
  "\"description\": \"ASdadadD\"," +
  "\"statusOrder\": \"UNDEFINED\"," +
  "\"range\": 2.2," + 
  "\"customerId\": \"C1\"," + 
  "\"workerId\": \"W12\"," +
  "\"latitude\": 52.5347706933045," +
  "\"longitude\": 13.35002718682623" + 
  "}";

  MvcResult mvcResult = mockMvc.perform(put("/contract/true")
  .contentType(MediaType.APPLICATION_JSON)
  .content(json))
  .andExpect(status().isOk())
  .andReturn();

    String contentAsString = mvcResult.getResponse().getContentAsString();
    System.out.println("A " + contentAsString);
}

@Test
public void testGetContractStatus() throws Exception {

  TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

  MvcResult mvcResult =  mockMvc.perform(get("/contract/status/241"))
      .andExpect(status().isOk())
      .andReturn();

  transactionManager.commit(status);


  String contentAsString = mvcResult.getResponse().getContentAsString();
  System.out.println("A " + contentAsString);
}


}

